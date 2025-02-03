const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const {
  commentOnPost,
  togglePostLike,
  toggleCommentLike,
  editPostComment,
} = require("../contoller/commentController");

router.post("/:postId/comments", userAuth, commentOnPost); // Add comment on post
router.put("/:commentId/edit", userAuth, editPostComment); // Edit a post comment
router.post("/:postId/like", userAuth, togglePostLike); // Toggle like on post
router.post("/:commentId/commentlike", userAuth, toggleCommentLike); // Toggle like on comment

module.exports = router;
