var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/dbmsProject");

const personalSchema = mongoose.Schema({
  employeeName4: {
    type: String,
    required: true,
  },
  email4: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
});

const Personal = mongoose.model("Personal", personalSchema);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

module.exports = Personal;
