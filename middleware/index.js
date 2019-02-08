var Cafe = require("../models/cafe"),
    Comment = require("../models/comment");
    
var middlewareObj = {};

middlewareObj.checkCafeOwnership = function(req, res, next){
    Cafe.findById(req.params.id, function(err, cafe){
        if (err || !cafe){
            console.log(err); 
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("/cafes");
        } else {
            if (cafe.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You do not have permission to do that.");
                res.redirect("/cafes/" + req.params.id);
            }
        }
    });
    
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    Comment.findById(req.params.comment_id, function(err, comment){
        if (err || !comment){
            console.log(err); 
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("/cafes/" + req.params.id);
        } else {
            if (comment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You do not have permission to do that.");
                res.redirect("/cafes/" + req.params.id);
            }
        }
    });

};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in.");
    res.redirect("/login");
};

module.exports = middlewareObj;
