
const util = require("util");
const connection = require("../DB/dbConnector");


const userAuthorizationChecking = async (req , res , next) => {
    const query = util.promisify(connection.query).bind(connection);
    const {token} = req.headers;
    const userRequriedObject = await query("select * from users where token = ?" ,[token] );
    if (userRequriedObject[0] && userRequriedObject[0].state == 1){
        next();
    }else {
        res.status(403).json({
            msg : "you have to login first",
        });
    }
};


module.exports = userAuthorizationChecking;