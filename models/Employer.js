import { Schema, model } from "mongoose"; 


const schema = new Schema({
    name: {type: String, required: true},
    employerType: {type: String, enum: ["partner", "teacher"], default: 'teacher', required: true},
    organization: {type: String, required: false},
    job: {type: String, required: false}
})


export default model('employer', schema)