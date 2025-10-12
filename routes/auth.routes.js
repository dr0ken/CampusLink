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

// /api/auth/register
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