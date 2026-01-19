const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully");

    mongoose.connection.on("error", (err) => {
      console.error(" MongoDB connection error:", err);
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Stop app if DB fails
  }
};

module.exports = connectDB;
