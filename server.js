const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
passport = require("passport");
bodyParser = require("body-parser");
LocalStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");
User = require("./models/user");

const host = "http://127.0.0.1";

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/bootcamp");

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connection Successful!");
});

const app = express();
// app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));
app.use(
  require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================
// ROUTES
//=====================

// Showing index page
app.get("/", function (req, res) {
  res.render("index");
});

// Showing home page
app.get("/home", function (req, res) {
  res.render("home");
});

// Showing register form
app.get("/sign_up", function (req, res) {
  res.render("log_in_up");
});

// Handling user signup
// app.post("/sign_up", function (req, res) {
//   var fullname = req.body.fullname;
//   var email = req.body.email;
//   var password = req.body.password;
//   // var Confirmer = req.body.Confirmer;

//   User(
//     new User({ fullname: fullname, email: email }),
//     password,
//     function (err, user) {
//       if (err) {
//         console.log(err);
//         return res.render("log_in_up");
//       }

//       passport.authenticate("local")(req, res, function () {
//         res.render("Signup_Success");
//       });
//     }
//   );
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
app.post("/sign_in", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
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
//Handling user logout
// app.get("/logout", function (req, res) {
//   req.logout();
//   res.redirect("/log_in_up");
// })

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect("/log_in_up");
// }

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`Server listenring on ${host}:${port}`);
});
