const router = require("express").Router();
const bcrypt = require("bcrypt");
const connection = require("../DB/dbConnector");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto")
const util = require("util"); // converting connection to promise connection 
//const userAuthorizationChecking = require("../middleware/UsersAuthorized");
// regstration route 


