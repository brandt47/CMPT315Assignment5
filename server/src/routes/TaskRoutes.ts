import express from "express";
import TaskController from '../controllers/TaskController';
import {Schemas, ValidateSchema} from '../middlewares/Validation';

/*Here we are telling our Express application that we want a post request that can handle /register*/
//whenever we get /register it will be handled by AuthController


const router = express.Router();

router.get("/getAll", TaskController.getAllTasks); 
// router.post("/getAll", ValidateSchema(Schemas.task.getAll), TaskController.getAllTasks);
router.post("/create", ValidateSchema(Schemas.task.create), TaskController.createTask);
router.post("/update", ValidateSchema(Schemas.task.update), TaskController.updateTask);
router.post("/delete", ValidateSchema(Schemas.task.delete), TaskController.deleteTask);

export = router;