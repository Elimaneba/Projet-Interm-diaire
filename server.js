const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
bodyParser = require("body-parser");

const User = require("./models/user");

const host = "http://127.0.0.1";

var mongoose = require("mongoose");
const user = require("./models/user");
mongoose.connect("mongodb://localhost:27017/bootcamp");

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connection Successful!");
});

//;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

//=====================
// ROUTES
//=====================

// Showing index page
app.get("/", function (req, res) {
  res.render("index");
});

//Showing home page
app.get("/home", function (req, res) {
  res.render("home");
});

// Showing register form
app.get("/sign_up", function (req, res) {
  res.render("log_in_up");
});

// Showing register form
// app.get("/profil", function (req, res) {
//   res.render("home");
// });

app.post("/sign_up", function (req, res) {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      password: hash,
      fullname: req.body.fullname,
      email: req.body.email,
    });
    db.collection("users").insertOne(user, function (err, collection) {
      if (err) throw err;
      console.log("Record inserted Successfully");
    });
    return res.redirect("Signup_Success.html");
  });
});

//Showing login form
app.get("/sign_in", function (req, res) {
  res.render("log_in_up");
});

//Handling user login
app.post("/sign_in", async (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.statusCode(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          return res.redirect("home.html").json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
});


app.put("/profil", function (req, res) {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      password: hash,
      fullname: req.body.fullname,
      email: req.body.email,
    });
    db.collection("users").insertOne(user, function (err, collection) {
      if (err) throw err;
      console.log("Record inserted Successfully");
    });
    return res.redirect("Signup_Success.html");
  });
});


//Handling user logout
app.get("/logout", function (req, res) {
  res.redirect("/");
});

let newName = user.fullname;
module.exports = newName;

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`Server listenring on ${host}:${port}`);
});
