const express = require("express");
const router = express.Router();
const {User} = require("../models");

const {hashPassword, comparePassword} = require("../utils/bcrypt");
 
// 회원가입
router.post("/", async(req, res) => {
    try {
        const {email, password, name } = req.body;
        if (email && password && name) {
            const hashedPassword = await hashPassword(password);
            console.log(hashedPassword);
            const data = await User.create({
                email: email,
                password: hashedPassword,
                name: name
            });
            console.log(data);
            return res.json({signup:true});
        }
    } catch(error) {
        console.log(error);
        return res.json({signup:false});
    }
});

router.post("/login", async(req, res) => {
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({
            where:{
                email:email
            }
        })
        console.log(userData);
        const hashedPassword = userData.dataValues.password;
        const compareResult = await comparePassword(password, hashedPassword);
        if (compareResult){
            return res.json({
                login:true, 
                id:userData.dataValues.id, 
                name: userData.dataValues.name, 
                auth:3,
            });
        } else {
            throw new Error();
        }
    } catch(error) {
        console.log(error);
        return res.json({ login: false });
    }
})

module.exports = router;