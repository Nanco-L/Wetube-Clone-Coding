import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const createComment = async (req, res) => {
    const {
        params: { id },
        body: { text },
        session: { user },
    } = req;
    const video = await Video.findById(id);

    if (!video) {
        return res.sendStatus(404);
    }

    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
    });

    video.comments.push(comment._id);
    video.save();
    // user.comments.push(comment._id);
    // user.save();
    return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
    const {
        params: { id },
        session: { user },
    } = req;
    const comment = await Comment.findById(id).populate("video");

    if (!comment) {
        return res.sendStatus(404);
    }
    if (String(user._id) !== String(comment.owner._id)) {
        req.flash("error", "Your not the owner of this message.");
        return res.sendStatus(401);
    }

    const video = comment.video;
    const commentIdxInVideo = video.comments.indexOf(comment._id);
    if (commentIdxInVideo < 0) {
        req.flash("error", "Cannot delete comment for unknown video");
        return res.sendStatus(404);
    }

    video.comments.splice(commentIdxInVideo, 1);
    video.save();

    await comment.delete();

    return res.sendStatus(200);
};
