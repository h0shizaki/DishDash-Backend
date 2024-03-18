import { expect, test } from 'vitest'
import Config from '../../config'

test('init config', () => {
    const config = new Config()

    expect(config.getPort()).toBe(parseInt(<string>process.env.PORT, 10))
})
