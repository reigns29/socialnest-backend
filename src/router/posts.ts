import express from 'express';

import { creatingPost , getAllPosts , getAllPostsByUserId , getMyPosts , searchPostsByTitle , deletePost , updatePost } from '../controllers/posts';
import { isAuthenticated , isOwnerOfPost } from '../middlewares';

export default (router : express.Router) => {
    router.post('/api/posts', isAuthenticated , creatingPost);
    router.get('/api/posts' ,isAuthenticated , getAllPosts);
    router.get('/api/my-posts' ,isAuthenticated , getMyPosts);
    router.get('/api/posts/:id' ,isAuthenticated , getAllPostsByUserId);
    router.get('/api/search-posts' , isAuthenticated , searchPostsByTitle);
    router.delete('/api/posts/:id' , isAuthenticated , isOwnerOfPost , deletePost);
    router.patch('/api/posts/:id' , isAuthenticated , isOwnerOfPost , updatePost);
}