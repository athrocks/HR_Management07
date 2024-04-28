var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// const DB =
// "mongodb+srv://atharva:JdPwwj3HPenaQpVH@testdb.rmswlxi.mongodb.net/?retryWrites=true&w=majority&appName=testDB";
mongoose.connect("mongodb://127.0.0.1:27017/dbmsProject2");

// mongoose
//   .connect(DB)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Failed to connect to MongoDB", err));

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
