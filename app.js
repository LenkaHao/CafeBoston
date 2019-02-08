var express = require("express"), 
    app = express(), 
    mongoose = require("mongoose"), 
    flash = require("connect-flash"), 
    bodyParser = require("body-parser"),
    session = require("express-session"), 
    passport = require("passport"), 
    localStrategy = require("passport-local"), 
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override");

var Cafe = require("./models/cafe"),
    Comment = require("./models/comment"), 
    User = require("./models/user"), 
    seedDB = require("./seeds")

var cafeRoutes = require("./routes/cafes"), 
    commentRoutes = require("./routes/comments"), 
    indexRoutes = require("./routes/index")


app.set("view engine", "ejs");
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
mongoose.connect("mongodb://localhost/cafe_boston");
//seedDB();

app.use(session({
    secret: "",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/cafes", cafeRoutes);
app.use("/cafes/:id/comments", commentRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});
