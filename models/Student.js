import { Schema, model } from "mongoose"; 

/**
 * @swagger
 * components:
 *  schemas:
 *    Student:
 *      type: object
 *      required:
 *        - name
 *        - group
 *      properties:
 *        id:
 *          type: string
 *          description: Уникальный случайно сгенерированный id пользователя
 *        name:
 *          type: string
 *          description: Имя студента
 *        group:
 *          type: string
 *          description: Академическая группа студента
 *      example:
 *        id: 68eca24bc9c58dc1688d0542
 *        name: Иван Иванов
 *        group: РИ-240000
 */


const schema = new Schema({
    name: {type: String, required: true},
    group: {type: String, required: true}
})


export default model('student', schema)