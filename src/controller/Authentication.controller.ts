import { Router, Request, Response } from 'express'
import { IAuth } from '../service/interface/IAuthentication'
import { AuthService } from '../service/Authentication'
import { writeErrorJson, writeResponseJson } from '../utils/responseWriter'
import { User } from '../model/User'
import { check, encode } from '../utils/encrypt'
import { generateUserToken } from '../utils/jwt'

export class AuthController {
    private router: Router
    public authService: IAuth

    constructor() {
        this.router = Router()
        this.authService = new AuthService()
        this.router.post('/', async (req, res) => {
            return await this.login(req, res)
        })
        this.router.post('/user', async (req, res) => {
            return await this.register(req, res)
        })
        this.router.put('/user', async (req, res) => {
            return await this.update(req, res)
        })
    }

    public getRouter(): Router {
        return this.router
    }

    public async register(req: Request, res: Response) {
        const { username, email, password, gender, firstname, lastname } =
            req.body
        if (!username || !email || !password || !firstname || !lastname) {
            return writeErrorJson(res, 'Incomplete provided data', 400)
        }

        try {
            const hashedPassword = await encode(password)
            const user: User = {
                username,
                email,
                password: hashedPassword,
                gender,
                firstname,
                lastname,
            }
            const result = await this.authService.save(user)
            const token = generateUserToken(result)
            return writeResponseJson(res, 'success', { user: result, token })
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message)
                const message = e.message ? e.message : 'Something went wrong.'
                writeErrorJson(res, message, 500)
            }
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const id = req.body._id
            const user: User = req.body as User
            if (!user || !id) {
                return writeErrorJson(res, 'Incomplete provided data', 400)
            }

            const result = await this.authService.update(id, user)
            return writeResponseJson(res, 'success', { user: result })
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message)
                const message = e.message ? e.message : 'Something went wrong.'
                writeErrorJson(res, message, 500)
            }
        }
    }

    public async login(req: Request, res: Response) {
        const { username, email, password } = req.body

        if ((!username || !email) && !password) {
            return writeErrorJson(res, 'Incomplete provided data', 400)
        }

        try {
            let userCheck = undefined
            if (email) {
                userCheck = await this.authService.findUserWithEmail(email)
            } else {
                userCheck =
                    await this.authService.findUserWithUsername(username)
            }

            if (userCheck) {
                const isMatchedPassword = await check(
                    password,
                    userCheck.password,
                )
                if (isMatchedPassword) {
                    const token = generateUserToken(userCheck)
                    return writeResponseJson(res, 'success', {
                        user: userCheck,
                        token,
                    })
                } else {
                    return writeErrorJson(res, 'Invalid passowrd', 401)
                }
            } else {
                return writeErrorJson(res, 'Invalid Username or Email', 401)
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message)
                const message = e.message ? e.message : 'Something went wrong.'
                writeErrorJson(res, message, 500)
            }
        }
    }
}
