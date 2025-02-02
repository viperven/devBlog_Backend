const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const {
  createPost,
  editPostById,
  deletePostById,
  fetchPostById,
  fetchAllPosts,
} = require("../contoller/postsController");

router.post("/createPost", userAuth, createPost);
router.post("/editPost", userAuth, editPostById);
router.post("/deletePost", userAuth, deletePostById);
router.get("/fetchPostById", userAuth, fetchPostById);
router.get("/fetchAllPosts", userAuth, fetchAllPosts);

module.exports = router;
