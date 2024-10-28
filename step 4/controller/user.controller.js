const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(password);

    const hashPassword = await bcrypt.hash(password, 10);

    console.log(hashPassword);

    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return res.json({
        message: "user does not exist",
      });
    }
    res.json({
      message: "user delete Successfully",
      deleteUser: deleteUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      name,
      email,
      password,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    res.json({
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (!userEmail) {
      return res.status(404).json({
        error: "User not Found",
      });
    }

    const isValidPassword = await bcrypt.compare(password, userEmail.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: userEmail._id, email: userEmail.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Login Successfully", token });
  } catch (error) {
    return res.status(500).json({ error: "An Error occurred while login" });
  }
};
