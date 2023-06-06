import UserService from '../Service/userService.js'
import userModel from '../Models/userModel.js'
const userService = new UserService()


// @description -register a user for first tim
//@route -  api/user/register POST
export const registerUser = async (req, res) => {
  let { name, email, password, image } = req.body

  try {
    if (!(name && email && password)) {
      res.status(400).json({
        status: 'failure',
        message: 'Please Enter All Details',
      })
    }

    let existingUser = await userModel.find({ email: email })

    if (existingUser.length > 0) {
      res.status(404).json({
        status: 'failure',
        message: 'User Already Exists',
      })
    }
    let hashedPassword = await userService.hashPassword(password)
    let user = await userService.createUser(name, email, hashedPassword, image)
    if (user) {
      let token = await userService.generateToken(user._id, user.email)
      res.status(201).json({
        status: 'success',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          image: user.image,
          token,
        },
        message: 'User Register Successfully',
      })
    } else {
      if (user) {
        res.status(400).json({
          status: 'Failure',
          message: 'Failed To Create User',
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// @description -login a user
//@route -  api/user/login POST
export const loginUser = async (req, res) => {
  let { email, password } = req.body

  try {
    if (!(email && password)) {
      res.status(400).json({
        status: 'failure',
        message: 'Please Enter All Details',
      })
    }

    let user = await userService.login(email, password, res)
    if (user) {
      res.status(201).json({
        status: 'success',
        data: user,
        message: 'User Login Successfully',
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// @description -search for other user in search bar
//@route -  api/user GET
export const getUser = async (req, res) => {
  let searchKey = req.query.searchText
    ? {
        $or: [
          {
            email: { $regex: req.query.searchText, $options: 'i' },
            _id: { $ne: `${req.user.user_id}` },
          },
          {
            name: { $regex: req.query.searchText, $options: 'i' },
            _id: { $ne: `${req.user.user_id}` },
          },
        ],
      }
    : {}
  let users = await userModel.find(searchKey)

  res.status(200).json({
    status: 'success',
    data: users,
    message: 'All Users',
  })
}
