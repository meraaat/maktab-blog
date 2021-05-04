import Controller from './controller.js';
import Article from '../../models/article.js';
import User from '../../models/user.js';
import moment from 'moment-jalaali';
moment.loadPersian({ dialect: 'persian', usePersianDigits: true });
export default new class extends Controller {
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            let articles = await Article.paginate({}, { page, limit: 20, sort: { date: -1 }, populate: ['writer'] });
            return res.render('home', { articles, moment });
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در بازگردانی لیست مقالات رخ داد');
            return res.render('home', { articles: [], moment });
        }
    }
    async profilePage(req, res, next) {
        try {
            let { userEmail } = req.params;
            let user = await User.findOne({email: userEmail})
            if(!user){
                req.flash('errors', 'کاربر یافت نشد');
                return this.back(req, res);
            }
            return res.render('profile', {
                user
            });
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در واکشی اطلاعات کاربر رخ داد');
            return this.back(req, res);
        }
    }

}