const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');
//Bring in models 
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
//@route        Post api/posts
//@description  Create a post  
//@access       Private 
router.post('/',
    [
        auth,
        [
            check('text', 'Text is required').not().isEmpty()
        ]
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {

            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();

            res.json(post);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    });

//@route        Get api/posts
//@description  Get all posts  
//@access       Private 

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({
            date: -1
        });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route        GET api/posts/:id
//@description  get a single post by id  
//@access       Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                msg: 'Post not found'
            })
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Post not found'
            })
        }
        res.status(500).send('Server Error');
    }
})





//@route        Delete api/posts/:id
//@description  Delete a post by a user   
//@access       Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // check to see if the user exists 
        if (!post) {
            return res.status(404).json({
                msg: "Post Not Found"
            });
        }


        //Check on user to make sure that they own the post 
        // This compares the post user to the user sending the request 
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'User not authorized'
            });
        }

        await post.remove();

        res.json({
            msg: 'Post Removed'
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: "Post Not Found"
            });
        }
        res.status(500).send('Server Error');
    }
})

module.exports = router;