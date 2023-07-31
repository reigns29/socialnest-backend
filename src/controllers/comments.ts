import express from 'express';

import { getUserBySessionToken } from '../db/users';
import { createComment, getCommentById, getCommentByUserIdAndPostId, deleteCommentById, updateCommentById } from '../db/comments';
import { updatePostAfterComment, updatePostAfterCommentDeletion } from '../db/posts';

// fetching userId 
const fetchUser = async (req: express.Request) => {
    const sessionToken = req.cookies[process.env.SECRET];

    if (!sessionToken) {
        return null;
    }

    const currentUser = await getUserBySessionToken(sessionToken);

    if (!currentUser) {
        return null;
    }

    return currentUser;
}

export const creatingComment = async (req: express.Request, res: express.Response) => {
    try {
        const { postId, content } = req.body;

        const currentUser = await fetchUser(req);

        if (!currentUser) {
            return res.sendStatus(401);
        }

        const existingComment = await getCommentByUserIdAndPostId(currentUser._id.toString(), postId);

        if (existingComment) {
            return res.status(409).json({ message: "Already commented on the Post." })
        }

        const comment = await createComment({
            userId: currentUser._id,
            postId,
            content
        })

        await updatePostAfterComment(postId, comment._id.toString());

        return res.status(201).json({ message: "Comment Successfully Created.", comment }).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateComment = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.sendStatus(400);
        }

        const comment = await getCommentById(id);

        comment.content = content;
        comment.save();

        return res.status(200).json({ message: "Comment Updated Successfully.", comment }).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteComment = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { postId } = req.body;

        const deletedComment = await deleteCommentById(id);

        await updatePostAfterCommentDeletion(postId, deletedComment._id.toString());

        return res.status(200).json({ message: "Comment Deleted Successfully.", comment: deletedComment }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}