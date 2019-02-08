var express = require("express");
var router = express.Router({mergeParams: true});
var Cafe = require("../models/cafe"),
    Comment = require("../models/comment");
var middleware = require("../middleware");


//get the form to add a new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Cafe.findById(req.params.id, function(err, cafe){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {cafe: cafe});
        }
    });
});

//post a new comment
router.post("/", middleware.isLoggedIn, function(req, res){
    Cafe.findById(req.params.id, function(err, cafe){
        if (err || !cafe){
            console.log(err);
            res.redirect("/cafes");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if (err || !comment){
                    console.log(err);
                    req.flash("error", "Something went wrong. Please try again.");
                    res.redirect("/cafes/" + req.params.id);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    cafe.comments.push(comment);
                    cafe.save();
                    req.flash("success", "You have created a comment successfully!");
                    res.redirect("/cafes/" + cafe._id);
                }
            });
        }
    });
});

//get the form to edit a comment
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req, res){
    var cafe_id = req.params.id;
    Comment.findById(req.params.comment_id, function(err, comment){
        if (err || !comment){
            console.log(err);
            req.flash("error", "Comment doesn't exist.");
            res.redirect("/cafes/" + cafe_id);
        } else {
            res.render("comments/edit", {cafe_id: cafe_id, comment: comment});
        }
    });
});

//post the updated comment
router.put("/:comment_id", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if (err || !comment){
            console.log(err);
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("cafes/" + req.params.id);
        } else {
            req.flash("success", "You have updated your comment successfully!");
            res.redirect("/cafes/" + req.params.id);
        }
    });
});

//delete a comment
router.delete("/:comment_id", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if (err){
           console.log(err);
           req.flash("error", "Something went wrong. Please try again.");
           res.redirect("back");
       } else {
           req.flash("success", "You have deleted your comment successfully!");
           res.redirect("/cafes/" + req.params.id);
       }
   });
});



module.exports = router;
