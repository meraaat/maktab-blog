import { check } from 'express-validator';
import mongoose from 'mongoose';

export default new class {
    handle() {
        return [
            check('user').custom(async (data, { req }) => {
                if(!data || !mongoose.Types.ObjectId.isValid(data)){
                    throw new Error('کاربر نامشخص است');
                }
                return;
            }),
            check('article').custom(async (data, { req }) => {
                if(!data || !mongoose.Types.ObjectId.isValid(data)){
                    throw new Error('مقاله نامشخص است');
                }
                return;
            }),
            check('body').not().isEmpty().withMessage('متن نظر خالی می باشد')
        ]
    }
}