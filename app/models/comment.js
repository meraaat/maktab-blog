import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const ObjectId = mongoose.Types.ObjectId;


const schema = new mongoose.Schema({
    user: {type: Object, ref: 'User', required: true},
    parent: {type: ObjectId, ref: 'Comment', default: null},
    body: {type: String, required: true},
    accept: {type: Boolean, default: false},
    article: {type: ObjectId, ref: 'Article', required: true}
}, {
    timestamps: {
        createdAt: true
    },
    toJSON: {
        virtuals: true
    }
});

schema.plugin(mongoosePaginate);
schema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parent'
});
export default mongoose.model('Comment', schema);