const { db, syncAndSeed } = require("./db");
const express = require("express");
const app = express();
const path = require("path");

app.use(require("method-override")("_method"));
app.use(express.urlencoded({ extended: false }));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", async (req, res) => {
  res.redirect("/bookmarks");
});
app.use("/bookmarks", require("./bookmarks-routes"));
app.use("/categories", require("./categories-routes"));

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
