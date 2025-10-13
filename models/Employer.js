import { Schema, model } from "mongoose"; 

/**
 * @swagger
 * components:
 *  schemas:
 *    Employer:
 *      type: object
 *      required:
 *        - name
 *        - employerType
 *      properties:
 *        id:
 *          type: string
 *          description: Уникальный случайно сгенерированный id работодателя
 *        name:
 *          type: string
 *          description: Имя работодателя
 *        employerType:
 *          type: string
 *          enum: [partner, teacher]
 *          description: Тип работодателя
 *        organization:
 *          type: string
 *          description: Организация (Обязательно для employerType "partner")
 *        job:
 *          type: string
 *          description: Должность (Обязательно для employerType "partner")
 *      example:
 *        id: 68eca24bc9c58dc1688d0542
 *        name: Иван Иванов
 *        employerType: partner
 *        organization: ООО Технологии
 *        job: Менеджер по развитию
 */

const schema = new Schema({
    name: {type: String, required: true},
    employerType: {type: String, enum: ["partner", "teacher"], default: 'teacher', required: true},
    organization: {type: String, required: false},
    job: {type: String, required: false},
    vacancies: {type: [Schema.Types.ObjectId], ref: "Vacancy", default: []}
})

export default model('employer', schema)