import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import CreateUserService from './CreateUserService'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeCacheProvider: FakeCacheProvider
let createUser: CreateUserService

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeCacheProvider = new FakeCacheProvider()
        fakeHashProvider = new FakeHashProvider()

        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider)
    })

    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123457'
        })

        expect(user).toHaveProperty('id')
    })

    it('should not be able to create a new user with an email already registered', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123457'
        })

        await expect(
            createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123457'
        })).rejects.toBeInstanceOf(AppError)
    })
})
