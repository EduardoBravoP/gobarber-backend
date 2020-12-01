import ShowProfileService from '@modules/users/services/ShowProfileService'
import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id

        const showProfile = container.resolve(ShowProfileService)
        const user = await showProfile.execute({ user_id })

        delete user.password

        return response.json(user)
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id

        const { name, email, old_password, password } = request.body

        const updateProfile = container.resolve(UpdateProfileService)

        const user = await updateProfile.execute({
            name,
            email,
            password,
            old_password,
            user_id
        })

        delete user.password

        return response.json(user)
    }
}
