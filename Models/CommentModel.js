const CommentSchema = require("../Schemas/CommentSchema");
const PostSchema = require("../Schemas/PostSchema");

const addComment = async ({ postId, userId, text }) => {
  try {
    const comment = new CommentSchema({
      postId: postId,
      userId: userId,
      text: text,
    });

    const commentDb = await comment.save();
    const postDb = await PostSchema.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: commentDb._id } },
      { new: true }
    );

    return commentDb;
  } catch (error) {
    throw error;
  }
};

const updateComment = async (commentId, text) => {
  try {
    const commentDb = await CommentSchema.findOneAndUpdate(
      { _id: commentId },
      { text: text },
      { new: true }
    );

    return commentDb;
  } catch (error) {
    throw error;
  }
};
const deleteComment = async (commentId) => {
  try {
    const commentDb = await CommentSchema.findOneAndDelete({ _id: commentId });

    return commentDb;
  } catch (error) {
    throw error;
  }
};

const addReply = async (commentId, userId, text) => {
  try {
    const reply = {
      text: text,
      userId: userId,
    };

    const commentDb = await CommentSchema.findOneAndUpdate(
      { _id: commentId },
      { $push: { replies: reply } },
      { new: true }
    );

    return commentDb;
  } catch (error) {
    throw error;
  }
};

const updateReply = async (commentId, replyId, text) => {
  try {
    const commentDb = await CommentSchema.findOneAndUpdate(
      { _id: commentId, "replies._id": replyId },
      { $set: { "replies.$.text": text } },
      { new: true }
    );

    return commentDb;
  } catch (error) {
    throw error;
  }
};

const deleteReply = async (commentId, replyId) => {
  try {
    const commentDb = await CommentSchema.findOneAndUpdate(
      { _id: commentId },
      { $pull: { replies: { _id: replyId } } },
      { new: true }
    );

    return commentDb;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addComment,
  updateComment,
  deleteComment,
  addReply,
  updateReply,
  deleteReply,
};
