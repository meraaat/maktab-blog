import express from 'express';
const router = express.Router();

//===============controllers=================
import adminController from './../web/controllers/adminController.js';
import articleController from '../web/controllers/articleController.js';
import CommentController from '../web/controllers/commentController.js';
//==============validators===================
import profileValidator from '../web/validators/profileValidator.js';
import articleValidator from '../web/validators/articleValidator.js';
//================others=====================
import profileUpload from '../upload/profileUpload.js';
import articleUpload from '../upload/articleUpload.js';
import commentController from '../web/controllers/commentController.js';

router.use((req, res, next) => {
    res.locals.layout = 'admin/admin-master';
    next();
});

router.get('/', adminController.index);
//============================================profile==============================================
router.get('/profile/:userEmail', adminController.profilePage);
router.post('/profile/:userEmail', profileUpload.single('profile'), profileValidator.handle(), adminController.profileEdit);

//=============================================article===============================================
router.get('/article/create', articleController.createPage);
router.post('/article/create', articleUpload.single('image'), (req, res, next) => {
    if (req.file) {
        req.body.image = `${req.file.destination}/${req.file.filename}`.substring(8);
    } else {
        req.body.image = '';
    }
    next();
}, articleValidator.handle(), articleController.create);
router.get('/article/list', articleController.list);
router.get('/article/search/:search', articleController.search);
router.post('/article/search/:search', articleController.search);
router.get('/article/edit/:articleId', articleController.editPage);
router.put('/article/edit/:articleId', articleUpload.single('image'), (req, res, next) => {
    if (req.file) {
        req.body.image = `${req.file.destination}/${req.file.filename}`.substring(8);
    } else {
        delete req.body.image;
    }
    next();
}, articleValidator.handle(), articleController.edit);
router.get('/article/delete/:articleId', articleController.remove);
//========================================comment================================================
router.get('/comment/list', commentController.list);
router.get('/comment/verify/:commentId', commentController.verify);
router.get('/comment/cancel/:commentId', commentController.cancel);
router.get('/comment/delete/:commentId', commentController.remove);

export default router;