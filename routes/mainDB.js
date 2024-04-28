var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/dbmsProject");

const mainSchema = mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  projectName: {
    type: String,
    // required: true,
  },
  projectDomain: {
    type: String,
    // required: true,
  },
  age: {
    type: Number,
    // required: true,
  },
  salary: {
    type: Number,
    // required: true,
  },
  bloodGroup: {
    type: String,
    // required: true,
  },
  year: {
    type: Number,
    // required: true,
  },
  course: {
    type: String,
    // required: true,
  },
});

const MainDB = mongoose.model("MainDB", mainSchema);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

module.exports = MainDB;