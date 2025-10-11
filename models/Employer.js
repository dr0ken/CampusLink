import { Schema, model } from "mongoose"; 


const schema = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    employerType: {type: String, enum: ["partner", "teacher"], default: 'teacher', required: true},
    organization: {type: String, required: false},
    job: {type: String, required: false},
})


export default model('Employer', schema)