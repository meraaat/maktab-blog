import Middleware from './middleware.js';

export default new class extends Middleware { 
    handle(req, res, next){
        if(req.isAuthenticated && req.isAuthenticated()){
            return res.redirect('/');
        }
        return next();
    }
}