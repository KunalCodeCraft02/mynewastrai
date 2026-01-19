const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const user = require("./models/user");
const cookieParser = require("cookie-parser");
const isLoggedin = require("./middleware/auth");
const connectDB = require("./config/databaseconnection");
dotenv.config();


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const aiRoutes = require("./routes/router");
app.use("/api/ai", aiRoutes);


app.get("/", isLoggedin, (req, res) => {
  res.render("index",{user:req});
});

app.get("/ragister", (req, res) => {
  res.render("ragister")
});

app.get("/login",(req,res)=>{
  res.render("login")
});

app.get("/otpvalidator", (req, res) => {
  const { email } = req.query;
  res.render("otpvalidator", { email, error: null });
});






const startServer = async () => {
  await connectDB(); 

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
