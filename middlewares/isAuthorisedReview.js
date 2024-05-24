const Review = require("../Model/review");
const mongoose = require("mongoose");

const isAuthorisedReview = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const foundReview = await Review.findById({_id:reviewId});
    if(!foundReview.author.equals(req.user._id)){
        req.flash("error","Sorry! You are not authorised to do this!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports = isAuthorisedReview;