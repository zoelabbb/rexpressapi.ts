import express from "express";
import * as postController from "../controller/postController";

const router = express.Router();

router.get("/:id", postController.getPostById);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePostById);
router.delete("/:id", postController.deletePostById);


export default router;

