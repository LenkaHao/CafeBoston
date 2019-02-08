var express = require("express");
var router = express.Router();
var Cafe = require("../models/cafe");
var middleware = require("../middleware");

var nodeGeocoder = require("node-geocoder");
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: '',
  formatter: null
};
var geocoder = nodeGeocoder(options);

//get the list of all cafes
router.get("/", function(req, res){
    var perPage = 6;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    
    if (req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Cafe.find({"name": regex}, function(err, allcafes){
            if (err){
                console.log(err);
            } else {
                if (allcafes.length < 1){
                    noMatch = true;
                } else {
                    noMatch = false;
                }
                res.render("cafes/index", {cafes: allcafes, page: "cafes", noMatch: noMatch, pages: false});
            }
        });
    } else {
        Cafe.find({}).skip(perPage*(pageNumber-1)).limit(perPage).exec(function(err, allcafes){
            Cafe.count().exec(function(err, count){
                if (err){
                    console.log(err);
                } else {
                    res.render("cafes/index", {
                        cafes: allcafes, 
                        page: "cafes", 
                        noMatch: noMatch,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                    });
                }
            });
        });
    }
});

//get the form to create a new cafe
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("cafes/new");
});

//post the new cafe
router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    geocoder.geocode(req.body.location, function(err, data){
        if (err || !data.length){
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        var newCafe = {
            name: req.body.name,
            image: req.body.image, 
            description: req.body.description,
            author: author, 
            location: data[0].formattedAddress,
            lat: data[0].latitude,
            lng: data[0].longitude
        };
        Cafe.create(newCafe, function(err, newcafe){
        if (err){
            console.log(err);
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("/cafes");
        } else {
            req.flash("success", "You have created a post successfully!");
            res.redirect("/cafes");
        }
    });
    });
});

//get a particular cafe
router.get("/:id", function(req, res){
    Cafe.findById(req.params.id).populate("comments").exec(function(err, foundCafe){
        if (err || !foundCafe){
            req.flash("error", "Sorry, that cafe doesn't exist");
            res.redirect("/cafes");
        } else {
            res.render("cafes/show", {cafe: foundCafe});
        }
    });
});

//edit a particular cafe
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCafeOwnership, function(req, res){
    Cafe.findById(req.params.id, function(err, cafe){
        if (err || !cafe){
            req.flash("error", "Sorry, that cafe doesn't exist");
            res.redirect("/cafes");
        } else {
            res.render("cafes/edit", {cafe: cafe});
        }
    });
});

//post the update
router.put("/:id", middleware.isLoggedIn, middleware.checkCafeOwnership, function(req, res){
    geocoder.geocode(req.body.location, function(err, data){
        if (err || !data.length){
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        req.body.cafe.lat = data[0].latitude;
        req.body.cafe.lng = data[0].longitude;
        req.body.cafe.location = data[0].formattedAddress;
        if (!req.body.cafe.location){
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        Cafe.findByIdAndUpdate(req.params.id, req.body.cafe, function(err, cafe){
        if (err){
            console.log(err);
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("/cafes/" + req.params.id);
        } else {
            req.flash("success", "You have updated your post successfully");
            res.redirect("/cafes/" + req.params.id);
        }
    });
    });
});

//delete a cafe
router.delete("/:id", middleware.isLoggedIn, middleware.checkCafeOwnership, function(req, res){
    Cafe.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log(err);
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("/cafes");
        } else {
            req.flash("success", "You have deleted your post successfully");
            res.redirect("/cafes");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
