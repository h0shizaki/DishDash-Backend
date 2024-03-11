import { MockResponse, createResponse } from 'node-mocks-http'
import { expect, test } from 'vitest'
import { writeResponseJson, writeErrorJson } from '../../utils/responseWriter'
import { Response } from 'express'

test('Enable to write success json', () => {
    let mockResponse: MockResponse<any> = createResponse()
    const data =  { user: {id: 1, name: "a"}}
    let res: MockResponse<any> = writeResponseJson(
        mockResponse,
        'success',
        data,
        200,
    )

    expect(res.statusCode).toBe(200)
    expect(JSON.stringify(res._getJSONData().body.user)).toBe(
        JSON.stringify(data.user),
    )
    expect(res._getJSONData().body.message).toBe('success')
})

test('Enable to write error', () => {
    let mockResponse = createResponse()
    let res: MockResponse<any> = writeErrorJson(mockResponse, 'Fail')

    expect(res.statusCode).toBe(500)
    expect(res._getJSONData().body.message).toBe('Fail')
})

test('Enable to write error 403', () => {
    let mockResponse = createResponse()
    let res: MockResponse<any> = writeErrorJson(mockResponse, 'Fail', 403)

    expect(res.statusCode).toBe(403)
    expect(res._getJSONData().body.message).toBe('Fail')
})
