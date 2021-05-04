import express from 'express';
const router = express.Router();
import Article from './../models/article.js';
//==================middleware================
import authCheck from '../web/middlewares/authCheck.js';
import adminCheck from '../web/middlewares/adminCheck.js';
import authenticatedRedirect from '../web/middlewares/authenticatedRedirect.js';
//==================routes====================
import authRoutes from './auth.js';
import homeRoutes from './home.js';
import adminRoutes from './admin.js';


router.use('/admin', authCheck.handle(), adminCheck.handle, adminRoutes);
router.use('/auth', authenticatedRedirect.handle, authRoutes);
router.use('/', authCheck.handle(), homeRoutes);

export default router;