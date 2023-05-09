const userObject = await query ("select * from users where email = ?" , [req.body.email]);

const checkPassword = bcrypt.compareSync(req.body.password , userObject[0].password); 
