import Controller from './controller.js';
import passport from 'passport';


export default new class RegisterController extends Controller { 
    
    index(req, res, next){
        return res.render('auth/register', {
            recaptcha: this.recaptcha.render()
        });
    }

    async register(req, res, next){
        let validateRecaptcha = await this.validationRecaptcha(req);
        if(!validateRecaptcha){
            return false;
        }
        let result = await this.validationForm(req);
        if(!result){
            return this.back(req, res);
        }
        return this.registerProcess(req, res, next);
    }
    async registerProcess(req, res, next){
        passport.authenticate('local-register', {
            successRedirect: '/',
            failureRedirect: '/auth/register'
        })(req, res, next);
    }
}