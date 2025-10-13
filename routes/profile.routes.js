import {Router} from 'express'
import auth from '../middleware/auth.js'
import User from '../models/User.js'
import { check, validationResult } from 'express-validator'

const router = Router()

/**
 * @swagger
 * tags:
 *  name: Profile
 *  description: API для получения/изменения профиля пользователя
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    AuthToken:
 *      type: apiKey
 *      in: header
 *      name: x-auth-token 
 *      description: 'Для авторизации необходимо передать JWT-токен в заголовке x-auth-token.'
 */

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Получение данных текущего пользователя
 *     description: Возвращает полную информацию о текущем аутентифицированном пользователе (без пароля)
 *     security:
 *       - AuthToken: []
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Данные пользователя успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
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

/**
 * @swagger
 * /profile/edit:
 *   put:
 *     summary: Обновление профиля пользователя
 *     description: |
 *       Обновляет основные данные профиля пользователя.
 *       Валидация и доступные поля зависят от роли пользователя:
 *       - Для студента можно обновить группу
 *       - Для работодателя-партнера можно обновить организацию и должность
 *     tags:
 *       - Profile
 *     security:
 *       - AuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *               name:
 *                 type: string
 *                 minLength: 4
 *                 example: Иванов Илья
 *               group:
 *                 type: string
 *                 description: Доступно только для роли "student"
 *                 example: РИ-240000
 *               organization:
 *                 type: string
 *                 description: Доступно только для employerType "partner"
 *                 example: ООО Технологии
 *               job:
 *                 type: string
 *                 description: Доступно только для employerType "partner"
 *                 example: Менеджер по развитию
 *     responses:
 *       200:
 *         description: Профиль успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Некорректные данные
 *       500:
 *         description: Внутренняя ошибка сервера
 */
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