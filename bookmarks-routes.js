const { Bookmark, Category } = require("./db");
const head = require("./assets/templates");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const bookmark = await Bookmark.create(req.body);
    res.redirect(`/categories/${bookmark.categoryId}`);
  } catch (ex) {
    next(ex);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
      include: [Category],
    });
    const categories = await Category.findAll();
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
  ${head()}
  <body>
  <div>
  <h1> Bookmarker</h1>
  <ul id='bookmarksUl'>
    ${bookmarks
      .map(
        (bookmark) => `
    <li>${bookmark.name} - <a href='/categories/${bookmark.category.id}'> ${bookmark.category.name} </a>
    </li>
    `
      )
      .join("")}
    </ul>
    </div>
    <div  id='input'>
    <h2> add a bookmark </h2>
    <form method='post' action='/bookmarks' id='inputform'>
    <input name = 'name' placeholder='name'/>
    <input name = 'url' placeholder='url'/>
    <select name = 'categoryId'>
    <option> category </option>
    ${categories
      .map(
        (category) => `
      <option value='${category.id}'> ${category.name}</option>
      `
      )
      .join("")}
      </select>
    <button> Create </button>
    </form>
    <div>
  </body>
  </html>
  `);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
