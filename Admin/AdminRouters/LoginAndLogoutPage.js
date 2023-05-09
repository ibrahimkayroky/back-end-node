const { body , validationResult } = require("express-validator");
const router = require("express").Router();
const connection = require("../DB/dbConnector");
const util = require("util");
const bcrypt = require("bcrypt");

router.post(
    "/login" ,
    body("email").isEmail().withMessage("please enter a valid email"),
    body("password").isLength({min : 8 , max : 10}).withMessage("please enter the correct password"),
    async (req,res) =>{
        try {
            // 1 -> check the validation of the conditions 
            const error = validationResult(req);
            if (!error.isEmpty()){
                return res.status(400).json({error : error.array()});
            }
            // 2 -> check if email doesn't exist
            const query = util.promisify(connection.query).bind(connection);
            const userObject = await query ("select * from users where email = ?" , [req.body.email]);
            if (userObject == 0){
                return res.status(404).json({
                    errors : [
                        {
                            msg :"email doesn't exist ",
                        },
                    ],
                });
            }
            // 3 -> check if the password matches 
            const checkPassword = bcrypt.compareSync(req.body.password , userObject[0].password); 
            if (!checkPassword){
                return res.status(404).json({
                    errors : [
                        {
                        msg : "incorrtect password",
                        },
                    ],
                });
            } else {
                delete userObject[0].password ;
                return res.status(200).json(userObject);
            }




        } catch (error) {
            console.log(error);
            return res.status(500);
            
        }
    }
);
router.get("/logout/:user_id",async (req,res) =>{
    const query = util.promisify(connection.query).bind(connection);
    const userObject = await query ( `select * from users where user_id = ${req.params.user_id}`);
    if (userObject == 0){
        return res.status(404).json({
            errors : [
                {
                    msg :"email doesn't exist ",
                },
            ],
        });
    }else {
        userObject[0].state = 0 ;
        res.redirect("/");
    }
});



module.exports = router;
