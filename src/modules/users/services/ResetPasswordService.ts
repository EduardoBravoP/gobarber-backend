import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import User from '../infra/typeorm/entities/User'

import IUsersRepository from '../repositories/IUsersRepository'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import { check } from 'prettier'
import IUserTokensRepository from '../repositories/IUserTokensRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import { addHours, isAfter } from 'date-fns'

interface Request {
    password: string
    token: string
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({ token, password } : Request): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token)

        if(!userToken) {
            throw new AppError('User token does not exsts')
        }

        const user = await this.usersRepository.findById(userToken.user_id)

        if(!user) {
            throw new AppError('User does not exsts')
        }

        const tokenCreatedAt = userToken.created_at
        const compareDate = addHours(tokenCreatedAt, 2)

        if(isAfter(Date.now(), compareDate)) {
            throw new AppError('The Token has been expired')
        }

        user.password = await this.hashProvider.generateHash(password)

        await this.usersRepository.save(user)
    }
}

export default ResetPasswordService
