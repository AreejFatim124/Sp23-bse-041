
const mongoose = require("mongoose")
const express = require("express");

let router = express.Router();
let multer=require("multer");
let product = require("../../models/product.model");
let Category = require("../../models/category.model");

const storage = multer.diskStorage({
    destination: function(req , file , cb){
        cb(null,"./uploads")
    },
    filename: function(req , file , cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage });

router.get("/placeorder/products/login",(req,res)=>{
    res.render("WebsitePages/Clientside/loginsignup",{layout:false});
})

router.get("/admin/dashboard",(req,res)=>{
    res.render("WebsitePages/AdminPanel/dashboard",{layout: "adminLayout.ejs"});
})

router.get("/admin/analytics",(req,res)=>{
    res.render("WebsitePages/AdminPanel/analytics",{layout: "adminLayout.ejs"});
})

// for products 

router.get("/admin/products",async(req,res)=>{
    let products = await product.find()
    res.render("WebsitePages/AdminPanel/products",{layout: "adminLayout.ejs",products});
})

router.get("/admin/products/create",(req,res)=>{
    res.render("WebsitePages/AdminPanel/create",{layout: "adminLayout.ejs"});
})
router.post("/admin/products/create",upload.single("file"),async (req,res)=>{
    let product = new product(req.body)  
    if(req.file) product.picture =req.file.filename; 
    product.isFeatured = Boolean(req.body.isFeatured)
    await product.save()
    res.redirect("/admin/products")
 })

 router.get("/admin/products/edit/:id",async (req,res)=>{
    let product = await product.findById(req.params.id)
    res.render("WebsitePages/AdminPanel/editform",{layout: "adminLayout.ejs",product})
})
router.post("/admin/products/edit/:id",async (req,res)=>{
    let product = await product.findById(req.params.id)
    product.title = req.body.title
    product.source = req.body.source
    product.description = req.body.description
    product.price = req.body.price
    product.isFeatured = Boolean(req.body.isFeatured)
    await product.save()
    return res.redirect("/admin/products")
})


router.get("/admin/products/delete/:id",async(req,res)=>{
    await product.findByIdAndDelete(req.params.id)
    return res.redirect("/admin/products")
})


router.get("/admin/dashboard",async (req,res)=>{
    let products = await product.find();
    res.render("WebsitePages/AdminPanel/dashboard",{layout: "adminLayout.ejs", products});
})

router.get("/admin/products/create",(req,res)=>{
    res.render("WebsitePages/AdminPanel/create",{layout: "adminLayout.ejs"});
})

// for catagory 

router.get("/admin/viewcatagories",async(req,res)=>{
    let category= await Category.find()
    res.render("WebsitePages/AdminPanel/category",{layout: "adminLayout.ejs",category});
})


router.post("/admin/products/createCategory",async (req,res)=>{
    let category= new Category(req.body);
    await category.save()
    res.redirect("/admin/categories")
 })

 router.get("/admin/categories/delete/:id",async(req,res)=>{
    await Category.findByIdAndDelete(req.params.id)
    return res.redirect("/admin/categories")
})

router.get("/admin/categories/edit/:id",async (req,res)=>{
    let category = await Category.findById(req.params.id)
    res.render("WebsitePages/AdminPanel/editCatetory",{layout: "adminLayout.ejs",category})
})

router.post("/admin/categories/edit/:id",async (req,res)=>{
    let category = await Category.findById(req.params.id)
    category.categoryName = req.body.categoryName
    await category.save()
    return res.redirect("/admin/categories")
})


router.get("/admin/products/createCategory", (req,res)=>{
    res.render("WebsitePages/AdminPanel/createCategory",{layout: "adminLayout.ejs"});
})

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Simulate checking the username and password
    if (username === "user" && password === "password") {
        res.redirect("/place-order");
    } else {
        res.redirect("/login?error=Invalid credentials"); // Redirect with an error message
    }
});






module.exports = router;