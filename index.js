const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const app = express();
const jwt = require("jsonwebtoken");
const connect = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/auth-serivce");
  console.log("Mongoose Connection Success");
};

app.use(express.json());

//regiser
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.json({ message: "user already exist" });
  }
  const newUser = new User({
    name,
    email,
    password,
  });
  await newUser.save();
  return res.json(newUser);
});

//login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User doesnot exist" });
  }
  //check password
  if (user.password !== password) {
    return res.json({ message: "Incorrect password" });
  }
  const payload = {
    email,
    name: user.name,
  };

  const token = await jwt.sign(payload, "secret");
  return res.json({ token });
});

connect();
app.listen(7100, () => {
  console.log("AuthService is running on port 7100");
});
