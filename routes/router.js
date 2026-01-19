const express = require("express");
const router = express.Router();
const { model } = require("../config/gemini");
const User = require("../models/user");
const mailer = require("../config/mailer");
const generateOTP = require("../config/generateotp");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// AI route
router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
});




router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login Error</title>
                </head>
                <body>
                    <script>
                        alert("User already exists!");
                        window.location.href = "/login";
                    </script>
                </body>
                </html>
            `);
    }

    const otp = generateOTP();
    const newUser = await User.create({
      username,
      email,
      password,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000
    });
    console.log(newUser);



    await mailer.sendMail({
      from: `ASTRAI <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      html: `<h2> your OTP is : ${newUser.otp} </h2> <b> This OTP is valid for 10 minutes </b>`
    })
    // return res.send(`
    //             <!DOCTYPE html>
    //             <html>
    //             <head>
    //                 <title>Login Error</title>
    //             </head>
    //             <body>
    //                 <script>
    //                     alert("Ragistration Successful!");
    //                     window.location.href = "/userlogin";
    //                 </script>
    //             </body>
    //             </html>
    //         `);
    res.redirect(`/otpvalidator?email=${email}`)
  } catch (error) {
    console.error(error);
    return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login Error</title>
                </head>
                <body>
                    <script>
                        alert("Ragistration Failed!");
                        window.location.href = "/login";
                    </script>
                </body>
                </html>
            `);
  }
});


router.post("/verifyotp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.render("otpvalidator", {
        email,
        error: "Invalid or expired OTP"
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    let token = jwt.sign({ email: user.email, userid: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie("token", token);
    console.log(token);

    res.redirect("/")
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "OTP Verification failed" });
  }
});


router.post("/loginuser", async (req, res) => {
  try {
    const { email , password } = req.body;

    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login Error</title>
                </head>
                <body>
                    <script>
                        alert("User not found!");
                        window.location.href = "/login";
                    </script>
                </body>
                </html>
            `);
    }
    else {
      if (user.password !== req.body.password) {
        return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login Error</title>
                </head>
                <body>
                    <script>
                        alert("Invalid password!");
                        window.location.href = "/login";
                    </script>
                </body>
                </html>
            `);
      }
      else{
         let token = jwt.sign({ email: user.email, userid: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
        res.cookie("token", token);
        console.log(token);
        res.redirect("/");
      }

    }
  }

  catch (error) {
    return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login Error</title>
                </head>
                <body>
                    <script>
                        alert("Login Failed!");
                        window.location.href = "/login";
                    </script>
                </body>
                </html>
            `);
  }
})





module.exports = router;
