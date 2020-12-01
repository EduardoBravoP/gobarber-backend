import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@config/upload'
import { container } from 'tsyringe'

import UsersController from '../controllers/UsersController'

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import UserAvatarController from '../controllers/UserAvatarController'
import { celebrate, Joi, Segments } from 'celebrate'

const usersRouter = Router()
const upload = multer(uploadConfig)
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

usersRouter.post('/', celebrate({
    [Segments.BODY]: {
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        password: Joi.string().required(),
    }
}), usersController.create)

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.update)

export default usersRouter
