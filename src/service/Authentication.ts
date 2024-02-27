import { User } from '../model/User'
import { IAuth } from './interface/IAuthentication'
import { UserM } from '../model/UserSchema'

export class AuthService implements IAuth {
    async findUserWithEmail(email: string): Promise<User | null> {
        const user = await UserM.findOne({ email })
        return user

    }
    async findUserWithUsername(username: string): Promise<User | null> {
        const user = await UserM.findOne({ username })
        return user  
    }
    async isDuplicate(user: User): Promise<boolean> {
        let userCheck
        userCheck = await this.findUserWithUsername(user.username)
        if (userCheck) return true
        userCheck = await this.findUserWithEmail(user.email)
        if (userCheck) return true
        return false

    }
    async save(user: User): Promise<User> {
    
        if (await this.isDuplicate(user)) throw Error('Duplicate User.')
        const newUser = new UserM(user)
        const res = await newUser.save()
        return res
    }
    async find(id: string): Promise<User | null> {

        const res = await UserM.findById(id)
        return res

    }

    async update(id: string, user: any): Promise<User | null> {
        const filter = { _id: id }
        const res = await UserM.findByIdAndUpdate(filter, user, {
            new: true,
            upsert: true,
        })
        return res
    }
}
