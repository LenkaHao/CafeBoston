var mongoose = require("mongoose");

var cafeSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    creatAt: {type: Date, default: Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Cafe", cafeSchema);
