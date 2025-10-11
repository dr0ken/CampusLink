import { Schema, model } from "mongoose"; 


const schema = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    group: {type: String, required: true}
})


export default model('Student', schema)