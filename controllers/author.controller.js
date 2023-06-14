const { errorHandler } = require("../helpers/error_handler");
const Author = require("../models/Author");
const { authorValidation } = require("../validations/author.validation");
const bcrypt = require("bcrypt");
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
    const hashedpassword = bcrypt.hashSync(author_password);

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
    });
    await newAuthor.save();
    res.json({ message: "Create success", author: newAuthor });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { author_email, author_password } = req.body;
    const author = await Author.findOne({ author_email });
    if (!author)
      return res.status(400).send({ message: "email yoki parol notug'ri!" });
    const validPassword = bcrypt.compareSync(
      author_password,
      author.author_password
    );
    if (!validPassword)
      return res.status(400).send({ message: "email yoki parol notug'ri!" });
    res.status(200).send({ message: "Tizimga hush kelibsiz" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find({});
    if (authors.length < 1) {
      return res.status(400).json({ message: "Author is empty" });
    }
    res.json({ length: authors.length, data: authors });
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

// async function getAuthorByName(req, res) {
//   try {
//     const name = req.params.q;
//     const cat = await Author.findOne({ author_name: name }).populate(
//       "parent_author_id"
//     );
//     if (!cat) {
//       return res.status(400).json({ message: "Author not found" });
//     }
//     res.json(cat);
//   } catch (error) {
//     console.log(error);
//     errorHandler(res, error);
//   }
// }

// async function deleteAuthor(req, res) {
//   try {
//     const _id = req.params.id;
//     const cat = await Author.findOneAndDelete({ _id });
//     if (!cat) {
//       return res.status(400).json({ message: "Author doesn't exist" });
//     }
//     res.json({ message: "Deleted success" });
//   } catch (error) {
//     console.log(error);
//     errorHandler(res, error);
//   }
// }

// async function updateAuthor(req, res) {
//   try {
//     const _id = req.params.id;
//     const { author_name, parent_author_id } = req.body;
//     const cat = await Author.findOneAndUpdate(
//       { _id },
//       { author_name, parent_author_id },
//       { new: true }
//     );
//     if (!cat) {
//       return res.status(400).json({ message: "Author not found" });
//     }
//     res.json({ message: "Update success", updatedTo: cat });
//   } catch (error) {
//     console.log(error);
//     errorHandler(res, error);
//   }
// }

module.exports = {
  addAuthor,
  getAllAuthors,
  getAuthorById,
  loginAuthor,
  // getAuthorByName,
  // deleteAuthor,
  // updateAuthor,
};
