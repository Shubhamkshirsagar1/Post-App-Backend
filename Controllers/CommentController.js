const express = require("express");
const CommentRouter = express.Router();
const CommentModel = require("../Models/CommentModel");

CommentRouter.post("/add-comment", async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.session.user.userId;
    console.log(postId, userId, text);

    const commentDb = await CommentModel.addComment({ postId, userId, text });

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: commentDb });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

CommentRouter.put("/update-comment/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const commentDb = await CommentModel.updateComment(commentId, text);
    console.log(commentDb);
    if (!commentDb) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res
      .status(200)
      .json({ message: "Comment updated successfully", comment: commentDb });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

CommentRouter.delete("/delete-comment/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;

    const commentDb = await CommentModel.deleteComment(commentId);

    if (!commentDb) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

CommentRouter.post("/add-reply/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.session.user.userId;
    const { text } = req.body;

    const commentDb = await CommentModel.addReply(commentId, userId, text);

    if (!commentDb) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res
      .status(200)
      .json({ message: "Reply added successfully", comment: commentDb });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

CommentRouter.put("/update-reply/:commentId/:replyId", async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const { text } = req.body;

    const commentDb = await CommentModel.updateReply(commentId, replyId, text);

    if (!commentDb) {
      return res.status(404).json({ error: "Comment or Reply not found" });
    }

    res
      .status(200)
      .json({ message: "Reply updated successfully", comment: commentDb });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

CommentRouter.delete("/delete-reply/:commentId/:replyId", async (req, res) => {
  try {
    const { commentId, replyId } = req.params;

    const commentDb = await CommentModel.deleteReply(commentId, replyId);

    if (!commentDb) {
      return res.status(404).json({ error: "Comment or Reply not found" });
    }

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { CommentRouter };
