import Controller from './controller.js';
import passport from 'passport';

export default new class extends Controller { 
    index(req, res, next){
        return res.render('auth/login', {
            recaptcha: this.recaptcha.render()
        });
    }

    async login(req, res, next){
        let validateRecaptcha = await this.validationRecaptcha(req);
        if(!validateRecaptcha){
            return false;
        }
        let result = await this.validationForm(req);
        if(!result){
            return this.back(req, res);
        }
        return this.loginProcess(req, res, next);
    }
    async loginProcess(req, res, next){
        passport.authenticate('local-login', (error, user) => {
            if(error){
                req.flash('error', 'خطایی در عملیات ورود رخ داد');
                console.log(error);
                return this.back(req, res);
            }
            req.login(user, error => {
                if(error){
                    req.flash('error', 'خطایی در عملیات ورود رخ داد');
                    console.log(error);
                    return this.back(req, res);
                }
                res.redirect('/');
            });
        })(req, res, next);
    }
    googleLogin(req, res, next){
        passport.authenticate('google', {scope: ['profile', 'email']})(req, res, next)
    }
    googleLoginCallback(req, res, next){
        passport.authenticate('google', {failureRedirect: '/auth/login', successRedirect: '/'})(req, res, next)
    }
}