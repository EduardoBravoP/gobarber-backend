import User from '../infra/typeorm/entities/User'
import path from 'path'
import fs from 'fs'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'

import uploadConfig from '@config/upload'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

interface Request {
    user_id: string,
    avatarFilename: string
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider
    ) {}

    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
        const user = await this.usersRepository.findById(user_id)

        if(!user) {
            throw new AppError('Only authenticated users can change avatar.', 401)
        }

        if(user.avatar) {
            // Deletar avatar anterior
            await this.storageProvider.deleteFile(user.avatar)
        }

        const filename = await this.storageProvider.saveFile(avatarFilename)

        user.avatar = filename

        await this.usersRepository.save(user)

        return user
    }
}

export default UpdateUserAvatarService
