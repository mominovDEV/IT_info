const Author = require("../models/Author");

async function getAllAuthors(req, res) {
  try {
    const authors = await Author.find();
    if (authors.length < 1) {
      return res.status(400).json({ message: "Author is empty" });
    }
    res.json({ length: authors.length, data: authors });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
}

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

async function addAuthor(req, res) {
  try {
    // const { error, value } = authorValidation(req.body);
    // if (error) {
    //   return res.status(400).send({ message: error.details[0].message });
    // }
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
    const newAuthor = await Author.create({
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
    });
    res.json({ message: "Create success", author: newAuthor });
  } catch (error) {
    console.log(error);
    errorHandler(res, error);
  }
}

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
  // getAuthorByName,
  // deleteAuthor,
  // updateAuthor,
};
