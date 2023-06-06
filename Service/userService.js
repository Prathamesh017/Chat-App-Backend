import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../Models/userModel.js'
class UserService {
  constructor() {}

  // @description - to hash and secure password
  hashPassword = async (password) => {
    try {
      let saltRounds = 10
      let hash = await bcrypt.genSalt(saltRounds)
      let hashedPassword = await bcrypt.hash(password, hash)
      return hashedPassword
    } catch (e) {
      console.log(e)
    }
  }

  // @description - to decrypt and match password
  validatePassword = async (password, hash) => {
    try {
      let isPasswordCorrect = await bcrypt.compare(password, hash)

      return isPasswordCorrect ? true : false
    } catch (error) {
      console.log(error)
    }
  }

  // @description - to generate token for authorization
  generateToken = async (user, email) => {
    const token = await jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      },
    )

    return token
  }

  // @description - to login a user
  login = async (email, password, res) => {
    let user = await userModel.find({ email: email })
    if (user.length === 0) {
      res.status(404).json({
        status: 'failure',
        message: 'User Not Found',
      })
    }

    let checkPassword = await this.validatePassword(password, user[0].password)
    if (checkPassword) {
      let token = await this.generateToken(user[0], user[0].email)
      let userObj = {
        id: user[0]._id,
        name: user[0].name,
        email: user[0].email,
        password: user[0].password,
        image: user[0].image,
        token,
      }
      return userObj
    } else {
      res.status(400).json({
        status: 'failure',
        message: 'Incorrect Password',
      })
    }
  }

  // @description - to create/register a user
  createUser = async (name, email, password, image) => {
    let user = await userModel.create({
      name,
      email,
      password,
      image,
    })

    return user
  }
}

export default UserService
