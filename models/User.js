import { Schema, model, Types } from "mongoose"; 


const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    test: [{type: Types.ObjectId, ref: 'Test'}]
})


export default model('User', schema)