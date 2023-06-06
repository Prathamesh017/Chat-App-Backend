import express from 'express'
import {
  createChat,
  getAllChats,
  createGroupChat,
  renameGroup,
  UpdateGroup,
} from '../Controller/chatController.js'
import verifyToken from '../Middleware/middleware.js'
const chatsRouter = express.Router()

chatsRouter
  .post('/', verifyToken, createChat)
  .get('/', verifyToken, getAllChats)
  .post('/group', verifyToken, createGroupChat)
  .put('/group/rename', verifyToken, renameGroup)
  .put('/group/update', verifyToken, UpdateGroup)

export default chatsRouter
