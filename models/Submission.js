import { Schema, model } from "mongoose"; 

const schema = new Schema({
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    vacancy: {
      type: Schema.Types.ObjectId,
      ref: 'Vacancy'
    },
    message: {type: String, required: true},
    isConfirmed: {type: Boolean, default: false},
    employerResponse: {type: String}
})  

export default model('Submission', schema)