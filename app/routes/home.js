import { Server } from 'socket.io';
import express from 'express';
const router = express.Router();
//==================controllers====================
import homeController from '../web/controllers/homeController.js'
import adminController from '../web/controllers/adminController.js';
import articleController from '../web/controllers/articleController.js';
import commentController from '../web/controllers/commentController.js';
//===================validators====================
import commentValidator from '../web/validators/commentValidator.js';
//=====================others======================
import profileUpload from '../upload/profileUpload.js';

router.get('/chat', (req, res, next) => {
    let io = new Server(res.locals.server);
    io.on('connection', function(socket) {
        console.log('socket connected');
        socket.emit('hello', 'hello world');
        socket.on('message', data => {
            console.log(data);
            
            socket.broadcast.emit('message', data);
        });
    });
    return res.render('chat');
});

router.get('/logout', (req, res, next) => {
    req.logout();
    return res.redirect('/');
});
router.get('/profile/:userEmail', homeController.profilePage);
router.post('/profile/:userEmail', profileUpload.single('profile'),adminController.profileEdit);
router.get('/article/:articleId', articleController.singlePage);
router.post('/comment/create', commentValidator.handle(), commentController.create);

router.get('/', homeController.index);


export default router;