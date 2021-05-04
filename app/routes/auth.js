
import express from 'express';
const router = express.Router();

//==================controllers====================
import registerController from '../web/controllers/registerController.js';
import loginController from '../web/controllers/loginController.js';
//===================validators====================
import registerValidator from '../web/validators/registerValidator.js';
import loginValidator from '../web/validators/loginValidator.js';
//=====================others======================



router.get('/register', registerController.index);
router.post('/register', registerValidator.handle(), registerController.register);

router.get('/login', loginController.index);
router.post('/login', loginValidator.handle(), loginController.login);

router.get('/google', loginController.googleLogin)
router.get('/google/callback', loginController.googleLoginCallback)

export default router;