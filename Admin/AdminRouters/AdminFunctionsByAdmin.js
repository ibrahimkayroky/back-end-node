const router = require("express").Router();
//const userAuthorizationChecking = require("../middleware/UsersAuthorized");
const adminAuthonticationChecking = require("../middleware/AdminAuthorized");
const {body ,validationResult} = require("express-validator")
//const imageAthorizedChecking = require("../middleware/UploadImagesAuthorized")
const util = require("util");
const connection = require("../DB/dbConnector");
//const fileSystem = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");



router.post("/setNewAdmin",
body("first_name")
.isString()
.withMessage("enter a valid name !")
.isLength({min: 2 , max : 10})
.withMessage("the first name shoud be between 2 to 10 character"),
body("last_name")
.isString()
.withMessage("enter a valid name")
.isLength({min: 2 , max : 10})
.withMessage("the last name shoud be between 2 to 10 character"),
body("email")
.isEmail()
.withMessage("please enter a valid email"),
body("password")
.isLength({min : 8 , max : 10})
.withMessage("please enter the correct password"),
body("phone_number")
.isLength({min: 11 , max : 11})
.withMessage("please enter a valid number consists of 11 digits"),
body("city")
.isString()
.isLength({min: 0 , max : 20})
.withMessage("please enter a valid city name"),
body("address")
.isString()
.isLength({min: 0 , max : 20})
.withMessage("please enter a valid adress name"),
body("zip_code")
.isString()
.isLength({min: 5 , max : 5})
.withMessage("please enter a valid zip code"),
adminAuthonticationChecking, 
async (req , res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const query = util.promisify(connection.query).bind(connection);
        const userObject = await query("select * from users where email = ?", [req.body.email]);
        if (userObject.length > 0) {
            return res.status(404).json({
                errors: [
                    {
                        msg: "email already exists",
                    },
                ],
            });
        }
        const adminObject = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            phone_number:req.body.phone_number,
            address : req.body.address,
            city : req.body.city,
            zip_code : req.body.zip_code,
            token: crypto.randomBytes(10).toString("hex"),
            role: 1,
            state : 0,
        };
        await query("insert into users set ?", adminObject);
        delete adminObject.password;
        delete adminObject.state;
        delete adminObject.token;


    } catch (error) {
        console.log(error);
        return res.status(500).json("panic it's not working");
    }
});
module.exports = router ;