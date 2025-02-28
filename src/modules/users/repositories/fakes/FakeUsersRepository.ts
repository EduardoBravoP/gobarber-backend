import User from '../../infra/typeorm/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUsertDTO from '@modules/users/dtos/ICreateUserDTO'
import { uuid } from 'uuidv4'
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO'

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = []

    public async findById(id: string): Promise<User | undefined> {
        const user = this.users.find(user => user.id === id)

        return user
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = this.users.find(user => user.email === email)

        return user
    }

    public async create(userData: ICreateUsertDTO): Promise<User> {
        const user = new User()

        Object.assign(user, { id: uuid() }, userData)

        this.users.push(user)

        return user
    }

    public async save(user: User): Promise<User> {
        const userIndex = this.users.findIndex(findUser => findUser.id === user.id)

        this.users[userIndex] = user

        return user;
    }

    public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]>{
        let { users } = this

        if(except_user_id) {
            users = this.users.filter(user => user.id !== except_user_id)
        }

        return users
    }
}

export default FakeUsersRepository
