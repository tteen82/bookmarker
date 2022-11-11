const Sequelize = require("sequelize");
const { STRING } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/bookmarker"
);

const Category = db.define("category", {
  name: {
    type: STRING,
  },
});

const Bookmark = db.define("bookmark", {
  name: {
    type: STRING,
  },
  url: {
    type: STRING,
  },
});

Bookmark.belongsTo(Category);

const syncAndSeed = async () => {
  const [coding, search, jobs] = await Promise.all(
    ["coding", "search", "jobs"].map((name) => Category.create({ name }))
  );
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
        categoryId: coding.id,
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

module.exports = {
  db,
  Bookmark,
  Category,
  syncAndSeed,
};
