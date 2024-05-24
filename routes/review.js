const express = require("express");
const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/AppError");
const Campground = require("../Model/campgrounds");
const {campgroundSchema, reviewSchema} = require("../schemas");
const Review  = require("../Model/review");
const router = express.Router({mergeParams: true});
const isLoggedIn = require("../middlewares/isloggedin");
const isAuthorisedReview = require("../middlewares/isAuthorisedReview");
const reviewController = require("../controllers/reviews");

// function for validating review model
const validateReview = (req,res,next)=>{
    const result  = reviewSchema.validate(req.body);
    if(result.error){
        const message  = result.error.details.map(ele => ele.message).join(",");
        throw new ExpressError(message,401);
    }
    else{
    next();
}
}

// post a review
router.post("/", isLoggedIn, validateReview, catchAsync(reviewController.postReview));

// deleting a review
router.delete("/:reviewId", isLoggedIn, isAuthorisedReview, catchAsync(reviewController.deleteReview));

module.exports  = router;