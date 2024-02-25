import { Response } from "express";
import { createResponse} from 'node-mocks-http';
import { expect, test } from 'vitest'
import { writeResponseJson , writeErrorJson } from "../../utils/responseWriter";


test('Enable to write success json' , () => {
    let mockResponse = createResponse()
    const data = [{a: 1, b:2, foo:"bar"}]
    let res: Response = writeResponseJson(mockResponse, "success", data , 200)

    expect(res.statusCode).toBe(200)
    expect(JSON.stringify(res._getJSONData().body.data)).toBe(JSON.stringify(data))
    expect(res._getJSONData().body.message).toBe("success")
})

test('Enable to write error' , () => {
    let mockResponse = createResponse()
    let res: Response = writeErrorJson(mockResponse, "Fail")

    expect(res.statusCode).toBe(500)
    expect(res._getJSONData().body.message).toBe("Fail")
})

test('Enable to write error 403' , () => {
    let mockResponse = createResponse()
    let res: Response = writeErrorJson(mockResponse, "Fail", 403)

    expect(res.statusCode).toBe(403)
    expect(res._getJSONData().body.message).toBe("Fail")
})