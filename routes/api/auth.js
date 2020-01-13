const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {
    check,
    validationResult
} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');

//@route        GET api/auth
//@description  auth route 
//@access       public 

//Whenever you want to use the auth middle ware just add it as a second parameter
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route Post api/auth 
//@desc  Authenticate user and git token 
//@access public 
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
                return res.status(400).json({
                    errors: [{
                        msg: 'User already exists'
                    }]
                });
            }
            //Get users gravatar 
            const avatar = gravatar.url(email, {
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

            //jwt 
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,
                config.get('jwtSecret'), {
                    expiresIn: 360000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }


    });

module.exports = router;