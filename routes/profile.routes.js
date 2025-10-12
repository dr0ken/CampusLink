import {Router} from 'express'
import auth from '../middleware/auth.js'
import User from '../models/User.js'
import { check, validationResult } from 'express-validator'

const router = Router()

// /api/profile/me
router.get(
  '/me',
  auth,
  async (req, res) => {
    try 
    {
      const user = await User.findById(req.user.id).populate('profile').select('-password')

      res.json(user);
    }
    catch (e) 
    {
      return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

// /api/profile/edit
router.put(
  '/edit',
  [
    auth,
    [
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('name', 'Минимальная длина имени 4 символа').isLength({ min: 4 })
    ]
  ],
  async (req, res) => {
   
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при изменении профиля'
      })
    }

    try {
    
      const {email, name, group, organization, job} = req.body

      const candidate =  await User.findOne({email})
      const user = await User.findById(req.user.id).populate('profile').select('-password')

      if (candidate && user.id != candidate.id) {
        return res.status(400).json({'message': 'Почта уже привязана к другому пользователю'})
      }

      user.profile.name = name;
      if (user.role == "employer" && user.profile.employerType == "partner") 
      {
        user.profile.organization = organization
        user.profile.job = job
      } 
      else if (user.role == "student") 
      {
        user.profile.group = group
      }
      await user.profile.save()

      user.email = email
      await user.save()

      res.json(user)
    }
    catch (e) 
    {
      return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

export default router;