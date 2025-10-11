import {Router} from 'express'

import auth from '../middleware/auth.js'

import User from '../models/User.js'
import Student from '../models/Student.js'
import Employer from '../models/Employer.js'

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

export default router;