import express from 'express';
import {get} from 'lodash';

import { createPost , getPosts , getPostsByUserId , getPostsByTitle , updatePostById , deletePostById , getPostById} from '../db/posts';
import { getUserBySessionToken , getUserById} from '../db/users';

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

export const creatingPost = async (req : express.Request , res : express.Response ) => {
    try{
        const {title , description } = req.body;

        const currentUser = await fetchUser(req);

        if(!currentUser){
            return res.sendStatus(401);
        }

        const post = await createPost({
            title ,
            description,
            userId : currentUser._id
        })
        return res.status(201).json({message : "Post Successfully Created" , post , user : currentUser}).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllPosts = async (req : express.Request , res : express.Response) => {
    try{
        const posts = await getPosts();

        return res.status(200).json(posts).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getMyPosts = async (req : express.Request , res : express.Response) => {
    try{
        const currentUser = await fetchUser(req);
        
        if(!currentUser){
            return res.sendStatus(401);
        }

        const posts = await getPostsByUserId(currentUser._id.toString());

        return res.status(200).json({user : currentUser._id , posts}).end();
    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllPostsByUserId = async (req : express.Request , res : express.Response) => {
    try{
        const { id } = req.params;

        if(!id){
            return res.sendStatus(400);
        }

        const user = await getUserById(id);

        if(!user){
            return res.sendStatus(400);
        }

        const posts = await getPostsByUserId(id);

        return res.status(200).json({message : user._id ,  posts}).end();
    } catch (error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const searchPostsByTitle = async (req : express.Request , res : express.Response) => {
    try{
        const title = get(req.query , 'where.title.like');

        const posts = await getPostsByTitle(title.toString());

        if(posts.length === 0){
            return res.sendStatus(404);
        }

        return res.status(200).json({message : "Post Searched Successfully" , posts }).end();
    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deletePost = async (req : express.Request , res : express.Response) => {
    try{
        const { id } = req.params;

        if(!id){
            return res.sendStatus(400);
        }

        const deletedPost = await deletePostById(id);

        return res.status(200).json({message : "Post Deleted Successfully." , post : deletedPost}).end()
    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updatePost = async (req : express.Request , res : express.Response) => {
    try{
        const { id } = req.params;
        const { description } = req.body;

        if(!id){
            return res.sendStatus(400);
        }

        if(!description){
            return res.sendStatus(400);
        }

        const post = await getPostById(id);

        post.description = description;
        post.save();

        return res.status(200).json({messsage : "Post updated successfully. " , post}).end();

    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}