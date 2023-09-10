const mongoose = require("mongoose");
const Music = require("../models/music");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/musicList", {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DB conencted");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const seedDb = async () => {
    await Music.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Music({
            author: "64f3ffd9ad232c53512b7e5a",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: "https://s3.us-east-2.amazonaws.com/images.upload/1694138028509_image_banner_7.jpg",
                    filename: "1694138028509_image_banner_7.jpg",
                },
                {
                    url: "https://s3.us-east-2.amazonaws.com/images.upload/1694138282031_image_banner_6.jpg",
                    filename: "1694138282031_image_banner_6.jpg",
                },
            ],
            description:
                "Tempor per ornare sodales diam! Felis lobortis dictumst conubia platea! Semper class per est. Tempus accumsan mattis mus vivamus a nisl. Sociosqu vestibulum magna hac. Natoque hac accumsan sociosqu per cras volutpat integer accumsan. Cursus imperdiet nullam, nostra faucibus semper diam? Mollis et urna class cubilia magna integer! Placerat proin lacus consequat pulvinar suscipit. Dapibus commodo mi malesuada praesent facilisis.",
            price: Math.floor(Math.random() * 30) + 10,
        });
        await camp.save();
    }
};

seedDb().then(() => {
    mongoose.connection.close();
});
