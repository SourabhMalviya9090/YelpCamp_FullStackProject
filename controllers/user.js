const User = require("../Model/user");

module.exports.registerForm = (req,res)=>{
    res.render("user/register");
};

module.exports.registerUser = async(req,res,next)=>{
    try{
    const userdata = req.body;
    const newUser = new User({email: userdata.email, username: userdata.username});
    const registerUser = await User.register(newUser, userdata.password);
    req.login(registerUser,(err)=>{
        if(err) next(err);
        else{
            req.flash("success","Registered successfully!");
            res.redirect("/campgrounds");
        }
    })
}catch(e){
    req.flash('error',e.message);
    res.redirect('/register');
}

};

module.exports.loginForm = (req,res)=>{
    res.render("user/login");

};

module.exports.loginUser = async(req,res)=>{
    const redirectTo = res.locals.returnTo || "/campgrounds";
    req.flash('success',`Login Successful Welcome Back ${req.body.username}`);
    delete res.locals.returnTo;
    res.locals.currUser = req.user;
    res.redirect(redirectTo);
};

module.exports.logoutUser = (req,res)=>{
    req.logOut((err)=>{ 
        if(err){
        next(err);
    }else{
        req.flash('success','You Logged Out Successfully Good Bye!');
        res.redirect("/campgrounds");
    }

    });
   
};