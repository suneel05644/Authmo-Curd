const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  role: {
    type: String,
    default: "user",
    enum: ["user", "publisher", "admin"],
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  Books: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  token: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
