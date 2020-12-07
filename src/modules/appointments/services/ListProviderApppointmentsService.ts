import cache from '@config/cache'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import { injectable, inject } from 'tsyringe'
import Appointment from '../infra/typeorm/entities/Appointment'

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface Request {
    provider_id: string
    month: number
    year: number
    day: number
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({ provider_id, year, month, day }: Request): Promise<Appointment[]> {
        const cacheData = await this.cacheProvider.recover('123')

        console.log(cacheData)

        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            year,
            month,
            day
        })

        // await this.cacheProvider.save('123', '123')

        return appointments
    }
}

export default ListProviderAppointmentsService
