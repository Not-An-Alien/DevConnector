const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//import models 
const profile = require('../../models/Profile');
const user = require('../../models/User');

//@route        GET api/profile/me
//@description  Get current users profile  
//@access       private 
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);
        // If theres no profile we will get this response 
        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile for this user'
            });
        }
        //If there is a profile we will get this response
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;