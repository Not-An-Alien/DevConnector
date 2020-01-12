const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');



const User = require('../../models/User');
//@route        POST api/users
//@description  Register User 
//@access       public 
router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please enter a valid email/').isEmail(),
        check('password', 'Please enter a password with 6 or more charectors').isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        //"destructured so we pull the below out of the request body"
        const {
            name,
            email,
            password
        } = req.body;

        try {
            //See if user exists 
            let user = await User.findOne({
                email
            });

            if (user) {
                res.status(400).json({
                    errors: [{
                        msg: 'User already exists'
                    }]
                });
            }
            //Get users gravatar 
            const avatar = gravatar.email.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            //Registers a new user but does not save it, only creates an instance 
            user = new User({
                name,
                email,
                avatar,
                password
            })
            //Encrypt password using bcrypt 
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);
            //Save user to database 
            await user.save();

            //Return json webtoken 

            res.send('user registered');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }


    });

module.exports = router;