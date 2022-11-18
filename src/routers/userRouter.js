import express from "express";
import {
    edit,
    remove,
    see,
    logout,
    startGithubLogin,
    finishGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/:id", see);

userRouter.get("/logout", logout);
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
