import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const ObjectId = mongoose.Types.ObjectId;

const articleSchema = new mongoose.Schema({
    image: {type: String, required: true},
    title: {type: String, required: true},
    slug: {type: String, required: true},
    body: {type: String, required: true},
    text: {type: String, required: true},
    writer: {type: ObjectId, ref: 'User', required: true},
    date: {type: Date, default: Date.now()}
}, {
    timestamps: {
        createdAt: true
    },
    toJSON: { 
        virtuals: true
    }
});

articleSchema.plugin(mongoosePaginate);
articleSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'article'
});
export default mongoose.model('Article', articleSchema);



