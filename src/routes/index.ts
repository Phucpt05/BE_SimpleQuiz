import { Router } from 'express'
import quizRoutes from './quiz.routes'
import questionRoutes from './question.routes'
import authRoutes from './auth.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/quizzes', quizRoutes)
router.use('/questions', questionRoutes)

export default router
