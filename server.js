const { db, Bookmark, Category, syncAndSeed } = require("./db");
const express = require("express");
const app = express();
const path = require("path");

app.use(require("method-override")("_method"));
app.use(express.urlencoded({ extended: false }));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", async (req, res, next) => {
  res.redirect("/bookmarks");
});

const head = () => {
  return `
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel='stylesheet' href='/assets/style.css'' />
    <title>Document</title>
  </head>
  `;
};

app.delete("/categories/:id", async (req, res, next) => {
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

app.post("/bookmarks", async (req, res, next) => {
  try {
    const bookmark = await Bookmark.create(req.body);
    res.redirect(`/categories/${bookmark.categoryId}`);
  } catch (ex) {
    next(ex);
  }
});

app.get("/bookmarks", async (req, res, next) => {
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
  <ul>
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

app.get("/categories/:id", async (req, res, next) => {
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
    <li>${bookmark.name} - ${bookmark.category.name}
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

const init = async () => {
  try {
    await db.sync({ force: true });
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
