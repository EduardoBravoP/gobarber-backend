import AppError from '@shared/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'

import CreateAppointmentService from './CreateAppointmentService'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeCacheProvider: FakeCacheProvider
let createAppointment: CreateAppointmentService
let fakeNotificationsRepository: FakeNotificationsRepository

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        fakeCacheProvider = new FakeCacheProvider()
        fakeNotificationsRepository= new FakeNotificationsRepository()

        createAppointment = new CreateAppointmentService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider)
    })

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime()
        })

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: '123123',
            user_id: '1231234'
        })

        expect(appointment).toHaveProperty('id')
        expect(appointment.provider_id).toBe('123123')
    })

    it('should not be able to create two appointments on the same date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 11).getTime()
        })

        const appointmentDate = new Date(2020, 4, 10, 11)

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123123',
            user_id: '1231234'
        })

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '123123',
                user_id: '1231234'
            })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime()
        })

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                provider_id: '123123',
                user_id: '1231234'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime()
        })

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                provider_id: '123123',
                user_id: '123123'
        })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to create an appointment outside the range of 8am and 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime()
        })

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 7),
                provider_id: '123123',
                user_id: '1231234'
        })).rejects.toBeInstanceOf(AppError)

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 18),
                provider_id: '123123',
                user_id: '1231234'
        })).rejects.toBeInstanceOf(AppError)
    })
})
