import { Schema, model } from "mongoose"; 

const schema = new Schema({
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {type: String, required: true},
    description: {type: String, required: true},
    studentCount: {type: Number, default: 1},
    pendingSubmissions: {
      type: [Schema.Types.ObjectId],
      ref: 'Submission',
    },
    confirmedSubmissions: {
      type: [Schema.Types.ObjectId],
      ref: 'Submission'
    },
})


export default model('Vacancy', schema)