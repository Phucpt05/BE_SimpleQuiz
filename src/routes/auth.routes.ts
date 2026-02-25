import { Router } from 'express'
import { signup, login, promoteAdmin } from '../controllers/auth.controller'
import { protect, isAdmin } from '../middleware/auth.middleware'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/promote-admin/:userId', protect, isAdmin, promoteAdmin)

export default router
