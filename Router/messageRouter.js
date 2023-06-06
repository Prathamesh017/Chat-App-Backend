import express from 'express'
import {
  createMessage,
  getAllMessages,
} from '../Controller/messageController.js'
import verifyToken from '../Middleware/middleware.js'
const messageRouter = express.Router()

messageRouter.route('/').get(verifyToken, getAllMessages)
messageRouter.route('/').post(verifyToken, createMessage)
export default messageRouter
