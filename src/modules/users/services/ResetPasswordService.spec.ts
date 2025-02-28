import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let resetPasswordService: ResetPasswordService
let fakeHashProvider: FakeHashProvider

describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeUserTokensRepository = new FakeUserTokensRepository()
        fakeHashProvider = new FakeHashProvider()

        resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider)
    })

    it('should not be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123457'
        })

        const { token } = await fakeUserTokensRepository.generate(user.id)

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

        await resetPasswordService.execute({
            password: '123123',
            token
        })

        const updatedUser = await fakeUsersRepository.findById(user.id)

        expect(generateHash).toHaveBeenCalledWith('123123')
        expect(updatedUser?.password).toBe('123123')
    })

    it('should not be able to reset the password with a non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
            token: 'non-existing',
            password: '123123123'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset the password with a non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate('non-existing-user')

        await expect(
            resetPasswordService.execute({
            token,
            password: '123123123'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123457'
        })

        const { token } = await fakeUserTokensRepository.generate(user.id)

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date()

            return customDate.setHours(customDate.getHours() + 3)
        })

        await expect(
            resetPasswordService.execute({
            password: '123123',
            token
        })).rejects.toBeInstanceOf(AppError)
    })
})
