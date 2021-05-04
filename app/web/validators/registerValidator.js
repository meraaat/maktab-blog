import { check } from 'express-validator';

export default new class {
    handle() {
        return [
            check('email').isEmail().withMessage('فرمت ایمیل وارد شده معتبر نیست'),
            check('password').isLength({min: 8}).withMessage('رمز عبور نمیتواند کمتر از ۸ کاراکتر باشد'),
            check('phoneNumber').not().isEmpty().withMessage('فرمت شماره تلفن وارد شده صحیح نمیباشد'),
            check('firstName').not().isEmpty().withMessage('نام را وارد کنید'),
            check('lastName').not().isEmpty().withMessage('نام خانوادگی را وارد کنید')
        ];
    }
}