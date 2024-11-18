const express = require("express");
let app = express();
var expressLayouts = require('express-ejs-layouts');

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/cv", (req, res) => {
  res.render('CV');
});

app.get("/", (req, res) => {
  res.render('GourmetFoods');
});

app.listen(5500, () => {
  console.log("Server started at localhost:5500");
});