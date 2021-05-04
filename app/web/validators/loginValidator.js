import {check} from 'express-validator';

export default new class { 
    handle(){
        return [
            check('email').isEmail().withMessage('فرمت ایمیل وارد شده صحیح نمی باشد'),
            check('password').not().isEmpty().withMessage('رمز عبور را وارد کنید')
        ]
    }
}