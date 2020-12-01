import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import ShowProfileService from './ShowProfileService'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let showProfile: ShowProfileService

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()

        showProfile = new ShowProfileService(fakeUsersRepository)
    })

    it('should be able to show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'JohnDoe@example.com',
            password: '123457'
        })

        const profile = await showProfile.execute({
            user_id: user.id,
        })

        expect(profile.name).toBe('John Doe')

        expect(profile.email).toBe('JohnDoe@example.com')
    })

    it('should not be able to show the profile from non-existing user', async () => {
        expect(showProfile.execute({
            user_id: 'non-existing-user-id',
        })).rejects.toBeInstanceOf(AppError)
    })
})
