import { Response, Request, NextFunction } from 'express'

class Cor {
    public enableCORS(req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type,Authorization',
        )
        next()
    }
}

export default new Cor()
