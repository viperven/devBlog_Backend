const Posts = require("../models/posts");
const Activity = require("../models/activity");
const { validatePost } = require("../validation/postsValidation");

const createPost = async (req, res, next) => {
  try {
    validatePost(req);
    const { content, image } = req.body;
    const { _id } = req.user;

    const newPost = new Posts({ userId: _id, content, image });
    const result = await newPost.save();

    res.status(200).json({
      isSucess: true,
      message: "Post created successfully",
      apiData: result,
    });
  } catch (err) {
    console.log(err?.stack);
    next(err);
  }
};

//authenticate user
//get user id from req.user
//check if post exists
//check if user is the owner of the post
//update the post
//send response

const editPostById = async (req, res, next) => {
  try {
    const { content, image, postId } = req.body;
    const { _id } = req.user;

    if (!postId) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Post id is required" });
    }

    const post = await Posts.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Post not found" });
    }

    if (post.userId.toString() !== _id.toString()) {
      return res
        .status(401)
        .json({ isSuccess: false, message: "Unauthorized" });
    }

    const result = await Posts.findByIdAndUpdate(
      postId,
      { content, image },
      { new: true }
    );

    res.status(200).json({
      isSuccess: true,
      message: "Post updated successfully",
      apiData: result,
    });
  } catch (err) {
    console.log(err?.stack);
    next(err);
  }
};

const deletePostById = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const { _id } = req.user;
    if (!postId) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Post id is required" });
    }
    const post = await Posts.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Post not found" });
    }
    if (post.userId.toString() !== _id.toString()) {
      return res
        .status(401)
        .json({ isSuccess: false, message: "Unauthorized" });
    }
    await Posts.findByIdAndDelete(postId);
    await Activity.deleteMany({ postId: postId });
  } catch (err) {
    console.log(err?.stack);
    next(err);
  }
};

module.exports = { createPost, editPostById, deletePostById };
