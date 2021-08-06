const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BookSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 100,
  },
  price: {
    type: Number,
  },
  author: {
    type: String,
  },
  nofpage: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  isdelete: {
    type: Boolean,
    default: false,
    enum: [true,false],
  },

  date: {
    type: Date,
  },
});

const Product = mongoose.model("Book", BookSchema);
// Export the model
module.exports = Product;
