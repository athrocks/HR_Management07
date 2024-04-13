var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/dbmsProject");

const employeeSchema = mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  projectDomain: {
    type: String,
    required: true,
  },
  email2: {
    type: String,
    required: true,
    unique: true,
    // match: [/\S+@\S+\.\S+/, "is invalid"], // Email validation using a regular expression
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

module.exports = Employee;
