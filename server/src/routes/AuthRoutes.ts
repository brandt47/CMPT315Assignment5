import express from "express";
import AuthController from '../controllers/AuthController';
import {Schemas, ValidateSchema} from '../middlewares/Validation';

/*Here we are telling our Express application that we want a post request that can handle /register*/
//whenever we get /register it will be handled by AuthController


const router = express.Router();

router.post("/register", ValidateSchema(Schemas.user.create), AuthController.handleRegister);
router.post("/login", ValidateSchema(Schemas.user.login), AuthController.handleLogin);

export = router;