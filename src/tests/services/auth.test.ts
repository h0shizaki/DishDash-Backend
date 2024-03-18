import mongoose from 'mongoose'
import { expect, test } from 'vitest'
import { beforeAll } from 'vitest'
import 'dotenv/config'
import { AuthService } from '../../service/Authentication'
import { User } from '../../model/User'
import { Gender } from '../../model/Gender'
import { UserM } from '../../model/UserSchema'
import Config from '../../config'

const mockUser: User = {
    username: 'KAN',
    firstname: 'Mum',
    lastname: 'Mei',
    password: '1234',
    email: 'k@mock.com',
    gender: Gender.MALE,
    interestedCategory: ['a', 'b', 'c'],
}
const mockUser2: User = {
    username: 'KAN_KETKAEW',
    firstname: 'KET',
    lastname: 'KAEW',
    password: '54321',
    email: 'keaw@mock.com',
    gender: Gender.OTHERS,
    interestedCategory: ['a', 'b', 'c'],
}
const authService: AuthService = new AuthService()

beforeAll(async () => {

    const config = new Config()
    await mongoose.connect(config.getDatabaseUrl())

    await UserM.deleteMany({})

})

test('Should create user', async () => {
    const saved = await authService.save(mockUser)
    expect(saved.username).toBe(mockUser.username)
    expect(saved.firstname).toBe(mockUser.firstname)
    expect(saved.lastname).toBe(mockUser.lastname)
    expect(saved.gender).toBe(mockUser.gender)
})

test('Should able to find by username', async () => {
    const res = await authService.findUserWithUsername(mockUser.username)
    const res2 = await authService.findUserWithUsername('VIM')

    expect(res).not.toBe(null)
    expect(res!.username).toBe(mockUser.username)
    expect(res!.firstname).toBe(mockUser.firstname)
    expect(res!.lastname).toBe(mockUser.lastname)
    expect(res!.gender).toBe(mockUser.gender)
    expect(res2).toBe(null)
})

test('Should able to find by email', async () => {
    const res = await authService.findUserWithEmail(mockUser.email)
    const res2 = await authService.findUserWithEmail('VIM@test.com')

    expect(res).not.toBe(null)
    expect(res!.username).toBe(mockUser.username)
    expect(res!.firstname).toBe(mockUser.firstname)
    expect(res!.lastname).toBe(mockUser.lastname)
    expect(res!.gender).toBe(mockUser.gender)
    expect(res2).toBe(null)
})

test('Should able to check duplicate', async () => {
    const res = await authService.isDuplicate(mockUser)
    expect(res).toBe(true)

    const res2 = await authService.isDuplicate(mockUser2)
    expect(res2).toBe(false)
})

test('Should not able to insert duplicate', async () => {
    expect(async () => {
        await authService.save(mockUser)
    }).rejects.toThrowError('Duplicate User.')
})

test('Should able to find by ID', async () => {
    const res = await authService.findUserWithEmail(mockUser.email)
    const id = res?._id

    expect(id).not.toBe(null)

    const search = await authService.find(id!.toString())
    expect(search).not.toBe(null)

    const search2 = await authService.find('000000000000000000000000')
    expect(search2).toBe(null)
})

test('Should able to update', async () => {
    const res = await authService.findUserWithEmail(mockUser.email)
    const id = res!._id
    const update = await authService.update(id!.toString(), mockUser2)

    expect(update?._id?.toString()).toBe(id!.toString())
    expect(update?.email).not.toBe(mockUser.email)
    expect(update?.email).toBe(mockUser2.email)
    expect(update?.firstname).not.toBe(mockUser.firstname)
    expect(update?.firstname).toBe(mockUser2.firstname)
})

test('should error due to no db connection', async () => {
    await mongoose.disconnect()

    expect(async () => {
        await authService.save(mockUser)
    }).rejects.toThrowError()

    expect(async () => {
        await authService.findUserWithEmail(mockUser.email)
    }).rejects.toThrowError()

    expect(async () => {
        await authService.findUserWithUsername(mockUser.username)
    }).rejects.toThrowError()

    expect(async () => {
        await authService.isDuplicate(mockUser)
    }).rejects.toThrowError()

    expect(async () => {
        await authService.find('000000000000000000000000')
    }).rejects.toThrowError()
    expect(async () => {
        await authService.update('000000000000000000000000', mockUser2)
    }).rejects.toThrowError()
})
