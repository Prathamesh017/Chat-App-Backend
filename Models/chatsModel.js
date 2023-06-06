import mongoose from 'mongoose'
const chatSchema = new mongoose.Schema({
  chatName:{
    type:String,
    trim:true
  },
  isGroupChat:{
    type:Boolean,
    default:false,
  },
  usersInChat:[{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User",
  }],
  lastestMessage:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Message"
  },
  groupAdmin:{
    type:mongoose.Schema.Types.ObjectId,
     ref:"User",
  },},
  {
    timestamps:true,
  },
)
const chatModel = mongoose.model('Chat', chatSchema)
export default chatModel
