import express from 'express'
import {
  loginUser,
  registerUser,
  getUser,
} from '../Controller/userController.js'
import verifyToken from '../Middleware/middleware.js'
const userRouter = express.Router()

userRouter
  .get('/', verifyToken, getUser)
  .post('/login', loginUser)
  .post('/register', registerUser)
export default userRouter
