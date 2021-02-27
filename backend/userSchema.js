import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    secondName:{
        type:String,
        required:true,
    },
    relation:{
        type:String,
    }
});
const Person = mongoose.model('Person',userSchema);
export default Person;