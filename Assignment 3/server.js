const express = require("express");
const app = express();
var expressLayouts = require('express-ejs-layouts');
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/CV", (req, res) => {
  res.render('CV');
});
app.use(expressLayouts);
app.get("/", (req, res) => {
  res.render('GourmetFoods');
});

app.listen(1500, () => {
  console.log("Server started at http://localhost:1500");
});