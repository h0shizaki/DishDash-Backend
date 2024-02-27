import { expect, test } from "vitest";
import {Database} from "../../config/database";
import Config from "../../config";


test('test connection', () => {
    const config = new Config()
    const db = new Database(config)
    
    expect(db.getDatabaseUrl()).toBe(process.env.DATABASE_URL as string)
})
