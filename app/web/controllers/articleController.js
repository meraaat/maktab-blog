import Controller from './controller.js';
import Article from './../../models/article.js';
import fs from 'fs';
import Comment from '../../models/comment.js';
import moment from 'moment-jalaali';
moment.loadPersian({ dialect: 'persian', usePersianDigits: true });
export default new class extends Controller {
    async list(req, res, next) {
        try {
            let page = req.query.page || 1;
            let articles = await Article.paginate({}, {
                page, limit: 20, populate: [
                    {
                        path: 'writer'
                    }
                ]
            });
            return res.render('admin/article/list', { articles });
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در بازگردانی لیست مقاله ها رخ داد');
            return this.back(req, res);
        }
    }
    async search(req, res, next) {
        try {
            let search = req.params.search || '';
            let page = req.query.page || 1;
            let articles = await Article.paginate({
                $or: [
                    { title: { $regex: search } },
                    { text: { $regex: search } }
                ]
            }, {
                page, limit: 20, populate: [
                    {
                        path: 'writer'
                    }
                ]
            });
            return res.render('admin/article/search', { articles, search });
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در بازگردانی لیست مقاله ها رخ داد');
            return this.back(req, res);
        }
    }
    createPage(req, res, next) {
        return res.render('admin/article/create');
    }
    async create(req, res, next) {
        await this.completeValidation(req, res, next, this.createProcess);
    }
    async createProcess(req, res, next) {
        try {
            req.body.slug = req.body.title.split(' ').join('_').toString();
            req.body.writer = req.user._id;
            let newArticle = new Article({ ...req.body });
            await newArticle.save();
            req.flash('success', 'مقاله جدید با موفقیت ایجاد شد');
            return res.redirect('/admin/article/list');
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در ایجاد مقاله رخ داد');
            return this.back(req, res);
        }
    }
    async editPage(req, res, next) {
        try {
            let { articleId } = req.params;
            let article = await Article.findById(articleId);
            if (!article) {
                req.flash('errors', 'مقاله یافت نشد');
            } else {
                return res.render('admin/article/edit', { article });
            }
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطای در بازگردانی اطلاعات مقاله رخ داد');
        }
        return this.back(req, res);
    }
    async edit(req, res, next) {
        await this.completeValidation(req, res, next, this.editProcess);
    }
    async editProcess(req, res, next) {
        try {
            let { articleId } = req.params;
            let article = await Article.findById(articleId);
            if (!article) {
                req.flash('errors', 'مقاله یافت نشد');
            } else {
                if (req.file) {
                    if (article.image && article.image != '') {
                        let imagePath = `./public${article.image}`;
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    }
                }
                req.body.slug = req.body.title.split(' ').join('_').toString();

                await article.updateOne({ ...req.body, date: Date.now() });
                req.flash('success', 'ویرایش مقاله با موفقیت انجام شد');
            }
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در ویرایش مقاله رخ داد');
        }
        return this.back(req, res);
    }
    async remove(req, res, next) {
        try {
            let { articleId } = req.params;
            let article = await Article.findById(articleId);
            if (!article) {
                req.flash('errors', 'مقاله یافت نشد');
            } else {
                if (article.image && article.image != '') {
                    let imagePath = `./public${article.image}`;
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }

                }
                req.flash('success', 'مقاله با موفقیت حذف شد');
                await article.deleteOne();
            }
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در حذف مقاله رخ داد');
        }
        return this.back(req, res);
    }
    async singlePage(req, res, next) {
        try {
            let { articleId } = req.params;
            let article = await Article.findById(articleId).populate([
                {
                    path: 'comments',
                    match: {
                        accept: true,
                        parent: null
                    },
                    populate: [
                        {
                            path: 'user'
                        },
                        {
                            path: 'comments',
                            populate: {
                                path: 'user'
                            },
                            match: {
                                accept: true
                            }
                        }
                    ]
                },
                {
                    path: 'writer'
                }
            ]);
            
            if (!article) {
                req.flash('errors', 'مقاله یافت نشد');
            } else {
                return res.render('article', { article, moment });
            }
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی در بازگردانی اطلاعات مقاله رخ داد');
        }
        return this.back(req, res);
    }
}