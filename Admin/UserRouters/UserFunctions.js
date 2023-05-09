const router = require("express").Router();
const userAuthorizationChecking = require("../middleware/UsersAuthorized");
const {body ,validationResult} = require("express-validator")
//const imageAthorizedChecking = require("../middleware/UploadImagesAuthorized")
const util = require("util");
const connection = require("../DB/dbConnector");
//const fileSystem = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const now = new Date();


router.post ("/addCartItem/:user_id/:product_id" , userAuthorizationChecking , async  (req , res) => {
    try {
        const query = util.promisify(connection.query).bind(connection);
        const productObject = await query("select * from products where product_id = ?", [req.params.product_id]);
        if (!productObject[0]){
            return res.status(404).json("product doesn't exist");
        }
        const cartInfo = {
            user_id: req.params.user_id,
            product_id: req.params.product_id,
            quantity: 1,
            price: productObject[0].price,
        };
        await query("insert into cart set ?", [cartInfo]);
        await addOrder(req , res);
        return res.status(200).json("added to cart successfuly");
    } catch (error) {
        console.log (error);
        return res.status(500).json("something went wrong :/");
    }
});


router.delete ("/deleteCartItem/:cart_id" , userAuthorizationChecking , async  (req , res) => {
    try {
        const query = util.promisify(connection.query).bind(connection);
        const cartExistance = await query("select * from cart where cart_id = ?", [req.params.cart_id]);
        if (!cartExistance[0]){
            return res.status(404).json("cart doesn't exist");
        }
        await query("delete from cart where cart_id = ?", [req.params.cart_id]);
        await query("delete from orders where cart_id = ?", [req.params.cart_id]);
        return res.status(200).json("deleted the cart successfuly");
    } catch (error) {
        console.log (error);
        res.status(500).json("something went wrong :/");
    }
});


router.get("/showHistoryCart/:user_id" , userAuthorizationChecking , async (req , res) => {
    try {
        const query = util.promisify(connection.query).bind(connection);
        const userHistoryCart = await query ("select orders.order_date ,orders.total_price ,products.name  from orders join products ON orders.order_id = products.orders_product or where user_id = ? ",[req.params.user_id]);
        if (!userHistoryCart[0]){
            return res.status(404).json("there is nothing in your cart ! go to add some ");
        }
        return res.status(200).json(userHistoryCart);
    } catch (error) {
        console.log (error);
        res.status(500).json("something went wrong :/");
    }

});

async function addOrder(req ,res){
    try {
        const query = util.promisify(connection.query).bind(connection);
        const cartExistance = await query("select * from cart where user_id = ? ", [req.params.user_id]);
        if (!cartExistance[0]){
            return res.status(404).json("cart doesn't exist");
        }
        const orderInfo = {
            user_id: req.params.user_id,
            cart_id : cartExistance[cartExistance.length - 1].cart_id,
            order_date : now.toLocaleString(),
            total_price: cartExistance[0].price,
        };
        await query("insert into orders set ?", [orderInfo]);
    } catch (error) {
        console.log (error);
    }
    


}



module.exports = router ;