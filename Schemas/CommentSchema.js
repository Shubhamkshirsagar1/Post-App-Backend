const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "post",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  text: {
    type: String,
    required: true,
  },
  creationDateTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
});

module.exports = mongoose.model("comment", commentSchema);
