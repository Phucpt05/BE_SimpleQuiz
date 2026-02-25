import { Router } from 'express'
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/question.controller'
import { protect, isAdmin } from '../middleware/auth.middleware'

const router = Router()

router.use(protect)

router.get('/', getAllQuestions)
router.get('/:questionId', getQuestionById)

router.post('/', isAdmin, createQuestion)
router.put('/:questionId', isAdmin, updateQuestion)
router.delete('/:questionId', isAdmin, deleteQuestion)

export default router
