import { Router } from 'express'

import ProfileController from '../controllers/ProfileController'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'

const profileRouter = Router()
const profileController = new ProfileController()

profileRouter.use(ensureAuthenticated)

profileRouter.put('/', celebrate({
    [Segments.BODY]: {
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        old_password: Joi.string(),
        password: Joi.string(),
        password_confirmation: Joi.string().valid(Joi.ref('password'))
    }
}), profileController.update)

profileRouter.get('/', profileController.show)

export default profileRouter
