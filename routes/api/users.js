const express = require('express');
const router = express.Router();

//@route        POST api/users
//@description  Register User 
//@access       public 
router.post('/', (req, res) => {
    console.log(req.body);
    res.send('User route');
});

module.exports = router;