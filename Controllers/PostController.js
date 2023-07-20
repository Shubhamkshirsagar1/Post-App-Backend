const express = require("express");
const PostRouter = express.Router();
const { postCleanUpAndValidate } = require("../utils/PostUtils");
const Posts = require("../Models/PostModel");
const User = require("../Models/UserModel");

// Create Post
PostRouter.post("/create-post", async (req, res) => {
  console.log(req.body);
  const { title, textBody } = req.body;
  console.log(title, textBody);
  const userId = req.session.user.userId;
  console.log(userId);
  const creationDateTime = new Date();

  await postCleanUpAndValidate({ title, textBody, userId })
    .then(async () => {
      try {
        await User.verifyUserid({ userId });
      } catch (error) {
        return res.status(400).json({
          message: "UserId Issue!",
          error: error,
        });
      }

      const postObj = new Posts({
        title: title,
        textBody: textBody,
        userId: userId,
        creationDateTime: creationDateTime,
      });

      try {
        const postDb = await postObj.createPost();
        return res.status(201).json({
          message: "Post created Succesfully!!",
          data: postDb,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Database error!!",
          error: error,
        });
      }
    })
    .catch(() => {
      return res.status(400).json({
        message: "Data Error!!",
        error: error,
      });
    });
});

// Get All Posts
PostRouter.get("/get-posts", async (req, res) => {
  try {
    const postDb = await Posts.getPosts();
    return res.status(200).json({
      message: "Read Successfull!!",
      data: postDb,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Database Error!!",
      error: error,
    });
  }
});

// Get My Posts
PostRouter.get("/my-posts", async (req, res) => {
  const userId = req.session.user.userId;
  try {
    const myPostDb = await Posts.getMyPosts({ userId });
    return res.status(200).json({
      message: "Read Successfull!!",
      data: myPostDb,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Database Error!!",
      error: error,
    });
  }
});

// Edit Post
PostRouter.post("/edit-post", async (req, res) => {
  const { title, textBody } = req.body.data;
  const userId = req.session.user.userId;
  const postId = req.body.postId;
  console.log(title, textBody, userId, postId);

  //data validation
  try {
    //Find the Post with postID
    const postObj = new Posts({ title, textBody, userId, postId });
    const postDb = await postObj.getPostDataWithId();
    console.log("Function postDb", postDb);

    //Compare the blogs userId and whos making the edit req as a user with userId
    if (!postDb.userId.equals(userId)) {
      return res.status(401).json({
        message: "Not allow to edit!!",
      });
    }

    const oldPostDb = await postObj.updatePost();
    console.log(oldPostDb);

    return res.status(200).json({
      message: "Update successfull!!",
      data: oldPostDb,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Data Error!!",
      error: error,
    });
  }
});

// Delete Post
PostRouter.post("/delete-post", async (req, res) => {
  const postId = req.body.postId;
  const userId = req.session.user.userId;
  console.log(postId, userId);

  try {
    //Find the post with postId
    const postObj = new Posts({ postId, userId });
    const postDb = await postObj.getPostDataWithId();

    //Compare the blogs userId and whos making the edit req as a user with userId
    if (!postDb.userId.equals(userId)) {
      return res.status(401).json({
        message: "Not allow to delete!!",
      });
    }

    const oldPostDb = await postObj.deletePost();

    return res.status(201).json({
      message: "Delete successfull!!",
      data: oldPostDb,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Data Error!!",
      error: error,
    });
  }
});

module.exports = { PostRouter };
