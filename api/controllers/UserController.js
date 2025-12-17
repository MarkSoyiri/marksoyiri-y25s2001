const Users = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");



//REGISTER USER
const register = async (req, res) => {

    const { username,firstname ,surname , email, password } = req.body;

    const existingUserName = await Users.findOne({ username });
    const existingUserEmail = await Users.findOne({ email });

    if ((existingUserName || existingUserEmail)) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const RegisterUser = new Users({ username, firstname,surname,email, password: hashedPassword });
    const RegisteredUserSaved = await RegisterUser.save();

    if (RegisteredUserSaved) {

        res.status(201).json({ message: 'User registered successfully' });
    }
};

//LOGIN

const login = async (req, res) => {

    const { email , password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email }, process.env.MY_JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({ user,token })
};



//GET PROFILE
const profile = async (req, res, next) => {
    try {
        res.status(201).json(req.user)  
    } catch (error) {
        res.status(401).json({error:err.message});
    }
}



module.exports = { register, login, profile };