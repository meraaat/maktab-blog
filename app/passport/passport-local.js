import passport from 'passport';
import passportLocal from 'passport-local';
import User from '../models/user.js';

let LocalStrategy = passportLocal.Strategy;
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        let user = await User.findOne({ email });
        if (user) {
            req.flash('errors', 'کاربری با این نام کاربری یا ایمیل قبلا ثبت نام کرده است');
            return done(null, false);
        }
        user = new User({
            ...req.body
        });
        await user.save();
        req.flash('success', 'عملیات ثبت نام با موفقیت انجام شد');
        return done(null, user);
    } catch (ex) {
        console.log(ex);
        req.flash('errors', 'خطایی در عملیات ثبت نام رخ داد');
        return done(null, false);
    }
}));




passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    try{
        let user = await User.findOne({email});
        if(!user){
            req.flash('errors', 'کاربری با این مشخصات یافت نشد');
            return done(null, false);
        }
        if(!user.comparePassword(password)){
            req.flash('errors', 'رمز عبور اشتباه است');
            return done(null, false);
        }
        req.flash('success', 'با موفقیت وارد شدید');
        return done(null, user);
    }catch(ex){
        console.log(ex);
        req.flash('errors', 'خطایی در عملیات ورود رخ داد');
        return done(null, false);
    }
}));
