const router = require("express").Router();
const adminAuthonticationChecking = require("../middleware/AdminAuthorized");
const { body, validationResult } = require("express-validator")
//const imageAuthonticationChecking = require("../middleware/UploadImagesAuthorized")
const util = require("util");
const connection = require("../DB/dbConnector");
const fileSystem = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

router.post("/createCategory",
body("category_name")
        .isString()
        .withMessage("please enter a valid name !")
        .isLength({ min: 2, max: 50 })
        .withMessage("please enter a name between 2 -> 50 cahracters"),
body("description")
        .isString()
        .withMessage("please enter a valid description !")
        .isLength({ min: 0, max: 100 })
        .withMessage("please enter a description between 0 -> 100 cahracters"),
adminAuthonticationChecking, 

async (req, res) => {
    try {
        // 1 -> validate the fields except the image 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // 2 -> product object
        const categoryObject = {
            category_name: req.body.category_name,
            description: req.body.description,
        };

        // 3 -> insert pruduct to database
        const query = util.promisify(connection.query).bind(connection)
        await query("insert into categories set ? ", categoryObject);
        return res.status(200).json("category  Created");
    } catch (error) {
        console.log(error);
        return res.status(500).json("panic it's not working")
    }
});
router.put("/updateCategory/:id",

body("name")
        .isString()
        .withMessage("please enter a valid name!")
        .isLength({ min: 2, max: 50 })
        .withMessage("the name of the product between 2 -> 50 character"),
    body("description")
        .isString()
        .withMessage("please enter an understandable descrription")
        .isLength({ min: 0, max: 100 })
        .withMessage("please enter an well description"),

    adminAuthonticationChecking,
    async (req, res) => {
        try {
            const query = util.promisify(connection.query).bind(connection);

            // 1 -> validate the fields except the image 
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 2- > check is movie exists or not 
            const categoryExistance = await query("select * from categories where category_id = ? ", [req.params.id]);
            if (!categoryExistance[0]) {
                return res.status(404).json({ msg: "the category is not found !" });
            }

            // 3 -> product object 
            const categoryObject = {
                category_name: req.body.name,
                description: req.body.description,
            };


            // insert the new data to database
            await query("update categories set ? where category_id = ?", [categoryObject, categoryExistance[0].category_id]);

            return res.status(200).json("category updated");
        } catch (error) {
            console.log(error);
            return res.status(500).json("panic it's not working")
        }
});
router.delete("/deleteCategory/:id"

,adminAuthonticationChecking, 
async (req, res) => {
    try {
        const query = util.promisify(connection.query).bind(connection);
        // 2- > check is movie exists or not 
        const categoryExistance = await query("select * from categories where category_id = ? ", [req.params.id]);
        if (!categoryExistance[0]) {
            return res.status(404).json({ msg: "the category is not found !" });
        }
        await query("delete from categories where category_id = ?", [categoryExistance[0].category_id]);
            return res.status(200).json("category Deleted ");
        } catch (error) {
            console.log(error);
            return res.status(500).json("panic it's not working");
        }
});

+router.get("/searchCategory/:search", adminAuthonticationChecking, async (req, res) => {
    try {
        const query = util.promisify(connection.query).bind(connection);
        if (req.params.search) {
            search = `where category_name LIKE '%${req.params.search}%' `;
            const categoryInfo = await query(`select * from  categories ${search}`);
            if (!categoryInfo[0]) {
                return res.status(404).json("category doesn't existce !")
            }
            return res.status(200).json(categoryInfo);
        }
        else {
            return res.status(404).json("category doesn't existce :/");
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("something went wrong :/");
    }
});



module.exports = router ;