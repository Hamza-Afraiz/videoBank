const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).send("Username not found");
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");
  console.log({ user });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.header("Authorization", token).send({ token });
});
module.exports = router;
