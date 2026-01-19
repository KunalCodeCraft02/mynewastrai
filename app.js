const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const databaseconntection = require("./config/databaseconnection");
const user = require("./models/user");
const cookieParser = require("cookie-parser");
const isLoggedin = require("./middleware/auth");
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








app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
