// ==================== INITIALIZE EXPRESS APP ====================
const express = require("express");
const app = express();

// ====================  GLOBAL MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // TO ACCESS URL FORM ENCODED
app.use(express.static("ProductsImages"));
const cors = require("cors");
app.use(cors()); // ALLOW HTTP REQUESTS LOCAL HOSTS

// ====================  Required Module ====================
const register = require("./AdminRouters/RegisterPage");
const login = require("./AdminRouters/LoginAndLogoutPage");
const productAdmin = require("./AdminRouters/ProductAdmin");
const categoryAdmin = require("./AdminRouters/CategoryAdmin");
const userFunctionsByAdmin = require("./AdminRouters/UserFunctionsByAdmin");
const adminFunctionsByAdmin = require("./AdminRouters/AdminFunctionsByAdmin");
const userFunctions = require("./UserRouters/UserFunctions");


// ====================  RUN THE APP  ====================
app.listen(3000, "localhost", () => {
  console.log("SERVER IS RUNNING ");
});

// API routes [Endpoints]
app.use("/auth", register);
app.use("/auth", login);
app.use("/admin",productAdmin);
app.use("/admin",categoryAdmin);
app.use("/admin",userFunctionsByAdmin);
app.use("/admin",adminFunctionsByAdmin);
app.use("/user",userFunctions);


