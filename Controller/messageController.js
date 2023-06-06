import messageModel from '../Models/messageMode.js'
import chatModel from '../Models/chatsModel.js'
//@description     Create Messages
//@route           Post /api/message
export const createMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body
   
    if (!message || !chatId) {
      return res
        .sendStatus(400)
        .json({ success: 'error', message: 'Please Send Full Details' })
    }

    let new_message = await messageModel.create({
      sender: req.user.user_id,
      message: message,
      chatReference: chatId,
    })

    await chatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: new_message,
    })
    const full_message = await messageModel
      .find(new_message._id)
      .populate('chatReference')
      .populate('sender')
    return res.status(200).json({
      status: 'Success',
      data: full_message,
      message: 'Message Created',
    })
  } catch (error) {
    
    throw new Error(error)
  }
}
//@description     Get all Messages
//@route           GET /api/message/:chatId
export const getAllMessages = async (req, res) => {

  try {
    const messages = await messageModel
      .find({ chatReference: req.query.chatId })
      .populate('sender', '-password')
      .populate('chatReference')

    res.status(200).json({
      status: 'success',
      data: messages,
      message: 'All Message for the Chat Id',
    })
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}
