const { name } = require("ejs");
const mongoose  = require("mongoose");
const { campgroundSchema, reviewSchema } = require("../schemas");
const Review = require("../Model/review");
const { authorize } = require("passport");
const User = require("../Model/user");
const { required } = require("joi");

const ImageSchema  = new mongoose.Schema({
        url: String,
        fileName: String
});


ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const opts = {toJSON: {virtuals: true}};
const CampgroundSchema  = new mongoose.Schema({
    name: String,
    price: {
        type: Number,
        min:0

    },
    image:[ImageSchema],
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type:[Number],
            required: true
        }

    },
    description: String,
    location: String,
    // review id
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }


}, opts);

CampgroundSchema.virtual("properties.htmlMarkUp").get(function(){
    return `<h5><a href="/campgrounds/${this._id}">${this.name}</a><h5/><p>${this.location}</p>`;
})

CampgroundSchema.post("findOneAndDelete", async function(doc){
    if(doc){
         await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
         })
    }
})
const Campground = new mongoose.model("Campground",CampgroundSchema);

module.exports = Campground;

