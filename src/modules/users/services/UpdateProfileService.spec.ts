import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider()

        updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider)
    })

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'JohnDoe@example.com',
            password: '123457'
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com'
        })

        expect(updatedUser.name).toBe('John Tre')

        expect(updatedUser.email).toBe('johntre@example.com')
    })

    it('should not be able to update the profile from non-existing user', async () => {
        expect(updateProfile.execute({
            user_id: 'non-existing-user-id',
            name: 'John Doe',
            email: 'johndoe@example.com'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to change the email to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'JohnDoe@example.com',
            password: '123457'
        })

        const user = await fakeUsersRepository.create({
            name: 'John Doe2',
            email: 'JohnDoe2@example.com',
            password: '123457'
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'JohnDoe@example.com'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'JohnDoe@example.com',
            password: '123457'
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            password: '123123',
            old_password: '123457'
        })

        expect(updatedUser.password).toBe('123123')
    })

    it('should not be able to change the email to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'JohnDoe@example.com',
            password: '123457'
        })

        const user = await fakeUsersRepository.create({
            name: 'John Doe2',
            email: 'JohnDoe2@example.com',
            password: '123457'
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'JohnDoe@example.com'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to update the password without the old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'JohnDoe@example.com',
            password: '123457'
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to update the password with a wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'JohnDoe@example.com',
            password: '123457'
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Tre',
            email: 'johntre@example.com',
            password: '123123',
            old_password: 'wrong-old-password'
        })).rejects.toBeInstanceOf(AppError)
    })
})
