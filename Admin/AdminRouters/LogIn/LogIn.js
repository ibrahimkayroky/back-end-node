router.post(
    "/login" ,
    body("email").isEmail().withMessage("please enter a valid email"),
    body("password").isLength({min : 8 , max : 10}).withMessage("please enter the correct password"));
    module.exports = router;