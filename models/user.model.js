const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

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
  token: [String],
  resetlink: {
    data: String,
    default: "",
  },
  resetlinkExpires: {
    type: Date,
    required: false,
  },
  isdelete: {
    type: Boolean,
    default: false,
    enum: [true, false],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// UserSchema.pre("save", function (next) {
//   if (!this.isModified("password") || this.isNew) return next();
//   this.newPassword = Date.now() - 1000;
//   next();
// });

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
//   this.password = hash;
//   next();
// });

const User = mongoose.model("user", UserSchema);

module.exports = User;
