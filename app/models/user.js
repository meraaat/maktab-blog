import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    profile: {type: String, default: ''},
    phoneNumber: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    googleId: {type: String, default: ''}
});

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

userSchema.pre('save', function(next){
    let salt = bcrypt.genSaltSync(15);
    let hashed = bcrypt.hashSync(this.password, salt);
    this.password = hashed;
    next();
});

userSchema.pre('updateOne', function(next) {
    if(this.getUpdate().password){
        let salt = bcrypt.genSaltSync(15);
        let hashed = bcrypt.hashSync(this.getUpdate().password, salt);
        this.getUpdate().password = hashed;
    }
    next();
});



export default mongoose.model('User', userSchema);