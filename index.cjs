const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo"); // Note: You might need to access a specific property depending on how this package is structured.
const UserRouter = require("./routes/UserRoute.js");
const AdminRouter = require("./routes/AdminRoute.js");
const ProductRouter = require("./routes/Products.js");

const app=express()
dotenv.config()

app.use(session({
    secret:"Keyboard CAt",
    resave:false,
    saveUninitialized:true,
    store :MongoStore.create({mongoUrl :"mongodb+srv://parasji014_db_user:parasji@cluster1.1dip1zl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"})
}))



// Genric Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// Routing 
app.use("/user",UserRouter)
app.use("/admin",AdminRouter)
app.use("/product",ProductRouter)





mongoose.connect("mongodb+srv://parasji014_db_user:parasji@cluster1.1dip1zl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1")
.then(()=>{
    app.listen(process.env.Port,(err)=>{
        if(!err)console.log('Ported')
    })
})
.catch((err)=>{
    console.log(`The Code Ended With Erors ${err}`)
})