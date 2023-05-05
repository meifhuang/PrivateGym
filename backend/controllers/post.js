const express = require("express");
const Post = require("../models/post")
const User = require("../models/user");
const mongoose = require("mongoose");
const multer = require('multer');
const {storage} = require('../cloudinary'); 
const upload = multer({storage});

router = express.Router();

router.post("/createpost", upload.single('image'), async (req, res) => {
    try {
    console.log("create post");
    const user = await User.findById(req.user.id).populate("posts");
    const post = new Post(req.body);
    post.url = req.file.path; 
    console.log(post);

    if (post) {
    user.posts.push(post); 
    await user.save();
    await post.save();
    console.log("success");
    res.status(200).json({
        success: true,
        posts: user.posts
    })
}
else {
    res.status(400).json({
        success: false, 
        message: "unable to post"
    })
}}
catch (e) {
    console.log(e.message);
}
})

router.delete("/post/:postId", async (req, res) => {
    console.log("entering delete post");
    const {postId} = req.params

    try {
        const deleteFromUser = await User.findByIdAndUpdate(req.user.id, {
            $pull: { posts: req.params.postId }
        })
        const deletePost = await Post.findByIdAndDelete(postId);
        if (deleteFromUser && deletePost) {
        console.log('deleted post', deleteFromUser);
        res.status(200).json({
            success: true,
            postId: postId
        })
        }
        else {
            res.status(400).json({
                success: false,
                message: "Unable to delete"
            })
        }
    }
    catch (e) {
        console.log(e.message);
    } 
})


module.exports = router;