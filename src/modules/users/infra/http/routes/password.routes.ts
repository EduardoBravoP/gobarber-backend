import ResetPasswordService from '@modules/users/services/ResetPasswordService'
import { Router } from 'express'
import ForgotPasswordController from '../controllers/ForgotPasswordController'
import ResetPasswordController from '../controllers/ResetPasswordController'
import { celebrate, Joi, Segments } from 'celebrate'

const passwordRouter = Router()
const forgotPasswordController = new ForgotPasswordController()
const resetPasswordController = new ResetPasswordController()

passwordRouter.post('/forgot', celebrate({
    [Segments.BODY]: {
        email: Joi.string().email().required()
    }
}), forgotPasswordController.create)
passwordRouter.post('/reset', celebrate({
    [Segments.BODY]: {
        token: Joi.string().uuid().required(),
        password: Joi.string().required(),
        password_confirmation: Joi.string().required().valid(Joi.ref('password'))
    }
}), resetPasswordController.create)

export default passwordRouter
