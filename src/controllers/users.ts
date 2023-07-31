import express from 'express';
import { get } from 'lodash';

import { getUsers , deleteUserById , getUserById , getUsersByUsername } from '../db/users';

export const getAllUsers = async (req : express.Request , res : express.Response) => {
    try{
        const users = await getUsers();
 
        return res.status(200).json(users).end();
    } catch(error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req : express.Request , res : express.Response) => {
    try{
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req : express.Request , res : express.Response) => {
    try{
        const { id } = req.params;
        const { username } = req.body;

        if(!username){
            return res.sendStatus(400)
        }

        const user = await getUserById(id);

        user.username = username;
        user.save();

        return res.status(200).json(user).end();

    } catch (error){
        return res.sendStatus(400)
    }
}

export const searchUserByUsername = async (req : express.Request , res : express.Response) => {
    try{
        const username = get(req.query , 'where.username.like');

        if(!username){
            return res.sendStatus(400)
        }

        const users = await getUsersByUsername(username.toString());

        if(users.length === 0 ){
            return res.sendStatus(404);
        }

        return res.status(200).json({message : "Users fetched successfully" , users})

    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}