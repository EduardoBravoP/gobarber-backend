import User from '../infra/typeorm/entities/User'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'

interface Request {
    user_id: string
}

@injectable()
class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ user_id }: Request): Promise<User> {
        const user = await this.usersRepository.findById(user_id)

        if(!user) {
            throw new AppError('User not found')
        }

        return user
    }
}

export default ShowProfileService
