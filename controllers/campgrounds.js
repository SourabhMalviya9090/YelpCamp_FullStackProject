const Campground = require("../Model/campgrounds");
const express = require("express");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken  = process.env.MAP_BOX_PUBLIC_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req,res)=>{
    const campgroundDb = await Campground.find({});
    res.render("campgroundIndex.ejs",{campgroundDb});
};

module.exports.renderNewForm  = (req,res)=>{
    res.render("campgroundNew.ejs");
};

module.exports.createCampground = async(req,res)=>{
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit:1
    }).send();
    const image = req.files.map(file => ({url: file.path, fileName: file.filename}));
    const newGround = req.body;
    newGround.image = image;
    newGround.geometry = geoData.body.features[0].geometry;
    const newGroundObj = new Campground(newGround);
    newGroundObj.author = req.user._id;    
    await newGroundObj.save();
    console.log(newGroundObj);
    req.flash("success","Successfully created the campground!");
    res.redirect(`/campgrounds/${newGroundObj._id}`);

};

module.exports.showCampground = async (req,res)=>{
    const {id} = req.params;
    const foundGround = await Campground.findOne({_id:id}).populate({path: "reviews", populate:{path: "author"}}).populate('author');    
    if(!foundGround){
        req.flash("error","Cannot find this Campground!");
        res.redirect("/campgrounds");
    }
    req.session.returnTo = req.originalUrl;
    res.render("campgroundShow.ejs",{foundGround});

};

module.exports.editCampgroundForm = async (req,res)=>{
    const {id} = req.params;
    const foundGround = await Campground.findOne({_id:id});
    if(!foundGround){
        req.flash("error","Cannot find this Campground!");
        res.redirect("/campgrounds");
    }
    res.render("campgroundEdit.ejs",{foundGround}); 
};

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    const updateGround = req.body;
    const camp = await Campground.findByIdAndUpdate(id, updateGround);
    for(let file of req.files){
    camp.image.push({url: file.path, fileName: file.filename});
    }
    await camp.save();

    if (req.body.deleteImages) {
        for(let file of req.body.deleteImages){
            await cloudinary.uploader.destroy(file);
        }
        await camp.updateOne({ $pull: { image: { fileName: { $in: req.body.deleteImages } } } });
    }
    req.flash("success","Successfully updated the campground!");
    res.redirect(`/campgrounds/${id}`);
    
};

module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;
    await Campground.findOneAndDelete({_id:id});
    req.flash("success","Successfully deleted the campground!");
    res.redirect("/campgrounds");
};
