const router = require("express").Router();
//const userAuthorizationChecking = require("../middleware/UsersAuthorized");
const adminAuthonticationChecking = require("../middleware/AdminAuthorized");
const {body , validationResult} = require("express-validator")
const imageAthorizedChecking = require("../middleware/UploadImagesAuthorized")
const util = require("util");
const connection = require("../DB/dbConnector");
const fileSystem = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

router.post("/createProduct",
imageAthorizedChecking.single("image"),

body("name")
.isString()
.withMessage("please enter a valid name!")
.isLength({min : 2 , max:50})
.withMessage("the name of the product between 2 -> 50 character"),
body("description")
.isString()
.withMessage("please enter an understandable descrription")
.isLength({min : 10 , max: 100})
.withMessage("please enter an well description"),
body("price")
.isLength({min: 0 , max:8})
.withMessage("the price should be between 0 -> 8 digits"),
body("category_name")
.isString()
.withMessage("please enter a valid name!")
.isLength({min : 2 , max:50})
.withMessage("the name of the product between 2 -> 50 character"),
body("orders_product")
.isNumeric()
.withMessage("enter a valid number")
.isLength({min :1 , max:50})
.withMessage("the name of the product between 2 -> 50 character"),

adminAuthonticationChecking, async (req, res) => {
    try {
        // 1 -> validate the fields except the image 
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }
        // 2 -> validate the image 
        if (!req.file){
            return res.status(400).json(
                {
                    errors:[
                        {
                            msg : "Image is required",
                        },
                    ],
                },
            );
        }
        const RequiredItem = await Search(req , res , "categories", "category_name");
        
        // 3 -> product object
        const productObject = {
            name : req.body.name ,
            description : req.body.description,
            price : req.body.price,
            category_id : RequiredItem[0].category_id,
            image : req.file.filename,
            orders_product : req.body.orders_product,
        };

        // 4 -> insert pruduct to database
        const query = util.promisify(connection.query).bind(connection)
        await query("insert into Products set ? " , productObject) ;
        return res.status(200).json("Product Created");
    } catch (error) {
        console.log(error);
        return res.status(500).json("panic it's not working");
        
    }
});
router.put("/updateProduct/:id",
imageAthorizedChecking.single("image"),
body("name")
.isString()
.withMessage("please enter a valid name!")
.isLength({min : 2 , max:50})
.withMessage("the name of the product between 2 -> 50 character"),
body("description")
.isString()
.withMessage("please enter an understandable descrription")
.isLength({min : 10 , max: 100})
.withMessage("please enter an well description"),
body("price")
.isLength({min: 0 , max:8})
.withMessage("the price should be between 0 -> 8 digits"),
body("category_name")
.isString()
.withMessage("please enter a valid name!")
.isLength({min : 2 , max:100})
.withMessage("the name of the product between 2 -> 50 character"),

adminAuthonticationChecking, 
async (req, res) => {
    try {
        const query = util.promisify(connection.query).bind(connection);

        // 1 -> validate the fields except the image 
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }

        // 2- > check is movie exists or not 
        const productExistance = await query ("select * from Products where product_id = ? " ,[req.params.id]);
        if (!productExistance[0]){
            return res.status(404).json({msg : "the product is not found !"});
        }
        const RequiredItem = await Search(req , res , "categories", "category_name");

        // 3 -> product object 
        const productObject = {
            name : req.body.name ,
            description : req.body.description ,
            price : req.body.price ,
            description : req.body.description,
            price : req.body.price,
            category_id : RequiredItem[0].category_id,
            orders_product : req.body.orders_product ,
        };
        // check if the image updated or not 
        if (req.file){
            //res.status(400).json(productExistance[0].image_url);
            productObject.image = req.file.filename;
            fileSystem.unlinkSync("./ProductsImages/" + productExistance[0].image);
        }
        // "1681710104372.png"
        

        // insert the new data to database
        await query ("update products set ? where product_id = ?",[productObject ,req.params.id]);

        return res.status(200).json("Product updated");
    } catch (error) {
        console.log(error);
        return res.status(500).json("panic it's not working");
    }
});
router.delete("/deleteProduct/:id"

,adminAuthonticationChecking, 
async (req, res) => {
    try {
        const query = util.promisify(connection.query).bind(connection);
        // 2- > check is movie exists or not 
        const productExistance = await query ("select * from Products where product_id = ? " ,[req.params.id]);
        
        if (!productExistance[0]){
            return res.status(404).json({msg : "the product is not found !"});
        }
        
        // delete the product from databse
        fileSystem.unlinkSync("./ProductsImages/" + productExistance[0].image);
        await query("delete from Products where product_id = ?" ,[productExistance[0].product_id]);
        return res.status(200).json("Product Deleted ");
    } catch (error) {
        console.log(error);
        return res.status(500).json("panic it's not working")
        
    }
});
router.get("/searchProduct/:search", adminAuthonticationChecking, async (req, res) => {
    try {
        return res.json(await Search(req , res ,"products", "name") );
    } catch (error) {
        console.log(error);
        return res.status(404).json("panic it's not working !!!");
        
    }
    
});

async function Search (req ,res , tabelName, colunmName){
    const query = util.promisify(connection.query).bind(connection);
    var search = "";
    try {
        if (req.params.search){
            search = `where ${colunmName} LIKE '%${req.params.search}%'`;
        }
        else if (req.body.category_name){
            search = `where ${colunmName} LIKE '%${req.body.category_name}%'`;
        }
        const requriedItem = await query(`select * from ${tabelName} ${search}`);
        if (!requriedItem[0]){
            return res.status(404).json("can't find it hello!");
        }
        return (requriedItem);
    } catch (error) {
        console.log(error);
        return res.status(404).json("can't find it!");
    }
}
module.exports = router;