import chatModel from '../Models/chatsModel.js'

// @descirption - create one and one chat  or return existing chat
//@route  api/chat POST
export const createChat = async (req, res) => {
  try {
    //id of the sender/reciever(not the current user)
    let { userId } = req.body

    if (!userId) {
      res.status(400).json({
        status: 'failure',
        message: 'UserId not available',
      })
      return
    }

    //check if chat already exists or not;
    let existingChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          {
            usersInChat: {
              $elemMatch: { $eq: userId },
            },
          },
          { usersInChat: { $elemMatch: { $eq: req.user.user_id } } },
        ],
      })
      .populate('usersInChat', '-password')
      .populate('lastestMessage')

    if (existingChat.length > 0) {
      res.status(200).json({
        status: 'Success',
        data: existingChat,
        message: 'Chat Exists',
      })
      return
    }
    let new_chat = await chatModel.create({
      chatName: 'Sender',
      isGroupChat: false,
      usersInChat: [userId, req.user.user_id],
    })

    let fullChat = await chatModel
      .findOne({ _id: new_chat._id })
      .populate('usersInChat', '-password')

    res.status(201).json({
      status: 'Success',
      data: [fullChat],
      message: 'New Chat Created',
    })
  } catch (error) {
    console.log(error)
  }
}

//@description - get all chats of a particular user
//@route api/chat  GET
export const getAllChats = async (req, res) => {
  try {
    let AllExistingChat = await chatModel
      .find({
        usersInChat: { $elemMatch: { $eq: req.user.user_id } },
      })

      .populate('usersInChat', '-password')
      .populate('lastestMessage')

    res.status(200).json({
      status: 'success',
      data: AllExistingChat,
      message: 'All Chats',
    })
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

//@description -create a group chat
//@route api/chat/group POST
export const createGroupChat = async (req, res) => {
  try {
    console.log(req.body.users)
    console.log(req.body.name)
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: 'Please Enter All Details' })
    }

    // console.log(req.user);
    let users = req.body.users.map((user) => {
      return user._id
    })
    users.push(req.user.user_id)
    console.log('here')
    const groupChat = await chatModel.create({
      chatName: req.body.name,
      usersInChat: users,
      isGroupChat: true,
      groupAdmin: req.user.user_id,
    })
    console.log('here1')

    // console.log(groupChat);
    const fullGroupChat = await chatModel
      .find({ _id: groupChat._id })
      .populate('usersInChat', '-password')
      .populate('groupAdmin', '-password')

    res.status(200).json({
      status: 'success',
      data: fullGroupChat,
      message: 'Group Ch Created Successfully',
    })
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

//@description -rename a group name
//@route api/chat/group/rename POST
export const renameGroup = async (req, res) => {
  try {
    const { chatId, name } = req.body

    const updatedChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          chatName: name,
        },
        {
          new: true,
        },
      )
      .populate('usersInChat', '-password')
      .populate('groupAdmin', '-password')

    if (updatedChat) {
      res.status(200).json({
        status: 'success',
        data: updatedChat,
        message: 'Chat Updated Successfully',
      })
    } else {
      res.status(404).json({ status: 'failure', message: "Chat Doesn't Exist" })
    }
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

// @description    Update users in Group
// @route   PUT /api/chat/group/update
export const UpdateGroup = async (req, res) => {
  try {
    const { chatId, users } = req.body
    let updatedUsers = users
    updatedUsers.push(req.user.user_id)
    const updatedGroup = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          usersInChat: updatedUsers,
        },
        {
          new: true,
        },
      )
      .populate('usersInChat', '-password')
      .populate('groupAdmin', '-password')

    if (updatedGroup) {
      res.status(200).json({
        status: 'success',
        data: updatedGroup,
        message: 'Chat Updated Successfully',
      })
    } else {
      res.status(404).json({ status: 'failure', message: "Chat Doesn't Exist" })
    }
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}


