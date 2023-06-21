const { errorHandler } = require("../helpers/error_handler");
const Author = require("../models/Author");
// const jwt = require("jsonwebtoken");
const { authorValidation } = require("../validations/author.validation");
const bcrypt = require("bcrypt");
const config = require("config");

const uuid = require("uuid");
const mailService = require("../services/MailService");

const myJwt = require("../services/JwtService");

// const generateAccessToken = (id, is_expert, authorRoles) => {
//   const payload = {
//     id,
//     is_expert,
//     authorRoles,
//   };
//   return jwt.sign(payload, config.get("secret"), { expiresIn: "1h" });
// };

const loginAuthor = async (req, res) => {
  try {
    const { author_email, author_password } = req.body;

    const author = await Author.findOne({ author_email });
    console.log(author);
    if (!author)
      return res.status(400).send({ message: "email yoki parol notug'ri!" });
    const validPassword = bcrypt.compareSync(
      author_password,
      author.author_password
    );

    if (!validPassword)
      return res.status(400).send({ message: "email yoki parol notug'ri!" });
    const payload = {
      id: author._id,
      is_expert: author.is_expert,
      authorRoles: ["READ", "WRITE"],
    };

    //uncauhtEheption
    try {
      setTimeout(function(){
        var error= new Error("HELLO");
        throw error;
      },1000);
    } catch (error) {
      console.log(error);
    }
    // unhandledRejection
    new Promise((_,reject)=>reject(new Error("woops1")))

    const tokens = myJwt.generateTokens(payload);
    console.log(tokens);
    // const token = generateAccessToken(author._id, author.is_expert, [
    //   "READ",
    //   "WRITE",
    // ]);

    author.author_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.status(200).send({ tokens });
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.error(400, { message: "Token is not found" });
    const authorauthorFromCookie = await myJwt.verifyRefresh(refreshToken);
    const authorauthorFromDb = await Author.findOne({
      author_token: refreshToken,
    });
    if (!authorauthorFromCookie || !authorauthorFromDb) {
      return res.json(400, { message: "Author is not registered" });
    }
    const author = await Author.findById(authorauthorFromCookie.id);
    if (!author) return res.error(400, { message: "ID is incorrect" });
    const payload = {
      id: author.id,
      author_is_expert: author.author_is_expert,
      authorRoler: ["READ", "WRITE"],
    };
    const tokens = myJwt.generateTokens(payload);
    author.author_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    res.status(200).send({ ...tokens });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const logoutAuthor = async (req, res) => {
  const { refreshToken } = req.cookies;
  let author;
  if (!refreshToken) return res.error(400, { message: "Token is not found" });
  author = await Author.findOneAndUpdate(
    { author_token: refreshToken },
    { author_token: "" },
    { new: true }
  );
  if (!author) return res.status(400, { message: "Token is not found" });
  res.clearCookie("refreshToken");
  res.status(200).send({ author });
};

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const {
      author_firstname,
      author_lastname,
      author_nickname,
      author_password,
      author_email,
      author_phone,
      author_info,
      author_position,
      author_photo,
      is_expert,
    } = value;
    const author = await Author.findOne({ author_email });
    if (author) {
      return res.status(400).json({ message: "Author is already exists" });
    }
    const hashedpassword = await bcrypt.hash(author_password, 7);
    const author_activation_link = uuid.v4();
    const newAuthor = await Author.create({
      author_firstname,
      author_lastname,
      author_nickname,
      author_password: hashedpassword,
      author_email,
      author_phone,
      author_info,
      author_position,
      author_photo,
      is_expert,
      author_activation_link,
    });
    await newAuthor.save();
    await mailService.sendActivationMail(
      author_email,
      `${config.get("api_url")}/api/author/activate/${author_activation_link}`
    );
    const payload = {
      id: newAuthor._id,
      is_expert: newAuthor.is_expert,
      authorRoles: ["READ", "WRITE"],
      author_is_active: newAuthor.author_is_active,
    };
    const tokens = myJwt.generateTokens(payload);
    newAuthor.author_token = tokens.refreshToken;

    await newAuthor.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.json({ ...tokens, author: payload });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find({});
    if (authors.length < 1) {
      return res.status(400).json({ message: "Author is empty" });
    }
    res.json({ length: authors.length, author: authors });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

async function getAuthorById(req, res) {
  try {
    const _id = req.params.id;
    const author = await Author.findOne({ _id });
    if (!author) {
      return res.status(400).json({ message: "Author not found" });
    }
    res.json(author);
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
}

const authorActivate = async (req, res) => {
  try {
    const author = await Author.findOne({
      author_activate_link: req.params.link,
    });
    console.log(req.params.link);
    if (!author)
      return res.status(404).send({ message: "author is not found" });

    if (author.author_is_active)
      return res.status(404).send({ message: "user already activate" });

    author.author_is_active = true;
    await author.save();
    res.status(200).send({
      author_is_active: author.author_is_active,
      message: "user activated",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

async function getAuthorByName(req, res) {
  try {
    const name = req.params.q;
    const cat = await Author.findOne({ author_name: name }).populate(
      "parent_author_id"
    );
    if (!cat) {
      return res.status(400).json({ message: "Author not found" });
    }
    res.json(cat);
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
}

async function deleteAuthor(req, res) {
  try {
    const _id = req.params.id;
    if (_id!==req.uthor.id) {
      return res.status(401).send({ message: "sizda bunday huquq yuq" });
    }
    const result = await Author.findOneAndDelete({ _id });
      if (result == null) {
        return res.status(400).send({ message: "id is incorect" });
      }
    res.status(200).send({ message: "Deleted success" });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
}

async function updateAuthor(req, res) {
  try {
    const _id = req.params.id;
    const { author_name, parent_author_id } = req.body;
    const cat = await Author.findOneAndUpdate(
      { _id },
      { author_name, parent_author_id },
      { new: true }
    );
    if (!cat) {
      return res.status(400).json({ message: "Author not found" });
    }
    res.json({ message: "Update success", updatedTo: cat });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
}

module.exports = {
  refreshAuthorToken,
  addAuthor,
  logoutAuthor,
  getAllAuthors,
  getAuthorById,
  loginAuthor,
  authorActivate,
  getAuthorByName,
  deleteAuthor,
  updateAuthor,
};
