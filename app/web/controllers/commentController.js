import Controller from './controller.js';
import Comment from '../../models/comment.js';


export default new class extends Controller {
    async create(req, res, next) {
        await this.completeValidation(req, res, next, this.createProcess);
    }
    async createProcess(req, res, next) {
        try {
            let newComment = new Comment({ ...req.body, accept: false });
            await newComment.save();
            req.flash('success', 'کامن ثبت شد');
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی رخ داد');
        }
        return this.back(req, res);
    }
    async list(req, res, next) {
        try {
            let page = req.query.page || 1;
            let comments = await Comment.paginate({}, { page, limit: 20, populate: ['user'] });
            return res.render('admin/comment/list', { comments });
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی رخ داد');
            return this.back(req, res);
        }
    }
    async verify(req, res, next) {
        try {
            let { commentId } = req.params;
            let comment = await Comment.findById(commentId);
            if (!comment) {
                req.flash('errors', 'کامنت یافت نشد');
                return this.back(req, res);
            }
            await comment.updateOne({ accept: true });
        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی رخ داد');
        }
        return this.back(req, res);
    }
    async cancel(req, res, next) {
        try {
            let { commentId } = req.params;
            let comment = await Comment.findById(commentId);
            if (!comment) {
                req.flash('errors', 'کامنت یافت نشد');
                return this.back(req, res);
            }
            await comment.updateOne({ accept: false });

        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی رخ داد');
        }
        return this.back(req, res);
    }
    async remove(req, res, next) {
        try {
            let { commentId } = req.params;
            let comment = await Comment.findById(commentId);
            if (!comment) {
                req.flash('errors', 'کامنت یافت نشد');
                return this.back(req, res);
            }
            await comment.deleteOne();

        } catch (ex) {
            console.log(ex);
            req.flash('errors', 'خطایی رخ داد');
        }
        return this.back(req, res);
    }
    
}