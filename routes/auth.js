const router = require("express").Router();
const User = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Registration
router.post("/register", async (req, res) => {

    //validation
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    //Check if user with email already exists
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
        return res.status(400).json({ error: "Email is already in use" })
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt)

    //Create user
    const userObject = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
    })

    try {
        const savedUser = await userObject.save();
        res.json({ error: null, data: savedUser._id });
    } catch (error) {
        res.status(400).json({ error })
    }


})
//Login
router.post("/login", async (req, res) => {

    //Validation
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    //Find user
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).json({ error: "Email is wrong" })
    }

    //Password check
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(400).json({ error: "Password is wrong" })
    }

    //Create token
    const token = jwt.sign(
        //Payload
        {
            name: user.name,
            id: user.id
        },
        //Token secret
        process.env.TOKEN_SECRET,
        //Expiration time
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    //Attatch to header
    res.header("auth-token", token).json({
        error: null,
        data: { token }
    })

})

module.exports = router