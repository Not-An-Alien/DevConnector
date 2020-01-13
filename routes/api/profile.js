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
    check('skills', 'skills is requried').not().isEmpty()
]], async (req, res) => {
    //This takes in the results from above and stores the results 
    const errors = validationResult(req);
    // Here we check for the errors "if errors is not empty print the result"
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });

    }
    //Here we pull everything out of the body 
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build our social media object 
    profileFields.social = {}

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (profile) {
            //update the profile
            profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            });
            return res.json(profile);
        }
        //create if no profile found 
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route        Get api/profile
//@description  Get all profiles
//@access       public
//***NOTE*** 

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;