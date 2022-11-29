import express from "express";
import {
    getEdit,
    postEdit,
    see,
    logout,
    startGithubLogin,
    finishGithubLogin,
    getChangePassword,
    postChangePassword,
} from "../controllers/userController";
import {
    protectorMiddleware,
    publicOnlyMiddleware,
    avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

userRouter
    .route("/edit-profile")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarUpload.single("avatar"), postEdit);
userRouter
    .route("/change-password")
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

userRouter.get("/:id([0-9a-f]{24})", see);

export default userRouter;
