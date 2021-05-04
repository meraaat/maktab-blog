import Controller from './controller.js';
import User from '../../models/user.js';
import fs from 'fs';


export default new class AdminController extends Controller {
    index(req, res, next) {
        return res.render('admin/home');
    }

    async profilePage(req, res, next) {
        try {
            let { userEmail } = req.params;
            let user = await User.findOne({ email: userEmail });
            if (!user) {
                req.flash('errors', 'کاربر یافت نشد');
                return this.back(req, res);
            }
            return res.render('admin/user/profile', {
                user
            });
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در بازگردانی اطلاعات کاربر رخ داد');
            return this.back(req, res);
        }
    }

    async profileEdit(req, res, next) {
        let result = await this.validationForm(req);
        if (!result) {
            if (req.file) {
                fs.unlinkSync(`${req.file.destination}/${req.file.filename}`);
            }
            return this.back(req, res);
        }
        return this.profileEditProcess(req, res, next);
    }

    async profileEditProcess(req, res, next) {
        try {
            let { firstName, lastName, email, phoneNumber, oldPassword, password } = req.body;
            let { userEmail } = req.params;
            let user = await User.findOne({ email: userEmail });
            if (!user) {
                req.flash('errors', 'کاربر یافت نشد');
                return this.back(req, res);
            }
            if (password && !user.comparePassword(oldPassword)) {
                req.flash('errors', 'رمز عبور قبلی را درست وارد کنید');
                return this.back(req, res);
            }
            if (req.file) {
                req.body.profile = `${req.file.destination}/${req.file.filename}`.substring(8);
            }
            if(!req.body.password || req.body.password == ''){
                delete req.body.password;
            }
            await user.updateOne({...req.body});
            

            req.flash('success', 'ویرایش پروفایل با موفقیت انجام شد');
            return this.back(req, res);
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در ویرایش پروفایل رخ داد');
            return this.back(req, res);
        }
    }
}