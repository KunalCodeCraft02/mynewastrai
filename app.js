const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const aiRoutes = require("./routes/router");
app.use("/api/ai", aiRoutes);


app.get("/", (req, res) => {
  res.render("index");
});


app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
