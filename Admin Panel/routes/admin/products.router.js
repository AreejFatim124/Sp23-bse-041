
const mongoose = require("mongoose")
const express = require("express");

let router = express.Router();
let multer=require("multer");
let Product = require("../../models/product.model");
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


router.get("/admin/dashboard",(req,res)=>{
    res.render("WebsitePages/AdminPanel/dashboard",{layout: "admin-layout.ejs"});
})

router.get("/admin/analytics",(req,res)=>{
    res.render("WebsitePages/AdminPanel/analytics",{layout: "admin-layout.ejs"});
})

// for products 

router.get("/admin/products",async(req,res)=>{
    let products = await Product.find()
    res.render("WebsitePages/AdminPanel/products",{layout: "admin-layout.ejs",products});
})

router.get("/admin/products/create",(req,res)=>{
    res.render("WebsitePages/AdminPanel/create",{layout: "admin-layout.ejs"});
})
router.post("/admin/products/create",upload.single("file"),async (req,res)=>{
    let product = new Product(req.body)  
    if(req.file) product.picture =req.file.filename; 
    product.isFeatured = Boolean(req.body.isFeatured)
    await product.save()
    res.redirect("/admin/products")
 })

 router.get("/admin/products/edit/:id",async (req,res)=>{
    let product = await Product.findById(req.params.id)
    res.render("WebsitePages/AdminPanel/editform",{layout: "admin-layout.ejs",product})
})
router.post("/admin/products/edit/:id",async (req,res)=>{
    let product = await Product.findById(req.params.id)
    product.title = req.body.title
    product.source = req.body.source
    product.description = req.body.description
    product.price = req.body.price
    product.isFeatured = Boolean(req.body.isFeatured)
    await product.save()
    return res.redirect("/admin/products")
})


router.get("/admin/products/delete/:id",async(req,res)=>{
    await Product.findByIdAndDelete(req.params.id)
    return res.redirect("/admin/products")
})


router.get("/admin/dashboard",async (req,res)=>{
    let products = await Product.find();
    res.render("WebsitePages/AdminPanel/dashboard",{layout: "admin-layout.ejs", products});
})

router.get("/admin/products/create",(req,res)=>{
    res.render("WebsitePages/AdminPanel/create",{layout: "admin-layout.ejs"});
})

// for catagory 

router.get("/admin/viewcatagories",async(req,res)=>{
    let category= await Category.find()
    res.render("WebsitePages/AdminPanel/category",{layout: "admin-layout.ejs",category});
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
    res.render("WebsitePages/AdminPanel/editCatetory",{layout: "admin-layout.ejs",category})
})

router.post("/admin/categories/edit/:id",async (req,res)=>{
    let category = await Category.findById(req.params.id)
    category.categoryName = req.body.categoryName
    await category.save()
    return res.redirect("/admin/categories")
})


router.get("/admin/products/createCategory", (req,res)=>{
    res.render("WebsitePages/AdminPanel/createCategory",{layout: "admin-layout.ejs"});
})



module.exports = router;