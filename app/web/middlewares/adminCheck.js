import Middleware from './middleware.js';

export default new class extends Middleware { 
    handle(req, res, next){
        if(req.user?.isAdmin){
            return next();
        }
        return res.redirect('/');
    }
}