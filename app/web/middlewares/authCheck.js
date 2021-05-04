import Middleware from './middleware.js';

export default new class extends Middleware { 
    handle(){
        return function(req, res, next){
            if(req.isAuthenticated && req.isAuthenticated()){
                return next();
            }
            return res.redirect('/auth/login');
        }
    }
}