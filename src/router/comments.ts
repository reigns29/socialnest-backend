import express from 'express';

import { creatingComment , updateComment , deleteComment } from '../controllers/comments';
import {isAuthenticated , isOwnerOfComment } from '../middlewares';

export default (router : express.Router) => {
    router.post('/api/comments' , isAuthenticated , creatingComment);
    router.patch('/api/comments/:id' , isAuthenticated , isOwnerOfComment , updateComment);
    router.delete('/api/comments/:id' , isAuthenticated , isOwnerOfComment , deleteComment);
}