const userObject = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone_number:req.body.phone_number,
    address : req.body.address,
    city : req.body.city,
    zip_code : req.body.zip_code,
    token: crypto.randomBytes(10).toString("hex"),
    state : 0,
};
await query("insert into users set ?", userObject);
delete userObject.password;
return res.status(200).json(userObject);


catch (error) {
console.log(error);
return res.status(500).json("panic it's not working");
}