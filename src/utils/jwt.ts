import Config from '../config'
import { User } from '../model/User'
import jwt, { JwtPayload } from 'jsonwebtoken'

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

export const decoedToken = (token: string): string | JwtPayload => {
    const result = jwt.verify(token, SECRET)
    return result
}
