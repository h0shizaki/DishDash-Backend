import express, { Application, NextFunction, Request, Response } from 'express'
import cor from './middleware/cor'
import { AuthController } from './controller/Authentication.controller'
import { BookmarkController } from './controller/Bookmark.controller'

class App {
    public express: Application
    public authController: AuthController
    public bookmarkController: BookmarkController
    constructor() {
        this.express = express()
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(cor.enableCORS) 
        this.express.use(express.json())
        this.express.enable('trust proxy')
        this.authController = new AuthController()
        this.bookmarkController = new BookmarkController()
        this.loadRoutes()
    }

    private loadRoutes() {
        const router = express.Router()
        router.get('/', (req: Request, res: Response) => {
            return res.send(`${process.env.NODE_ENV}`)
        })

        router.use('/api/auth', this.authController.getRouter())
        router.use('/api/bookmark',  this.bookmarkController.getRouter())
        
        router.use('*', (req: Request, res: Response) => {
            return res.status(404).send('404 not found')
        })

        this.express.use(router)
    }
}

export default App
