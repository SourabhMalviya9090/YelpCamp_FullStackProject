const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema  = new mongoose.Schema({
    email:{
        type: String,
        required: true
    }
});

// passport will itself add a field of username and password by itself
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",userSchema);
module.exports = User; 