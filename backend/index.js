require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "secret_ecom"; // Store in .env

app.use(express.json());
app.use(cors({ origin: "https://yaxso-e-commerce-gijy.onrender.com" }));

// Database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("✅ Express App is Running");
});

// Image storage setup
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `https://yaxso-e-commerce-gijy.onrender.com/images/${req.file.filename}`,
  });
});

// Product Schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// ✅ Add Product
app.post("/addproduct", async (req, res) => {
  try {
    let lastProduct = await Product.findOne().sort({ id: -1 });
    const newProduct = new Product({
      id: lastProduct ? lastProduct.id + 1 : 1,
      ...req.body,
    });
    await newProduct.save();
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Remove Product
app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get All Products
app.get("/allproducts", async (req, res) => {
  try {
    let products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User Schema
const User = mongoose.model("User", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: { type: Object, default: {} },
  date: { type: Date, default: Date.now },
});

// ✅ Signup
app.post("/signup", async (req, res) => {
  try {
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(400).json({ success: false, error: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Initialize empty cart
    const cart = Object.fromEntries([...Array(300).keys()].map((i) => [i, 0]));

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      cartData: cart,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ success: false, error: "User not found" });

    // Compare password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).json({ success: false, error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get New Collections
app.get("/newcollections", async (req, res) => {
  try {
    let products = await Product.find();
    res.send(products.slice(-8));
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get Popular in Women
app.get("/popularinwomen", async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    res.send(products.slice(0, 4));
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ Add to Cart
app.post("/addtocart", fetchUser, async (req, res) => {
  let user = await User.findById(req.user.userId);
  user.cartData[req.body.itemId] += 1;
  await user.save();
  res.send("Added");
});

// ✅ Remove from Cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  let user = await User.findById(req.user.userId);
  if (user.cartData[req.body.itemId] > 0) user.cartData[req.body.itemId] -= 1;
  await user.save();
  res.send("Removed");
});

// ✅ Get Cart Data
app.post("/getcart", fetchUser, async (req, res) => {
  let user = await User.findById(req.user.userId);
  res.json(user.cartData);
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));







// require('dotenv').config();
// const PORT = process.env.PORT || 4000;
// const MONGO_URI = process.env.MONGO_URI;
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");


// app.use(express.json());
// app.use(cors());

// // database connection with mongoDb
// // mongoose.connect("mongodb+srv://sisusisu:sisu1234@cluster0.i7lo9.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0")
// // .then(()=>console.log('database connected'))
// // .catch(()=>console.log('database not connected'));

// mongoose.connect(MONGO_URI)
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.error("MongoDB Connection Error:", err));




// app.use(cors({ origin: "https://yaxso-e-commerce-gijy.onrender.com" }));

  

// // ApI cration

// app.get("/",(req,res)=>{
//     res.send("Express App is Running")
// })

// // image storage engine

// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename:(req,file,cb)=>{
//         return cb(null,`${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({storage:storage})

// // Creating upload Endpoint for images

// app.use('/images',express.static('upload/images'))

// app.post("/upload",upload.single('product'),(req,res)=>{
//     res.json({
//         success:1,
//         image_url:`https://localhost:${PORT}/images/${req.file.filename}`
//     })
// })

// // Schema for creating product

// const Product = mongoose.model("Product",{
//     id:{
//         type: Number,
//         required:true,
//     },
//     name:{
//         type:String,
//         required:true,
//     },
//     image:{
//         type:String,
//         required:true,
//     },
//     category:{
//         type:String,
//         required:true,
//     },
//     new_price:{
//         type:Number,
//         required:true,
//     },
//     old_price:{
//         type:Number,
//         required:true,
//     },
//     date:{
//         type:Date,
//         default:Date.now,
//     },
//     available:{
//         type:Boolean,
//         default:true,
//     },
// })

// app.post('/addproduct',async(req,res)=>{
//     let products = await Product.find({});
//     let id;
//     if(products.length>0)
//     {
//         let last_product_array =products.slice(-1);
//         let last_product = last_product_array[0];
//         id = last_product.id+1;
//     }
//     else{
//         id=1;
//     }
//     const product = new Product({
//         id:id,
//         name:req.body.name,
//         image:req.body.image,
//         category:req.body.category,
//         new_price:req.body.new_price,
//         old_price:req.body.old_price,
//     });
//     console.log(product);
//     await product.save();
//     console.log("Saved");
//     res.json({
//         success:true,
//         name:req.body.name,
//     })
// })

// // creating api for deleting product

// app.post('/removeproduct',async (req,res)=>{
//     await Product.findOneAndDelete({id:req.body.id});
//     console.log("Removed");
//     res.json({
//         success:true,
//         name:req.body.name
//     })
// })

// // creating api for getting all products
// app.get('/allproducts',async (req,res)=>{
//     let products = await Product.find({});
//     console.log("All Products Fetched");
//     res.send(products);
// })

// // Shema creating for user model

// const Users = mongoose.model('Users',{
//     name:{
//         type:String,
//     },
//     email:{
//         type:String,
//         unique:true,
//     },
//     password:{
//         type:String,
//     },
//     cartData:{
//         type:Object,
//     },
//     date:{
//         type:Date,
//         default:Date.now,
//     }
// })

// // creating endpoint for register the user
// app.post('/signup',async (req,res)=>{

//     let check = await Users.findOne({email:req.body.email});
//     if (check){
//         return res.status(400).json({success:false,error:"existing user found with same email address"})
//     }
//     let cart ={};
//     for (let i = 0; i < 300; i++) {
//         cart[i]=0;
//     }
//     const user = new Users({
//         name:req.body.username,
//         email:req.body.email,
//         password:req.body.password,
//         cartData:cart,
//     })

//     await user.save();

//     const data = {
//         user:{
//             id:user.id
//         }
//     }

//     const token = jwt.sign(data,'secret_ecom');
//     res.json({success:true,token})
// })

// // creating end point for user login
// app.post('/login',async (req,res)=>{
//     let user = await Users.findOne({email:req.body.email});
//     if (user){
//         const passCompare = req.body.password === user.password;
//         if(passCompare) {
//             const data = {
//                 user:{
//                     id:user.id
//                 }
//             }
//             const token = jwt.sign(data,'secret_ecom');
//             res.json({success:true,token});
//         }
//         else{
//             res.json({success:false,error:"wrong password"});
//         }
//     }
//     else{
//         res.json({success:false,errors:"wrong Email Id"})
//     }
// })

// // crating endpoint for newcollection data
// app.get('/newcollections',async(req,res)=>{
//     let products = await Product.find({});
//     let newcollection = products.slice(1).slice(-8);
//     console.log("NewCollection Fetched");
//     res.send(newcollection);
// })

// // creating endpoint for popular in women section
// app.get('/popularinwomen',async (req,res)=>{
//     let products = await Product.find({category:"women"});
//     let popular_in_women = products.slice(0,4);
//     console.log("Popular in women fetched");
//     res.send(popular_in_women);
// })

// // creating middleware to fetch user
// const fetchUser = async (req,res,next)=>{
//     const token = req.header('auth-token');
//     if(!token)
//     {
//         res.status(401).send({errors:"Please authenticate using vaild token"})
//     }
//     else{
//         try{
//             const data = jwt.verify(token,'secret_ecom');
//             req.user = data.user;
//             next();
//         } catch (error) {
//             res.status(401).send({errors:"please authenticate using a vaild token"})
//         }
//     }
// } 

// // creating endpoint for adding products in cartdata
// app.post('/addtocart',fetchUser,async (req,res)=>{ 
//     console.log("Added",req.body.itemId); 
//     let userData = await Users.findOne({_id:req.user.id});
//     userData.cartData[req.body.itemId] += 1;
//     await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
//     res.send("Added")   
// })

// // creating endpoint to remove product from cartdata
// app.post('/removefromcart',fetchUser,async (req,res)=>{
//     console.log("removed",req.body.itemId);
//     let userData = await Users.findOne({_id:req.user.id});
//     if(userData.cartData[req.body.itemId]>0)
//     userData.cartData[req.body.itemId] -= 1;
//     await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
//     res.send("Removed")
// })

// // creating endpoint to get cartdata
// app.post('/getcart',fetchUser,async (req,res)=>{
//     console.log("GetCart");
//     let userData = await Users.findOne({_id:req.user.id});
//     res.json(userData.cartData);
// })

// app.listen(PORT,(error)=>{
//     if(!error){
//         console.log("Server Runing on Port "+PORT)
//     }
//     else
//     {
//         console.log("Error : "+error)
//     }
// })