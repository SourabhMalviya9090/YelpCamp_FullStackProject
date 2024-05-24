const Campground = require("../Model/campgrounds");
const cities = require("./cities");
const seedHelpers = require("./seedHelpers");

const mongoose  = require("mongoose");
const {descriptors, places} = seedHelpers;
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser : true,
    useUnifiedTopology:  true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected!");
});

const seedDb = async() =>{
    await Campground.deleteMany({});
    // genrating some test/demo data base
    for(let i =0; i<300;i++){
        let randNum = Math.floor(Math.random()*1000) +1;
        let randIndDes = Math.floor(Math.random()*18);
        let randIndPlace = Math.floor(Math.random()*20);
        let price  =  Math.floor(Math.random()*20000) + 1000;
        const newGround  = new Campground({
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            name: descriptors[randIndDes] + " "+ places[randIndPlace],
            image: [
                {
                    url: 'https://res.cloudinary.com/dqkino7im/image/upload/v1716440291/YelpCamp/mziunpq0gfuyuytkklsg.jpg',
                    fileName: 'YelpCamp/vfzq769rdnj3v4k0upa0',
                  }
              ] ,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus explicabo illum fuga, quam quibusdam ducimus reprehenderit ipsam non perferendis. Vero et laudantium rerum cum numquam optio excepturi a nam sed.",
            price: price,
            author: "664c7c6aa2833a2820cf0187",
            geometry: { type: 'Point', coordinates: [ cities[randNum].longitude, cities[randNum].latitude] }

        })
        await newGround.save();

    }


}

seedDb().then(()=>{
    db.close();
});



