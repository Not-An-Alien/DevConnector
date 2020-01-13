const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator');

//import models 
const profile = require('../../models/Profile');
const user = require('../../models/User');



// BELOW ARE THE ROUTES/END POINTS PERTAINING TO PROFILES 



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

//@route        POST api/profile
//@description  Create or update a users profile  
//@access       private 
//***NOTE*** WHEN USING MULTIPLE MIDDLE WARES BUT THEM IN BRACKETS
router.post('/', [auth, [
    //This is where we put our field checks 
    check('status', 'Status is required').not().isEmpty(),
    check('skill', 'skills is requried').not().isEmpty()
]], async (req, res) => {
    //This takes in the results from above and stores the results 
    const errors = validationResult(req);
    // Here we check for the errors "if errors is not empty print the result"
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array
        });
    }
})

module.exports = router;