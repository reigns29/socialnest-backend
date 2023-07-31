import express from 'express';

const router = express.Router();

import authentication from './authentication';
import users from './users';
import posts from './posts';
import likes from './likes';
import comments from './comments';
import follows from './follows';

export default () : express.Router => {
    authentication(router);
    users(router);
    posts(router);
    likes(router);
    comments(router);
    follows(router);
    
    return router;
};