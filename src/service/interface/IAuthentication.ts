import { User } from '../../model/User'
export interface IAuth {
    findUserWithEmail(email: string): Promise<User | null>
    findUserWithUsername(usernmae: string): Promise<User | null>
    isDuplicate(user: User): Promise<boolean>
    save(user: User): Promise<User>
    find(id: string): Promise<User | null>
    update(id: string, user: any): Promise<User | null>
}
