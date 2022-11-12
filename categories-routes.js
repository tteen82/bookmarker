const { Bookmark, Category } = require("./db");
const head = require("./assets/templates");
const express = require("express");
const router = express.Router();

router.delete("/:id", async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id, {
      include: [Category],
    });
    await bookmark.destroy();
    res.redirect(`/categories/${bookmark.category.id}`);
  } catch (ex) {
    next(ex);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
      include: [Category],
      where: {
        categoryId: req.params.id,
      },
    });
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
${head()}
  <body>
  <div>
  <h1> Bookmarker</h1>
  <h2>${bookmarks[0].category.name}</h2>
  <ul id='detailUl'>
    ${bookmarks
      .map(
        (bookmark) => `
    <li>${bookmark.name} - ${bookmark.category.name} <br> ${bookmark.url}
    <form method='POST' action="/categories/${bookmark.id}?_method=DELETE" >
    <button> x </button>
    </form>
    </li>
    `
      )
      .join("")}
    </ul>
    </div>
    <div>
     <button> <a href='../'> back </a> </button>
     </div>
  </body>
  </html>
  `);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
