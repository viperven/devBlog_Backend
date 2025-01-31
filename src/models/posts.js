const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        trim: true,
        validate(value) {
            if (value && !validator.isURL(value)) {
                throw new Error("Invalid URL");
            }
        }
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
