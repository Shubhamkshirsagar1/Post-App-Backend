const CommentSchema = require("../Schemas/CommentSchema");
const PostSchema = require("../Schemas/PostSchema");
const ObjectId = require("mongodb").ObjectId;

let Posts = class {
  title;
  textBody;
  userId;
  creationDateTime;
  postId;

  constructor({ userId, title, textBody, creationDateTime, postId }) {
    this.title = title;
    this.textBody = textBody;
    this.userId = userId;
    this.creationDateTime = creationDateTime;
    this.postId = postId;
  }

  createPost() {
    return new Promise(async (resolve, reject) => {
      this.title.trim();
      this.textBody.trim();

      //We will get PostSchema from Schemas
      const post = new PostSchema({
        title: this.title,
        textBody: this.textBody,
        userId: this.userId,
        creationDateTime: this.creationDateTime,
      });

      try {
        const postDb = await post.save();
        console.log(postDb);
        resolve(postDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getPosts() {
    return new Promise(async (resolve, reject) => {
      try {
        const postDb = await PostSchema.find();
        console.log(postDb);
        resolve(postDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getMyPosts({ userId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const myBlogDb = await PostSchema.aggregate([
          { $match: { userId: new ObjectId(userId) } },
        ]);
        console.log(myBlogDb);
        resolve(myBlogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  getPostDataWithId() {
    return new Promise(async (resolve, reject) => {
      console.log("HERE", this.postId);

      try {
        const postDb = await PostSchema.findOne({ _id: this.postId });

        if (!postDb) {
          reject("Post not found!!");
        }
        // console.log(blogDb);
        resolve(postDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  updatePost() {
    return new Promise(async (resolve, reject) => {
      let newPostData = {};

      try {
        if (this.title) {
          newPostData.title = this.title;
        }
        if (this.textBody) {
          newPostData.textBody = this.textBody;
        }

        const oldData = await PostSchema.findOneAndUpdate(
          { _id: this.postId },
          newPostData
        );
        resolve(oldData);
      } catch (error) {
        reject(error);
      }
    });
  }

  deletePost() {
    return new Promise(async (resolve, reject) => {
      console.log(this.postId);

      try {
        const oldPostDb = await PostSchema.findOneAndDelete({
          _id: this.postId,
        });
        console.log(oldPostDb);
        resolve(oldPostDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = Posts;
