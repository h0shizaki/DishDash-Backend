import jwt from 'jsonwebtoken'
import { expect, test } from 'vitest'
import { decoedToken, extractToken, generateUserToken } from '../../utils/jwt'
import { User } from '../../model/User'
import { Gender } from '../../model/Gender'
import Config from '../../config'
import { MockRequest, createRequest } from 'node-mocks-http'

const SECRET = new Config().getJwtSecret()

const user: User = {
    _id: '123',
    email: 'test@example.com',
    username: 'testuser',
    firstname: '',
    lastname: '',
    password: '',
    gender: Gender.FEMALE,
}

test('should generate a valid JWT token', () => {
    const token = generateUserToken(user)
    const decoded = jwt.verify(token, SECRET)
    expect(decoded).toEqual(
        expect.objectContaining({
            _id: user._id,
            email: user.email,
            username: user.username,
        }),
    )
})

test('should include an expiration time of 7 days', () => {
    const token = generateUserToken(user)
    const decoded: any = jwt.decode(token)
    const expiration = decoded?.exp
    const currentTime = Math.floor(Date.now() / 1000)
    const differenceInSeconds = expiration - currentTime
    const sevenDaysInSeconds = 7 * 24 * 60 * 60
    expect(differenceInSeconds).toBeCloseTo(sevenDaysInSeconds, -1) // Close enough to 7 days
})

test('should decode a valid JWT token', () => {
    const token = generateUserToken(user)
    const decoded = decoedToken(token)
    expect(decoded).toEqual(
        expect.objectContaining({
            _id: user._id,
            email: user.email,
            username: user.username,
        }),
    )
})

test('should throw an error for an invalid JWT token', () => {
    const invalidToken = 'invalid_token'
    expect(() => decoedToken(invalidToken)).toThrow()
})

test('should extract token from authorization header', () => {
    const req = createRequest({headers: {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWYwMTdlNTA3YzFhOWI2NmQ4NTQ3NjQiLCJlbWFpbCI6Imthbl9rQGF0b21pYy5hYy50aCIsInVzZXJuYW1lIjoiQXRvbWxhbnRpcyIsImlhdCI6MTcxMDQzOTQxNCwiZXhwIjoxNzExMDQ0MjE0fQ.uLRHjlkHOG0ltjKc1EVv3_Cs2bY7S3S4N390JlwUSJY'
    }});

    const token = extractToken(req);
    expect(token).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWYwMTdlNTA3YzFhOWI2NmQ4NTQ3NjQiLCJlbWFpbCI6Imthbl9rQGF0b21pYy5hYy50aCIsInVzZXJuYW1lIjoiQXRvbWxhbnRpcyIsImlhdCI6MTcxMDQzOTQxNCwiZXhwIjoxNzExMDQ0MjE0fQ.uLRHjlkHOG0ltjKc1EVv3_Cs2bY7S3S4N390JlwUSJY');
});



test('should return null if token is not found', () => {
    const req = createRequest({headers: {
        'authorization': ''
    }});

    const token = extractToken(req);
    expect(token).toBeNull();
});