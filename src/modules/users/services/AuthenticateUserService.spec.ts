import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let authenticateuser: AuthenticateUserService

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider()
        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
        authenticateuser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)
    })

    it('should be able to authenticate', async () => {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123457'
        })

        const response = await authenticateuser.execute({
            email: 'johndoe@example.com',
            password: '123457'
        })

        expect(response).toHaveProperty('token')
        expect(response.user).toEqual(user)
    })

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateuser.execute({
                email: 'johndoe@example.com',
                password: '123457'
            })
        ).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to authenticate with a wrong password', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123457'
        })

        await expect(
            authenticateuser.execute({
                email: 'johndoe@example.com',
                password: 'wrongPassword'
            })
        ).rejects.toBeInstanceOf(AppError)
    })
})
