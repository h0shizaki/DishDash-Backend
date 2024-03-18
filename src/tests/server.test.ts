import { Server } from '../server'
import { expect, test } from 'vitest'
import express, { Application, Request, Response, Router } from 'express'

test('Server must not null', () => {
    const server: Server = new Server()
    expect(server).to.not.null
})
