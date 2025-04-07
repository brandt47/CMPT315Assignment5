import express from "express";
import TimerController from '../controllers/TimerController';
import {Schemas, ValidateSchema} from '../middlewares/Validation';

/*Here we are telling our Express application that we want a post request that can handle /register*/
//whenever we get /register it will be handled by AuthController


const router = express.Router();

router.post("/getAll", ValidateSchema(Schemas.timer.getAll), TimerController.getAllTimers);
router.post("/create", ValidateSchema(Schemas.timer.create), TimerController.createTimer);
router.post("/update", ValidateSchema(Schemas.timer.update), TimerController.updateTimer);
router.post("/delete", ValidateSchema(Schemas.timer.delete), TimerController.deleteTimer);

export = router;