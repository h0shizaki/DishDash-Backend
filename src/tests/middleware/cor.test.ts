import { Response, Request } from 'express'
import {
    createRequest,
    createResponse,
    MockRequest,
    MockResponse,
} from 'node-mocks-http'
import { expect, test } from 'vitest'
import Cor from '../../middleware/cor'

test('Enable cor should inject headers', () => {
    let mockResponse = createResponse()
    Cor.enableCORS(createRequest(), mockResponse, () => {})
    expect(mockResponse.getHeader('access-control-allow-origin')).toBe('*')
    expect(mockResponse.getHeader('Access-Control-Allow-Methods')).toBe(
        'GET, POST, PUT, DELETE',
    )
    expect(mockResponse.getHeader('Access-Control-Allow-Headers')).toBe(
        'Content-Type,Authorization',
    )
})
