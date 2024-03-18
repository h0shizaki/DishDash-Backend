import { Request } from 'express'
import Config from '../config'
import { User } from '../model/User'
import jwt from 'jsonwebtoken'
import { UserJwtPayload } from '../model/JwtPayload'

const SECRET = new Config().getJwtSecret()

export const generateUserToken = (user: User): string => {
    const token = jwt.sign(
        { _id: user._id, email: user.email, username: user.username },
        SECRET,
        {
            expiresIn: '7d',
        },
    )

    return token
}

export const decodeToken = (token: string): UserJwtPayload => {
    try{
        const result = jwt.verify(token, SECRET) as UserJwtPayload
        return result
    }catch(e){
        throw new Error("Invalid or expired JWT token")
    }
}

export function extractToken (req: Request) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {       
        return req.headers.authorization.split(' ')[1];
    } 
    
    return null;
}
/* v8 ignore start */
export function isTokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date()).getTime() / 1000)) >= expiry;
}
/* v8 ignore stop */

