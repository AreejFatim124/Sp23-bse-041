const mongoose = require("mongoose")

let productschema = new mongoose.Schema({
    title : String,
    source : String,
    description : String,
    picture: String,
    price : Number,
    isFeatured : {type: Boolean, default: false}
})

let product = mongoose.model("product",productschema);
module.exports = product