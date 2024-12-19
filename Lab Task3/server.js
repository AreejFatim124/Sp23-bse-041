const express = require("express");
const app = express();
var expressLayouts = require('express-ejs-layouts');
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(expressLayouts);
app.get("/", (req, res) => {
  res.render('GourmetFoods');
});


const PORT=9900;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});