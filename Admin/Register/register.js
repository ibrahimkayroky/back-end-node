
router.post("/register",
body("first_name")
.isString()
.withMessage("enter a valid name")
.isLength({min: 2 , max : 20})
.withMessage("the last name shoud be between 2 to 10 character"),
body("last_name")
.isString()
.withMessage("enter a valid name")
.isLength({min: 2 , max : 20})
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
.withMessage("please enter a valid zip code"));
module.exports = router;