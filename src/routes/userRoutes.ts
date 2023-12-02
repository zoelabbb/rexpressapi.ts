import express from "express";
import * as userController from "../controller/userController";

const router = express.Router();

router.post("/login", userController.login);
router.post("/register", userController.createUser);

export default router;

