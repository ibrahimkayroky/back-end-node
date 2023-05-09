const connection = require("../DB/dbConnector");
const util = require("util");


const adminAuthonticationChecking = async(req, res , next) =>{
    checking(req , res , next);
    
    
};

async function checking (req , res , next){
    const query = util.promisify(connection.query).bind(connection);
    const {token} = req.headers;
    const adminRequriedObject = await query("select  * from users where token = ?" ,[token]);
    if (adminRequriedObject[0] && adminRequriedObject[0].role == 1 && adminRequriedObject[0].state == 1){
        next();
    }else {
        res.status(403).json({
            msg : "you are not allowed to acces this",
        });
    }
}


module.exports = adminAuthonticationChecking ;

