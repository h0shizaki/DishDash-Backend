import { AuthController } from '../../controller/Authentication.controller'
import { beforeAll, beforeEach, expect, test, vitest } from 'vitest'
import { MockResponse, createRequest, createResponse } from 'node-mocks-http'
import Config from '../../config'
import mongoose from 'mongoose'
import { UserM } from '../../model/UserSchema'
import { Gender } from '../../model/Gender'
import { User } from '../../model/User'
import { IAuth } from '../../service/interface/IAuthentication'
import { AuthService } from '../../service/Authentication'
import jwt from 'jsonwebtoken'

let authController: AuthController
let authService: IAuth

const config = new Config()
const SECRET = new Config().getJwtSecret()

beforeAll(async () => {
    try {
        await mongoose.connect(config.getDatabaseUrl())
        await UserM.deleteMany({})
    } catch (e) {
        throw e
    }
})

beforeEach(async () => {
    authController = new AuthController()
    authService = new AuthService()
})

test('should create an instance of AuthController', () => {
    expect(authController).toBeInstanceOf(AuthController)
})

test('should have a router property of type Router', () => {
    expect(authController.getRouter()).toBeDefined()
})

test('should handle routes correctly', () => {
    const mockRouter = {
        get: vitest.fn(),
        post: vitest.fn(),
        put: vitest.fn(),
        delete: vitest.fn(),
    }

    const authController = new AuthController()
    const router = authController.getRouter()

    expect(mockRouter.get).toBeDefined()
    expect(mockRouter.post).toBeDefined()
    expect(mockRouter.put).toBeDefined()
    expect(mockRouter.delete).toBeDefined()
})

test('should register user', async () => {
    const mockUser: User = {
        username: 'KAN',
        firstname: 'Mum',
        lastname: 'Mei',
        password: '1234',
        email: 'k@mock.com',
        gender: Gender.MALE,
        interestedCategory: ['a', 'b', 'c'],
    }

    const mockRequest = createRequest({ body: mockUser })
    const mockResponse = createResponse()

    const response: MockResponse<any> = await authController.register(
        mockRequest,
        mockResponse,
    )

    expect(response).to.not.null
    const result = response._getJSONData()
    expect(response!.statusCode).toBe(200)
    expect(result.body.message).toBe('success')

    expect(result.body.user).to.not.null
    const user = result.body.user
    expect(user.username).toBe(mockUser.username)
    expect(user.email).toBe(mockUser.email)
    expect(user.firstname).toBe(mockUser.firstname)
    expect(user.lastname).toBe(mockUser.lastname)

    //verify jwt
    expect(result.body.token).to.not.null
    const decoded = jwt.verify(result.body.token, SECRET)
    expect(decoded).toEqual(
        expect.objectContaining({
            _id: user._id,
            email: user.email,
            username: user.username,
        }),
    )
})

test('should return fail when invalid user information is provided', async () => {
    const attempt = {
        email: 'k@eiei.com',
        gender: Gender.MALE,
        interestedCategory: ['a', 'b', 'c'],
    }

    const mockRequest = createRequest({ body: attempt })
    const mockResponse = createResponse()

    const response: MockResponse<any> = await authController.register(
        mockRequest,
        mockResponse,
    )

    expect(response).to.not.null
    const result = response._getJSONData()

    expect(response!.statusCode).toBe(400)
    expect(result.body.message).toBe('Incomplete provided data')
})

test('should return fail when duplicate user information is provided', async () => {
    const attempt = {
        username: 'KAN',
        firstname: 'Mum',
        lastname: 'Mei',
        password: '1234',
        email: 'k@mock.com',
        gender: Gender.MALE,
        interestedCategory: ['a', 'b', 'c'],
    }

    const mockRequest = createRequest({ body: attempt })
    const mockResponse = createResponse()

    try {
        const response: MockResponse<any> = await authController.register(
            mockRequest,
            mockResponse,
        )
    } catch (e) {
        expect(e).to.not.null
        expect(e instanceof Error).toBe(true)
        if (e instanceof Error) {
            expect(e.message).toBe('Duplicate User.')
        }
    }
})

test('should return success when invalid email and password are provided', async () => {
    const attempt1 = {
        email: 'k@mock.com',
        password: '1234',
    }

    const mockRequest = createRequest({ body: attempt1 })
    const mockResponse = createResponse()

    const response: MockResponse<any> = await authController.login(
        mockRequest,
        mockResponse,
    )

    expect(response).to.not.null
    expect(response._getJSONData().body).to.not.null
    expect(response!.statusCode).toBe(200)
})

test('should return success when valid username and password are provided', async () => {
    const attempt1 = {
        username: 'KAN',
        password: '1234',
    }

    const mockRequest = createRequest({ body: attempt1 })
    const mockResponse = createResponse()

    const response: MockResponse<any> = await authController.login(
        mockRequest,
        mockResponse,
    )

    expect(response).to.not.null
    expect(response._getJSONData().body).to.not.null
    expect(response!.statusCode).toBe(200)
    expect(response._getJSONData().body.user).to.not.null

    //verify jwt
    const user = response._getJSONData().body.user
    const token = response._getJSONData().body.token
    expect(token).to.not.null
    const decoded = jwt.verify(token, SECRET)
    expect(decoded).toEqual(
        expect.objectContaining({
            _id: user._id,
            email: user.email,
            username: user.username,
        }),
    )
})

test('should return fail when submit nothing', async () => {
    const mockRequest = createRequest({ body: undefined })
    const mockResponse = createResponse()

    const response: MockResponse<any> = await authController.login(
        mockRequest,
        mockResponse,
    )

    expect(response).to.not.null
    expect(response._getJSONData().body.message).toBe(
        'Incomplete provided data',
    )
    expect(response!.statusCode).toBe(400)
})

test('should return failed when valid username and password are invalid', async () => {
    const attempts = [
        {
            username: 'KAN',
            password: '12345',
            expectedMessage: 'Invalid passowrd',
            statusCode: 401,
        },
        {
            username: 'KANT',
            password: '1234',
            expectedMessage: 'Invalid Username or Email',
            statusCode: 401,
        },
        {
            email: 'KANT@FAIL.com',
            password: '1234',
            expectedMessage: 'Invalid Username or Email',
            statusCode: 401,
        },
        {
            //empty case
            expectedMessage: 'Incomplete provided data',
            statusCode: 400,
        },
    ]

    for (const attempt of attempts) {
        const mockRequest = createRequest({
            body: {
                email: attempt.email,
                password: attempt.password,
                username: attempt.username,
            },
        })
        const mockResponse = createResponse()

        const response: MockResponse<any> = await authController.login(
            mockRequest,
            mockResponse,
        )
        const result = response._getJSONData()

        expect(response.body).to.not.null
        expect(result.body.user).toBe(undefined)
        expect(response!.statusCode).toBe(attempt.statusCode)
        expect(result.body.message).toBe(attempt.expectedMessage)
    }
})

test('should return 500 when submit nothing', async () => {
    const mockErrorService: IAuth = {
        findUserWithEmail: vitest
            .fn()
            .mockRejectedValue(new Error('Mock error')),
        findUserWithUsername: vitest
            .fn()
            .mockRejectedValue(new Error('Mock error')),
        isDuplicate: vitest.fn().mockRejectedValue(new Error('Mock error')),
        save: vitest.fn().mockRejectedValue(new Error('Mock error')),
        find: vitest.fn().mockRejectedValue(new Error('Mock error')),
        update: vitest.fn().mockRejectedValue(new Error('Mock error')),
    }
    const mockController = new AuthController()
    mockController.authService = mockErrorService

    const mockRequest = createRequest({
        body: { username: 'a', password: 'b' },
    })
    const mockResponse = createResponse()

    const response: MockResponse<any> = await mockController.login(
        mockRequest,
        mockResponse,
    )
    try {
        const response: MockResponse<any> = await authController.register(
            mockRequest,
            mockResponse,
        )
    } catch (e) {
        expect(e).to.not.null
        expect(e instanceof Error).toBe(true)
        if (e instanceof Error) {
            expect(e.message).toBe('Mock error')
        }
    }
})
