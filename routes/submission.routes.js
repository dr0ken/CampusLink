import {Router} from 'express'
import { check, validationResult } from 'express-validator'
import User from '../models/User.js'
import Vacancy from '../models/Vacancy.js'
import auth from '../middleware/auth.js'
import Submission from '../models/Submission.js'

const router = Router()

// /api/submission/send
router.post(
  '/send',
  [
    auth,
    [
      check('message', 'Сообщение должно быть минимум 20 символов').isLength({min: 20})
    ],
  ],
  async (req, res) => {
      
  try 
  {
    const user = await User.findById(req.user.id).populate('profile')

    if (user.role != 'student') {
      return res.status(403).json({
        message: 'Работодатель не может откликаться на вакансии'
      })
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при создании вакансии'
      })
    }

    const {vacancyId, message} = req.body

    const vacancy = await Vacancy.findById(vacancyId)

    if (!vacancy) {
      return res.status(404).json({message: "Вакансия не найдена"})
    }

    const submission = new Submission({
      student: user.id,
      message: message,
      vacancy: vacancy.id
    })

    await submission.save();

    vacancy.pendingSubmissions.push(submission.id)

    vacancy.save();

    return res.status(201).json({message: 'Ответ создан'})
  }
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})

// /api/submission/delete
router.delete(
  '/delete',
  [
    auth,
  ],
  async (req, res) => 
  {
  
  try {
    const {id} = req.body;

    const submission = await Submission.findById(id).populate('vacancy')

    if (!submission) {
      return res.status(404).json({message: "Ответ не найден"})
    }

    if (submission.student != req.user.id && submission.vacancy.creator != req.user.id) {
      return res.status(403).json({message: "У вас нет прав для удаления этого ответа"})
    }
    
    await Submission.findByIdAndDelete(id)

    res.status(204)
  }
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})

// /api/submission/respond
router.put(
  '/respond',
  [
    auth,
    [
      check('isAccepted', 'Поле должно иметь значение true или false').isBoolean()
    ]
  ],
  async (req, res) => 
  {
  
  try {
    const {id, response, isAccepted} = req.body;

    const submission = await Submission.findById(id).populate('vacancy')

    if (!submission) {
      return res.status(404).json({message: "Ответ не найден"})
    }

    if (submission.vacancy.creator != req.user.id) {
      return res.status(403).json({message: "У вас нет прав для изменения этого ответа"})
    }
    
    submission.isConfirmed = isAccepted
    submission.employerResponse = response

    if (submission.isConfirmed) {
      submission.vacancy.confirmedSubmissions.push(submission)
      const index = submission.vacancy.pendingSubmissions.indexOf(submission);
      if (index > -1) { 
        submission.vacancy.pendingSubmissions.splice(index, 1);
      }
      await submission.vacancy.save()
    }
    await submission.save()
    
    res.json(submission)
  }
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
  }
})


export default router;