import express from 'express';

import { getUserBySessionToken } from '../db/users';
import { createLike , getLikesByUserIdAndPostId , deleteLike } from '../db/likes';
import { getPostById , updatePostAfterLike , updatePostAfterUnLike} from '../db/posts';

// fetching userId 
const fetchUser = async (req : express.Request ) => {
    const sessionToken = req.cookies[process.env.SECRET];

    if(!sessionToken){
        return null;
    }

    const currentUser = await getUserBySessionToken(sessionToken);

    if(!currentUser){
        return null;
    }

    return currentUser;
}

export const Like = async (req : express.Request , res : express.Response) => {
    try{
        const { postId } = req.body;

        const currentUser = await fetchUser(req);

        if(!currentUser){
            return res.sendStatus(401);
        }

        const existingLike = await getLikesByUserIdAndPostId(currentUser._id.toString() , postId);

        if(existingLike){
            return res.status(409).json({message : "Already Liked the Post."}).end();
        }

        const like = await createLike({
            userId : currentUser._id,
            postId
        })

        await updatePostAfterLike(postId ,like._id.toString());

        return res.status(201).json({message : "Like Successfully Created" , like}).end();

    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const UnLike = async (req : express.Request , res : express.Response) => {
    try{
        const { postId } = req.body;

        const currentUser = await fetchUser(req);

        if(!currentUser){
            return res.sendStatus(401);
        }

        const existingLike = await getLikesByUserIdAndPostId(currentUser._id.toString() , postId);

        if(!existingLike){
            return res.status(400);
        }

        const deletedLike = await deleteLike(existingLike._id.toString());

        await updatePostAfterUnLike(postId , deletedLike._id.toString());

        return res.sendStatus(200);

    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}