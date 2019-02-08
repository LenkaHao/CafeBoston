var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome, " + user.username);
            res.redirect("/cafes");
        });
    });
});


router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

router.post("/login", 
        passport.authenticate("local", {
            failureRedirect: "/login",
            successRedirect: "/cafes"
        }), 
        function(req, res){});
        
router.get("/user/:id", function(req, res){
    User.findById(req.params.id, function(err, user){
        if (err){
            req.flash("error", "Sorry, that user couldn't be found.");
            return res.redirect("back");
        }
        res.render("users/show", {user: user});
    });
});

router.put("/user/:id", middleware.isLoggedIn, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
        if (err){
            req.flash("error", "Sorry, something went wrong.");
            res.redirect("back");
        } else {
            req.flash("success", "You have updated your profile successfully!");
            res.redirect("/user/" + req.params.id);
        }
        
    })
})




router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have logged out successfully.");
    res.redirect("/cafes");
});


module.exports = router;
