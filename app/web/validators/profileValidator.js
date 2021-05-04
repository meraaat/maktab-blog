import { check } from 'express-validator';

export default new class {
    handle() {
        return [
            check('email').isEmail().withMessage('فرمت ایمیل وارد شده معتبر نیست'),
            check('phoneNumber').not().isEmpty().withMessage('فرمت شماره تلفن وارد شده صحیح نمیباشد'),
            check('firstName').not().isEmpty().withMessage('نام را وارد کنید'),
            check('lastName').not().isEmpty().withMessage('نام خانوادگی را وارد کنید'),
            check('oldPassword').custom(async (data, { req }) => {
                if(req.body.password && !data){
                    throw new Error('رمز عبور قبلی خود را وارد کنید')
                }
            })
        ];
    }
}