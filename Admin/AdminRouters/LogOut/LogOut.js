
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
