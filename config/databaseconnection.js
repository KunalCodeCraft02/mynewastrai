const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://kunal:kunal%409080@kunal.zq3ycoj.mongodb.net/Users?retryWrites=true&w=majority")
.then(()=>{
    console.log("Database connected successfully");
})
.catch((err)=>{
    console.log("Database connection failed",err);
});