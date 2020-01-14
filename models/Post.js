const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    // we want post to be connected to a user so we create a reference to a user 
    user: {
        type: Schema.Types.ObjectId,
        //this references the user model 
        ref: 'users'
        // this ties each user to their post so we know who created it, who can access it and who can delete it
    },

    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    // this way we know what likes came from which users and a user can only like a post once 
    liked: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',

        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }

    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', Post);