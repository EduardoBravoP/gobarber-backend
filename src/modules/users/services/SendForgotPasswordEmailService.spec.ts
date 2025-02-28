import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokensRepository: FakeUserTokensRepository
let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeMailProvider = new FakeMailProvider
        fakeUserTokensRepository = new FakeUserTokensRepository()

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository)
    })

    it('should be able to recover the password using email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123457'
        })

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        })

        expect(sendMail).toHaveBeenCalled()
    })

    it('should be able to recover a non-existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'johndoe@example.com',
            })
        ).rejects.toBeInstanceOf(AppError)
    })

    it('should be able to generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123457'
        })

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        })

        expect(generateToken).toHaveBeenCalledWith(user.id)
    })
})
