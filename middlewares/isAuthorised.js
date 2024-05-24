const Campground = require("../Model/campgrounds");
const mongoose = require("mongoose");

const isAuthorised = async(req,res,next)=>{
    const {id} = req.params;
    const foundGround = await Campground.findById({_id:id});
    if(!foundGround.author.equals(req.user._id)){
        req.flash("error","Sorry! You are not authorised to do this!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports = isAuthorised;