import { Schema, model } from "mongoose"; 

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - email
 *        - role
 *      properties:
 *        id:
 *          type: string
 *          description: Уникальный случайно сгенерированный id пользователя
 *        email:
 *          type: string
 *          description: Электронная почта пользователя
 *        role:
 *          type: string
 *          enum: [student, employer]
 *          description: Роль пользователя
 *        profile:
 *           oneOf:
 *             - $ref: '#/components/schemas/Student'
 *             - $ref: '#/components/schemas/Employer'
 *           description: Профиль пользователя. Тип зависит от роли
 *      example:
 *        id: 68eca24bc9c58dc1688d0542
 *        email: ivanovivan@gmail.com
 *        role: student
 */

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