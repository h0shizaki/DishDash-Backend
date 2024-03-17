/* v8 ignore start */
import { Response, Request, NextFunction } from 'express'
import { extractToken, isTokenExpired } from '../utils/jwt'

class Security {
    public secureRoute(req: Request, res: Response, next: NextFunction) {
        try {
            const token = extractToken(req)
            if (token === null) {
                // return writeErrorJson(res, 'Forbidden' , 403)
                return res.status(403).json({ message: 'Forbidden' })
            }

            if (isTokenExpired(token)) {
                // return writeErrorJson(res, 'Token expired' , 403)
                return res.status(403).json({ message: 'Token expired' })
            }
        } catch (e) {
            console.error(e)
        }
        next()
    }
}

export default new Security()
/* v8 ignore stop */
