var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/dbmsProject");

const experienceSchema = mongoose.Schema({
  employeeName2: {
    type: String,
    required: true,
  },
  email3: {
    type: String,
    required: true,
    unique: true,
    // match: [/\S+@\S+\.\S+/, "is invalid"], // Email validation using a regular expression
  },
  year: {
    type: Number, // Assuming year is a number
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
});

const Experience = mongoose.model("Experience", experienceSchema);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

module.exports = Experience;