import { expect, test } from "vitest";
import {Database} from "../../config/database";


test('init config', () => {
    const db = new Database()

    expect(db.getDatabaseUrl()).toBe(process.env.DATABASE_URL as string)
})


test('init config', () => {
    const db = new Database('localhost:27017')

    expect(db.getDatabaseUrl()).toBe('localhost:27017')
})