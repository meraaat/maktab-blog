import User from '../models/user.js';
import config from '../config/index.js';
import passport from 'passport';
import passportGoogle from 'passport-google-oauth';
let GoogleStrategy = passportGoogle.OAuth2Strategy;
const CLIENT_ID = config.google.login.CLIENT_ID;
const CLIENT_SECRET = config.google.login.CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    
    let user = null;
    try{
        user = await User.findOne({email: profile.emails[0].value})
        if(user){
            user.googleId = profile.id;
            return done(null, user);
        }else{
            req.flash('errors', 'کاربری با این ایمیل قبلا ثبت نام نکرده است');
            return done(null, false);
        }

    }catch(ex){
        console.log(ex);
        return done(null, false);
    }
    
    
}))
