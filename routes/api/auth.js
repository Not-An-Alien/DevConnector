const express = require('express');
const router = express.Router();

//@route        GET api/auth
//@description  auth route 
//@access       public 
router.get('/', (req, res) => res.send('Post route'));

module.exports = router;