import { Schema, model } from "mongoose"; 


const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["student", "employer"], default: 'student', required: true},
    profile: {
      type: Schema.Types.ObjectId,
      refPath: 'role'
    }
})


export default model('User', schema)