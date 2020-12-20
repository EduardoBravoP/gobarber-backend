import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderApppointmentsService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class ProviderAppointmentsController{
    public async index(request: Request, response: Response): Promise<Response> {
        const provider_id = request.user.id
        const { day, month, year } = request.query

        const listProviderAppointments = container.resolve(ListProviderAppointmentsService)

        const appointments = await listProviderAppointments.execute({
            day: Number(day),
            year: Number(year),
            month: Number(month),
            provider_id })

        return response.json(classToClass(appointments))
    }
}
