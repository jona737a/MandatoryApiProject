const router = require("express").Router();
const User = require("../models/user");
const { registerValidation } = require("../validation");
const bcrypt = require("bcrypt")

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
    return res.status(200).json({ msg: "Login Route" })
})

module.exports = router