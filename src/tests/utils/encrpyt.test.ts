import { expect, test } from 'vitest'
import { encode, check } from '../../utils/encrypt'


const content = "NOLEMONNOMELON"

test('Should be able to encrypt' , async() => {
    const encoded = await encode(content)
    expect(encoded).not.toBe(content)
})

test('Should be albe to decode and compare', async() => {
    const encoded = await encode(content)
    let result1 = await check(content, encoded)
    let result2 = await check("ABC", encoded)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
})
