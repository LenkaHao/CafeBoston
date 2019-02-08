var mongoose = require("mongoose");
var Cafe = require("./models/cafe");
var Comment = require("./models/comment");

var data = [
    {
        name: "Pavement (Boston)", 
        image: "http://331mrnu3ylm2k3db3s1xd1hg-wpengine.netdna-ssl.com/wp-content/uploads/2013/09/photo8.jpg",
        description: "A good place to go for BU students. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
    },
    {
        name: "Blue Bottle (Boston)",
        image: "https://cdn.vox-cdn.com/thumbor/VmsL_szHUGjCS_LbFI6j0GEKDcA=/0x0:3000x1935/1200x800/filters:focal(1260x728:1740x1208)/cdn.vox-cdn.com/uploads/chorus_image/image/59669419/The_Exchange_01.0.png", 
        description: "Coffee with glass window and sunshine. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
    },
    {
        name: "Caffe Nero (Allston)",
        image: "https://scontent.fbed1-2.fna.fbcdn.net/v/t1.0-9/20258192_1952928598286592_5667657714442597749_n.jpg?_nc_cat=0&oh=d6451d42552a329a04d4dd9395da6dd7&oe=5BE080FF", 
        description: "Study with friends at Nero! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
    },
    {
        name: "Tatte (Brookline)",
        image: "http://www.bu.edu/today/files/2016/04/h_butoday_Tatte-1030.jpg",
        description: "Fresh desserts and fashion food. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
    }
];

function seedDB(){
    //remove all cafes
    Cafe.remove({}, function(err){
        if (err){
            console.log(err);
        }
        //add some cafes
        for (var i = 0; i < data.length; i++){
            Cafe.create(data[i], function(err, cafe){
                if (err){
                    console.log(err);
                }
                //add a comment
                var newComment = {
                    text: "This is a nice place to go.",
                    author: "Nana"
                };
                Comment.create(newComment, function(err, comment){
                    if (err){
                        console.log(err);
                    } else {
                        cafe.comments.push(comment);
                        cafe.save();
                    }
                });
            });
        }
        
   });
    
}

module.exports = seedDB;
