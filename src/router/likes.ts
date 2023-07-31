import express from 'express';

import { Like , UnLike } from '../controllers/likes';
import { isAuthenticated } from '../middlewares';

export default (router : express.Router) => {
    router.post('/api/likes', isAuthenticated , Like);
    router.post('/api/likes/unlike' , isAuthenticated , UnLike);
}