const express = require("express");
const router = express.Router();
const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/AppError");
const {campgroundSchema} = require("../schemas");
const Campground = require("../Model/campgrounds");
const isLoggedIn = require("../middlewares/isloggedin");
const User = require("../Model/user");
const isAuthorised = require("../middlewares/isAuthorised");
const campgroundController =  require("../controllers/campgrounds"); 
const multer  = require('multer');
const {storage} = require("../cloudinary");
const upload = multer({storage: storage});

// function for validating the campground data
const validateCampground = (req,res,next)=>{
    const result = campgroundSchema.validate(req.body);
    if(result.error){
        const message  = result.error.details.map(ele => ele.message).join(",");
        throw new ExpressError(message,401);
    }
    else{
    next();
}

}

// campground routes 
router.get("/",catchAsync(campgroundController.index));

router.get("/new", isLoggedIn, campgroundController.renderNewForm);

router.post("/new", isLoggedIn, upload.array('image'),validateCampground, catchAsync(campgroundController.createCampground));

router.get("/:id", catchAsync(campgroundController.showCampground));

router.get("/:id/edit",isLoggedIn,isAuthorised, catchAsync(campgroundController.editCampgroundForm));

router.put("/:id",isAuthorised,upload.array("image"), validateCampground,catchAsync(campgroundController.updateCampground));

router.delete("/:id",isAuthorised, catchAsync(campgroundController.deleteCampground));

module.exports  = router;

