import {Router} from 'express'
import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import Vacancy from '../models/Vacancy.js'
import auth from '../middleware/auth.js'

const router = Router()


// /api/vacancy/getAll
router.get(
  '/getAll',
  [ auth ],
  async (req, res) => {

  try 
  {
    const vacancies = await Vacancy.find().populate({
      path: 'creator',
      select: '-password',
      populate: {
        path: 'profile',
      }
    })

    res.json(vacancies)
  }
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})


// /api/vacancy/create
router.post(
  '/create',
  [
    auth,
    [
      check('name', 'Название должно быть минимум 4 символа').isLength({min: 4}),
      check('description', 'Описание должно быть минимум 50 символов').isLength({min: 50}),
      check('studentCount', 'Количество студентов - натуральное число').isInt({gt: 0})
    ],
  ],
  async (req, res) => {
      
  try 
  {
    const user = await User.findById(req.user.id).populate('profile')

    if (user.role == 'student') {
      return res.status(403).json({
        message: 'Студент не может создавать вакансии'
      })
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при создании вакансии'
      })
    }

    const {name, description, studentCount} = req.body

    const vacancy = new Vacancy({
      name: name,
      description: description,
      studentCount: studentCount,
      creator: user.id,
      pendingSubmissions: [],
      confirmedSubmissions: []
    })

    await vacancy.save()

    return res.status(201).json({message: 'Вакансия создана'})
  }
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})

// /api/vacancy/delete
router.delete(
  '/delete',
  [
    auth,
  ],
  async (req, res) => 
  {
  
  try {
    const {id} = req.body;

    const vacancy = await Vacancy.findById(id)

    if (!vacancy) {
      return res.status(404).json({message: "Вакансия не найдена"})
    }

    if (vacancy.creator != req.user.id) {
      return res.status(403).json({message: "У вас нет прав для удаления этой вакансии"})
    }
    
    await Vacancy.findByIdAndDelete(id)

    res.status(204)
  }
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})

export default router;