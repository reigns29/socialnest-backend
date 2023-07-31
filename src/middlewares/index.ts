import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';
import { getPostById } from '../db/posts';
import { getCommentById } from '../db/comments';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.sendStatus(403)
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403)
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies[process.env.SECRET];

        if (!sessionToken) {
            return res.sendStatus(401)
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(401);
        }

        merge(req, { identity: existingUser });

        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const isOwnerOfPost = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const postId = id;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.sendStatus(401);
        }

        const post = await getPostById(postId);

        if (!post) {
            return res.sendStatus(400)
        }

        if (currentUserId.toString() !== post.userId.toString()) {
            return res.sendStatus(403);
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const isOwnerOfComment = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const commentId = id;

        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.sendStatus(401);
        }

        const comment = await getCommentById(commentId);

        if (!comment) {
            return res.sendStatus(400);
        }

        if (currentUserId.toString() !== comment.userId.toString()) {
            return res.sendStatus(403);
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
} 