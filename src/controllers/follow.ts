import express from 'express';

import { getUserBySessionToken  , updateUserAfterFollow , updateUserAfterFollowing , updateUserAfterUnfollow , updateUserAfterUnfollowing} from '../db/users';
import { FollowModel , createFollow , getFollowObject , deleteFollow } from '../db/follow';
import { FollowingModel , createFollowing , getFollowingObject , deleteFollowing } from '../db/following';

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

export const followUser = async (req : express.Request , res : express.Response) => {
    try{
        const { toUserId } = req.body;

        const currentUser = await fetchUser(req);

        if(!currentUser){
            return res.sendStatus(401);
        }

        const fromUserId = currentUser._id;

        const followedAlready = await getFollowObject(toUserId);

        if(followedAlready){
            return res.status(409).json({message : "Already followed ."})
        }

        const followingAlready = await getFollowingObject(fromUserId.toString());

        if(followingAlready){
            return res.status(409).json({message : "Already followed ."}) 
        }

        const followed = await createFollow(toUserId);
        await updateUserAfterFollow(fromUserId.toString() , followed._id.toString())

        const following = await createFollowing(fromUserId.toString());
        await updateUserAfterFollowing(toUserId , following._id.toString());

        return res.status(201).json({message : "Follow Successfully Created . " , toUserId , fromUserId})
        

    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const unFollowUser = async (req : express.Request , res : express.Response) => {
    try{
        const { toUserId } = req.body;

        const currentUser = await fetchUser(req);

        if(!currentUser){
            return res.sendStatus(401);
        }

        const fromUserId = currentUser._id;

        const followedAlready = await getFollowObject(toUserId);

        if(!followedAlready){
            return res.status(409).json({message : "Follow first."})
        }

        const followingAlready = await getFollowingObject(fromUserId.toString());

        if(!followingAlready){
            return res.status(409).json({message : "Follow first."})
        }

        const followed = await deleteFollow(followedAlready._id.toString());
        await updateUserAfterUnfollow(fromUserId.toString() , followed._id.toString());

        const following = await deleteFollowing(followingAlready._id.toString());
        await updateUserAfterUnfollowing(toUserId , following._id.toString());

        return res.sendStatus(200);
        

    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}