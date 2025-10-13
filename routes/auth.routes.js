import {Router} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import Student from '../models/Student.js'
import Employer from '../models/Employer.js'
const router = Router()

const roles = ['employer', 'student']
const employerTypes = ['partner', 'teacher']


/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: API для аутентификации пользователей
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: |
 *       Создает нового пользователя с одной из ролей (student, employer).
 *       Валидация полей зависит от выбранной роли:
 *       - Для студента обязательна группа
 *       - Для работодателя обязателен тип работодателя
 *       - Для работодателя-партнера обязательны организация и должность
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Пароль должен содержать не менее 8 символов, включая 1 цифру, 1 строчную и 1 заглавную букву
 *                 example: "Password123"
 *               name:
 *                 type: string
 *                 minLength: 4
 *                 example: "Иван Иванов"
 *               role:
 *                 type: string
 *                 enum: [student, employer]
 *                 description: Роль пользователя
 *                 example: "student"
 *               group:
 *                 type: string
 *                 description: Академическая группа (Обязательно для роли "student")
 *                 example: "РИ-240000"
 *               employerType:
 *                 type: string
 *                 description: Тип работодателя partner/teacher (Обязательно для роли "employer")
 *                 example: "partner"
 *               organization:
 *                 type: string
 *                 description: Организация (Обязательно для employerType "partner")
 *                 example: "ООО Технологии"
 *               job:
 *                 type: string
 *                 description: Должность (Обязательно для employerType "partner")
 *                 example: "Менеджер по развитию"
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post(
  '/register', 
  [
    check('role', 'Некорректный тип аккаунта').isIn(roles),
    check('password', 'Пароль должен содержать не менее 8 символов, включая 1 цифру, 1 строчную и 1 заглавную букву')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('name', 'Минимальная длина имени 4 символа').isLength({ min: 4 }),

    //student
    check('group', 'Введите академическую группу').if(check('role').equals('student')).notEmpty(),

    //employer
    check('employerType', 'Некорректный тип работодателя').if(check('role').equals('employer')).isIn(employerTypes),

    //partner
    check('organization', 'Введите название организации')
      .if(check('role').equals('employer') && check('employerType').equals('partner'))
        .notEmpty(),
    check('job', 'Введите свою должность')
      .if(check('role').equals('employer') && check('employerType').equals('partner'))
        .notEmpty()
  ],
  async (req, res) => {

  try 
  {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при регистрации'
      })
    }

    const {email, password, name, role, group, employerType, organization, job} = req.body

    console.log(password)

    const candidate = await User.findOne({email})

    if (candidate) {
      return res.status(400).json({'message': 'Такой пользователь уже существует'})
    }


    let profile;

    if (role == "student") {
      profile = new Student({
        email:email,
        name:name,
        group:group})
    }
    else {
      profile = new Employer({
        email:email,
        name:name,
        employerType:employerType,
        organization:organization,
        job:job})
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({
      email:email,
      password:hashedPassword,
      role:role,
      profile: profile._id})

    profile.user = user._id

    await profile.save()
    await user.save()

    return res.status(201).json({message: 'Пользователь создан'})
  }
  catch (e) 
  {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Аутентификация пользователя
 *     description: Проверяет учетные данные пользователя и возвращает JWT токен при успешной аутентификации
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Успешная аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен для авторизации
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Ошибка валидации или неверные учетные данные
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post(
  '/login',
  [
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('password', 'Некорректный пароль').exists()
  ],
  async (req, res) => {
      
  try 
  {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при входе в систему'
      })
    }

    const {email, password} = req.body

    console.log(email)

    const user = await User.findOne({email})

    if (!user) {
      return res.status(400).json({message: 'Пользователь не найден'})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
    }

    const token = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.json({ token })
  }
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})

export default router;