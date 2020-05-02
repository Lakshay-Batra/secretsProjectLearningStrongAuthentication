require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String ,
    password: String
});

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
    const emailEntered = req.body.email;
    const passwordEntered = req.body.password;
    //to check if user is already registered or not
    User.findOne({ email: emailEntered }, (err, foundUser) => {
        //if no error
        if (!err) {
            // if user not already registrated
            if (!foundUser) {

                bcrypt.hash(passwordEntered, saltRounds, function(error, hash) {
                    const newUser = new User({
                        email: emailEntered ,
                        password: hash
                    });
                    newUser.save((err) => {
                        if (!err) {
                            res.render("secrets");
                        }
                    });

                });

            } else {
                res.send("Already Registered");
            }
        }
    });
});

app.post("/login", (req, res) => {
    const emailEntered = req.body.email;
    const passwordEntered = req.body.password;
    User.findOne({ email: emailEntered }, (err, foundUser) => {
        if (!err) {
            if (foundUser) {
                bcrypt.compare(passwordEntered, foundUser.password, function(error, compareResult) {
                    if (compareResult === true) {
                        res.render("secrets");
                    } else {
                        res.send("Wrong Password");
                    }
                });
            }
        }
    });
});

app.listen(3000, (req, res) => {
    console.log("server started at 3000");
});