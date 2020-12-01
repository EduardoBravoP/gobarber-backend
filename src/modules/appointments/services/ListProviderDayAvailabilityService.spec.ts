import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import AppError from '@shared/errors/AppError'
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService
let fakeAppointmentsRepository: FakeAppointmentsRepository

describe('ListProviderDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentsRepository)
    })

    it('should be able to list the day availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            date: new Date(2020, 11, 20, 14, 0, 0),
            user_id: '123123',

        })

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            date: new Date(2020, 11, 20, 15, 0, 0),
            user_id: '123123',
        })

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 11, 20, 11).getTime()
        })

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id: 'provider',
            year: 2020,
            month: 12,
            day: 20
        })

        expect(availability).toEqual(expect.arrayContaining([
            { hour: 8, available: false },
            { hour: 9, available: false },
            { hour: 10, available: false },
            { hour: 13, available: true },
            { hour: 14, available: false },
            { hour: 15, available: false },
            { hour: 16, available: true },
        ]))
    })
})
