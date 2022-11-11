const Sequelize = require("sequelize");
const { STRING, INTEGER } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/bookmarker"
);
const express = require("express");
const app = express();

const Bookmark = db.define("Bookmark", {
  name: {
    type: STRING,
  },
  url: {
    type: STRING,
  },
});

const Category = db.define("Category", {
  name: {
    type: STRING,
  },
});

Bookmark.belongsTo(Category);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [coding, search, jobs] = await Promise.all(
    ["coding", "search", "jobs"].map((name) => Category.create({ name }))
  );
  // await Promise.all(
  //   [
  //     Category.create({
  //       name: "coding",
  //     }),
  //   ],
  //   [
  //     Category.create({
  //       name: "search",
  //     }),
  //   ],
  //   [
  //     Category.create({
  //       name: "jobs",
  //     }),
  //   ]
  // );
  await Promise.all(
    [
      Bookmark.create({
        name: "Google",
        url: "https://www.google.com/",
        categoryId: search.id,
      }),
    ],
    [
      Bookmark.create({
        name: "Stack Overflow",
        url: "https://stackoverflow.com/",
        CategoryId: coding.id,
      }),
    ],
    [
      Bookmark.create({
        name: "Bing",
        url: "https://www.bing.com/",
        categoryId: search.id,
      }),
    ],
    [
      Bookmark.create({
        name: "LinkedIn",
        url: "https://www.linkedin.com/",
        categoryId: jobs.id,
      }),
    ],
    [
      Bookmark.create({
        name: "Indeed",
        url: "https://www.indeed.com/",
        categoryId: jobs.id,
      }),
    ],
    [
      Bookmark.create({
        name: "MDN",
        url: "https://developer.mozilla.org/en-US/",
        categoryId: coding.id,
      }),
    ]
  );
};

app.get("/bookmarks", async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
      include: [Category],
    });
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
  <ul>
    ${bookmarks
      .map(
        (bookmark) => `
    <li>${bookmark.name} - ${bookmark.CategoryId}
    </li>
    `
      )
      .join("")}
    </ul>
    
  </body>
  </html>
  `);
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.listen(port, () => console.log(`listening on ${port}`));
    await syncAndSeed();
  } catch (ex) {
    console.log(ex);
  }
};

init();
