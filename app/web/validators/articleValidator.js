import { check } from 'express-validator';
import path from 'path';

export default new class {
    handle() {
        return [
            check('image').custom(async(data, {req}) => {

                if(!data){
                    if(req.query._method == 'PUT'){
                        return;
                    }else{
                        throw new Error('تصویر مقاله را وارد کنید');
                    }
                    
                }
                let extention = path.extname(data);
                if(data && !['.jpg', '.jpeg', '.png', '.svg'].includes(extention)){
                    throw new Error('فرمت فایل انتخابی پشتیبانی نمی شود');
                }
                return;
            }),
            check('body').not().isEmpty().withMessage('متن مقاله را وارد کنید'),
            check('title').not().isEmpty().withMessage('عنوان مقاله را وارد کنید')
        ]
    }
}