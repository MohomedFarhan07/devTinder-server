const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const {          
      firstname,
      lastname,
      emailId,
      password,
      gender,
      age,      
      about,
      skills,
    } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      emailId,
      gender,
      age,
      about,
      skills,
      password: passwordHash,
    });
    const savedUser = await user.save();

    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.json({ message: "User Saved successfully!", user: savedUser });
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!!!");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      res.json({ message: "Full details of the logged In User", user: user });
    } else {
      throw new Error("Invalid credetials!!!");
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged Out");
});

module.exports = authRouter;
