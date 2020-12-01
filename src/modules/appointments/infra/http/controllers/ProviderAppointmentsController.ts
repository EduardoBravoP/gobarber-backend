import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderApppointmentsService'
import { parseISO } from 'date-fns'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class ProviderAppointmentsController{
    public async index(request: Request, response: Response): Promise<Response> {
        const provider_id = request.user.id
        const { day, month, year } = request.body

        const listProviderAppointments = container.resolve(ListProviderAppointmentsService)

        const appointments = await listProviderAppointments.execute({ day, month, year, provider_id })

        return response.json(appointments)
    }
}
