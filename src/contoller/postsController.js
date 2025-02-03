const mongoose = require("mongoose");
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
    console.log(err?.message);
    console.log(err?.stack);
    next(err);
  }
};

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



const fetchPostById = async (req, res, next) => {
  try {
    const { postId } = req.query;
    if (!postId) {
      return res.status(400).json({ isSuccess: false, message: "Post id is required" });
    }

    const objectId = new mongoose.Types.ObjectId(postId);

    // Fetching the post
    const post = await Posts.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "activities", // Ensure collection name matches
          let: { postId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$postId", "$$postId"] } } }
          ],
          as: "activity"
        }
      }
    ]);

    if (!post.length) {
      return res.status(404).json({ isSuccess: false, message: "Post not found" });
    }

    // Check activity data
    console.log(post[0].activity); // Log the activity data to see if it is populated

    res.status(200).json({
      isSuccess: true,
      message: "Post fetched successfully",
      apiData: post[0], // Return the first post document
    });

  } catch (err) {
    console.log(err?.stack);
    next(err);
  }
};


const fetchAllPosts = async (req, res, next) => {
  try {
    let { pageNumber, pageSize } = req.query;

    pageNumber = parseInt(pageNumber) || 1;
    pageSize = parseInt(pageSize) || 10;

    if (pageNumber < 1) pageNumber = 1;
    if (pageSize < 1) pageSize = 10;

    let skipPosts = (pageNumber - 1) * pageSize;

    const totalPosts = await Posts.countDocuments(); // Total post count
    const allPosts = await Posts.aggregate([
      { $lookup: { from: "Activity", localField: "_id", foreignField: "postId", as: "activity" } },
      { $skip: skipPosts },
      { $limit: pageSize }
    ]);


    res.status(200).json({
      isSuccess: true,
      message: "All posts fetched successfully",
      totalPages: Math.ceil(totalPosts / pageSize),
      currentPage: pageNumber,
      pageSize,
      totalPosts,
      apiData: allPosts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  editPostById,
  deletePostById,
  fetchPostById,
  fetchAllPosts,
};
