import {Router} from 'express'
import bcrypt from 'bcryptjs'
import config from 'config'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import bodyParser from 'body-parser'
import Student from '../models/Student.js'
import Employer from '../models/Employer.js'
const router = Router()

const roles = ['employer', 'student']

// /api/auth/register
router.post(
  '/register', 
  [
    check('role', 'Некорректный тип аккаунта').isIn(roles),
    check('password', 'Пароль должен содержать не менее 8 символов, включая 1 цифру, 1 строчную и 1 заглавную букву')
      .matches('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'),
    check('email', 'Некорректный email').isEmail(),
    check('name', 'Минимальная длина имени 4 символа').isLength({ min: 4 }),
    check('group', 'Введите академическую группу').if(check('role').equals('student')).notEmpty(),
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
    console.log(req.body)
    const errors = validationResult(req)

    console.log(errors)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при регистрации'
      })
    }

    const {email, password, name, role, group, employerType, organization, job} = req.body

    const candidate = await User.findOne({email})

    if (candidate) {
      return res.status(400).json({'message': 'Такой пользователь уже существует'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({email:email, password: hashedPassword, role: role})

    await user.save()

    if (role == "student") {
      const student = new Student({email:email, name:name, group:group})
      student.save()
    }
    else {
      const employer = new Employer({email:email, name:name, employerType:employerType, organization:organization, job:job})
      employer.save()
    }

    return res.status(201).json({message: 'Пользователь создан'})
  }
  catch (e) 
  {
    return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})

// /api/auth/login
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

    const user = await User.findOne({email})

    if (!user) {
      return res.status(400).json({message: 'Пользователь не найден'})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jvtSecret'),
      { expiresIn: '1h' }
    )
    res.json({ token, userId: user.id})
  }
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})

export default router;