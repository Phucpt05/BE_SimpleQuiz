import { Router } from 'express'
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizWithCapitalQuestions,
} from '../controllers/quiz.controller'

import { createQuestionInQuiz, createManyQuestionsInQuiz } from '../controllers/question.controller'
import { protect, isAdmin } from '../middleware/auth.middleware'

const router = Router()

router.use(protect)

router.get('/', getAllQuizzes)
router.get('/:quizId', getQuizById)
router.get('/:quizId/populate', getQuizWithCapitalQuestions)

router.post('/', isAdmin, createQuiz)
router.put('/:quizId', isAdmin, updateQuiz)
router.delete('/:quizId', isAdmin, deleteQuiz)
router.post('/:quizId/question', isAdmin, createQuestionInQuiz)
router.post('/:quizId/questions', isAdmin, createManyQuestionsInQuiz)

export default router
