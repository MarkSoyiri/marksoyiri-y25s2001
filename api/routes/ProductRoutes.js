const express = require("express");
const router = express.Router();
const { login, register, profile } = require("../controllers/UserController");
const authM = require("../middleware/authMiddleware");


router.post('/login', login);
router.post('/register', register);
router.get('/profile',authM, profile);



module.exports = router;