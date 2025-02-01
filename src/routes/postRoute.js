const express = require('express');
const router = express.Router();

const { userAuth } = require('../middlewares/auth');
const { createPost ,editPostById} = require('../contoller/postsController');

router.post("/createPost", userAuth, createPost);
router.post("/editPostById", userAuth, editPostById);


module.exports = router;



