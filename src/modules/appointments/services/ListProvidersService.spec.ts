import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import ListProvidersService from './ListProvidersService'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeUsersRepository: FakeUsersRepository
let fakeCacheProvider: FakeCacheProvider
let listProviders: ListProvidersService

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeCacheProvider = new FakeCacheProvider()

        listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider)
    })

    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'JohnDoe@example.com',
            password: '123457'
        })

        const user2 = await fakeUsersRepository.create({
            name: 'John Tre',
            email: 'JohnTre@example.com',
            password: '123457'
        })

        const loggedUser = await fakeUsersRepository.create({
            name: 'John Qua',
            email: 'JohnQua@example.com',
            password: '123457'
        })

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        })

        expect(providers).toEqual([
            user1,
            user2
        ])
    })
})
