import express from 'express'
import colors from 'colors'
import * as dotenv from 'dotenv'
import connectDB from './Config/db.js'
import cors from 'cors'
import cloudinary from 'cloudinary'
import userRouter from './Router/userRouter.js'
import chatsRouter from './Router/chatsRouter.js'
import messageRouter from './Router/messageRouter.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

cloudinary.v2.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
})

app.use(express.json())
app.use(cors())
await connectDB()

// app.get('/', (req, res) => {
// //   res.send('hello world')
// })
app.use('/api/user', userRouter)
app.use('/api/chat', chatsRouter)
app.use('/api/message', messageRouter)
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`.yellow)
})
