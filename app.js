require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String ,
    password: String
});


userSchema.plugin(encrypt , {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {

    res.render("register");
});

app.post("/register", (req, res) => {
    // User.findOne({ email: req.body.email }, (err, foundUser) => {
    //     if (!err) {
    //         if (!foundUser) {
    //             const newUser = new User({
    //                 email: req.body.email,
    //                 password: req.body.password
    //             });
    //             newUser.save((err) => {
    //                 if (!err) {
    //                     res.render("secrets");
    //                 }
    //             });
    //         }
    //     }
    // });
    const newUser = new User({
        email: req.body.email ,
        password: req.body.password
    });
    newUser.save((err) => {
        if (!err) {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (!err) {
            if (foundUser) {
                if (foundUser.password === req.body.password) {
                    res.render("secrets");
                } else {
                    res.send("Wrong Password");
                }
            }
        }
    });
});

app.listen(3000, (req, res) => {
    console.log("server started at 3000");
});