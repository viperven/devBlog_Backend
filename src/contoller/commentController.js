const Activity = require("../models/activity");
const Posts = require("../models/posts");

const togglePostLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { _id } = req.user;
    let message = "";

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

    let postLike = post.likes.indexOf(_id);

    if (postLike === -1) {
      postLike = post.likes.push(_id);
      message = "Post liked successfully";
    } else {
      postLike = post.likes.splice(postLike, 1);
      message = "Post unliked successfully";
    }

    post.likes.push(_id);
    await post.save();

    res.status(200).json({
      isSuccess: true,
      message,
      apiData: post,
    });
  } catch (err) {
    console.log(err?.stack);
    next(err);
  }
};

const commentOnPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
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

    const activity = new Activity({ userId: _id, postId, content });
    await activity.save();

    res.status(200).json({
      isSuccess: true,
      message: "Comment added successfully",
      apiData: activity,
    });
  } catch (err) {
    console.log(err?.stack);
    next(err);
  }
};

const editPostComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const { _id } = req.user;
    const activity = await Activity.findById(commentId);
    if (!activity) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Comment not found" });
    }
    if (activity.userId.toString() !== _id.toString()) {
      return res
        .status(401)
        .json({ isSuccess: false, message: "You are not authorized" });
    }
    activity.content = content;
    await activity.save();
    res.status(200).json({
      isSuccess: true,
      message: "Comment edited successfully",
      apiData: activity,
    });
  } catch (err) {
    console.log(err?.stack);
    next(err);
  }
};

//toggle like
const toggleCommentLike = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { _id } = req.user;
    let message = "";

    const activity = await Activity.findById(commentId);
    if (!activity) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Comment not found" });
    }

    const likeIndex = activity.likes.indexOf(_id);

    if (likeIndex === -1) {
      activity.likes.push(_id);
      message = "Comment liked successfully";
    } else {
      activity.likes.splice(likeIndex, 1);
      message = "Like removed from comment";
    }

    await activity.save();

    res.status(200).json({
      isSuccess: true,
      message,
      apiData: activity,
    });
  } catch (err) {
    console.log(err?.stack);
    next(err);
  }
};

module.exports = {
  commentOnPost,
  togglePostLike,
  editPostComment,
  toggleCommentLike,
};
