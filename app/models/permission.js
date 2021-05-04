import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const permissionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, default: ''}
});

permissionSchema.plugin(mongoosePaginate);
export default mongoose.model('Permission', permissionSchema);