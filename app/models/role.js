import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const ObjectId = mongoose.Types.ObjectId;

const roleSchema = new mongoose.Schema({
    name: {type: String, required: true},
    permissions: [{type: ObjectId, ref: 'Permission', required: true}],
    description: {type: String, default: ''}
});

roleSchema.plugin(mongoosePaginate);
export default mongoose.model('Permission', permissionSchema);