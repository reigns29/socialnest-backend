import express from 'express';

import { followUser , unFollowUser } from '../controllers/follow';
import { isAuthenticated } from '../middlewares';

export default (router : express.Router) => {
    router.post('/api/follows', isAuthenticated , followUser);
    router.post('/api/follows/unfollow' , isAuthenticated , unFollowUser);
}