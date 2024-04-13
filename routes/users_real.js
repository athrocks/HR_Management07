var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/dbmsProject");


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true 
  }
});

userSchema.plugin(plm);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error('Failed to connect to MongoDB', err);
});


module.exports = mongoose.model("user", userSchema);
