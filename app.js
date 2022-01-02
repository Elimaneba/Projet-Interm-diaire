var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');
var cons = require('consolidate');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var userSchema = new mongoose.Schema({
  fullname: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Phone: {type: Number, default: 770000000},
  pays: { type: String, default: "pays non renseigner"},
  Region: {type: String, default: "region non renseigner"},
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://localhost:27017/tests');
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connection Successful!");
});

var app = express();

// Middleware
app.set('port', process.env.PORT || 3000);
app.engine('html', cons.swig)
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'session secret key' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', function(req, res){
  res.render('index.html')
});
app.get('/log_in_up', function(req, res){
  res.render('log_in_up.html')
});
app.get('/Signup_Success', function(req, res){
  res.render('Signup_Success.html')
});
app.get('/home', function(req, res){
  res.render('home.html')
});
app.get('/forgot', function(req, res){
  res.render('forgot.html')
});
app.get('/reset/:token', function(req, res){
  res.render('reset.html')
});
app.get('/reset/forgot_Success', function(req, res){
  res.render('forgot_Success.html')
});
app.get('/update', function(req, res){
  res.render('update.html')
});
app.get('/accueil', function(req, res){
  res.render('home.html')
});
app.get('/profil', function(req, res){
  res.redirect('/update');
});



app.get('/log_in', function(req, res){
  res.redirect('/log_in_up');
});

//se connecter
app.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

app.post("/login", async (req, res) => {
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
          return res.redirect("home").json({
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

//creer compte
app.get('/signup', function(req, res) {
  res.render('signup', {
    user: req.user
  });
});

app.post("/signup", function (req, res) {
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
    return res.redirect("Signup_Success");
  });
});

//se deconnecter
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Update profil
app.get('/update/:email', function(req, res) {
  res.render('home', {
    user: req.user
  });
});

app.post("/update/:email", async (req, res) => {
  const update =  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      password: hash,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      region: req.body.region,
      pays: req.body.pays,
    });
    db.collection("users").insertOne(user, function (err, collection) {
      if (err) throw err;
      console.log("Record inserted Successfully");
    });
  });
  const filter = { email: req.params.email };
  const updatedDocument = await User.findOneAndUpdate(filter, update, {
    new: true,
  });

  return res.redirect("home").send(updatedDocument);
});


//forget password
app.get('/forgot', function(req, res) {
  res.render('forgot_Success', {
    user: req.user
  });
});
app.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'jeerecompany@gmail.com',
          pass: 'iicfpugnceazzaph'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});
app.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('forgot_Success', {
      user: req.user
    });
  });
});
app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'jeerecompany@gmail.com',
          pass: 'iicfpugnceazzaph'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/forgot_success');
  });
});



app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});