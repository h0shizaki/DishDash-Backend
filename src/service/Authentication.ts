
import { User } from "../model/User";
import { IAuth } from "./interface/IAuthentication"
import { UserM } from "../model/UserSchema";

export class AuthService implements IAuth {
    async findUserWithEmail(email: string): Promise<User|null> {
        try {
            const user = await UserM.findOne({ email })
            return user;
        } catch (err) {
            throw err;
        }
    }
    async findUserWithUsername(username: string): Promise<User|null> {
        try {
            const user = await UserM.findOne({ username })
            return user;
        } catch (err) {
            throw err;
        }
    }
    async isDuplicate(user: User): Promise<boolean> {
        let userCheck;
        try {
            userCheck = await this.findUserWithUsername(user.username);
            if (userCheck) return true;
            userCheck = await this.findUserWithEmail(user.email);
            if (userCheck) return true;
    
            return false;
        } catch (err) {
            throw err;
        }
    }
    async save(user: User): Promise<User> {
        try{
            if(await this.isDuplicate(user)) throw Error("Duplicate User.")
            const newUser = new UserM(user)
            const res = await newUser.save()
            return res;
        }catch(err){
            throw err
        }
    }
    async find(id: string): Promise<User|null> {
        try {
            const res = await UserM.findById(id)
            return res;
        } catch (err) {
            throw err;
        }
    }

    async update(id: string, user: any): Promise<User | null> {
        try {
            const filter = {_id: id }
            const res = await UserM.findByIdAndUpdate(
                filter,
                user,
                { 
                    new: true, 
                    upsert: true, 
                }
            )
            return res;
        } catch (err) {
            throw err;
        }
    }

}