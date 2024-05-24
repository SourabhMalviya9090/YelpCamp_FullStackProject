const Review  = require("../Model/review");
const Campground = require("../Model/campgrounds");

module.exports.postReview = async(req,res)=>{
    const {id} = req.params;
    const {rating, body} = req.body;
    const campground = await Campground.findOne({_id: id});
    const newReview = new Review({rating: rating, body: body});
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success","Successfully posted a review");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await Review.findOneAndDelete({_id: reviewId});
    const camp = await Campground.findOne({_id: id}).populate("reviews");
    camp.reviews = camp.reviews.filter((review)=> review._id != reviewId);
    await camp.save();
    req.flash("success","Successfully deleted the review");
    res.redirect(`/campgrounds/${camp._id}`); 
 
 };