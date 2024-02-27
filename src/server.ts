import { Application } from 'express'
import App from './App'
import Config from './config'
import { Database } from './config/database'

export class Server {
    private app: App
    private express: Application
    private config: Config
    private database: Database

    constructor() {
        this.config = new Config()
        this.app = new App()
        this.express = this.app.express
        this.database = new Database(this.config)
    }

    public async startServer() {
        try {
            await this.database.connect()
            const port: number = this.config.getPort()
            this.express.listen(port, () => {
                console.log(`Server is running on port ${port}!`)
            })
        } catch (e) {
            console.error('Unable to start server: ', e)
            process.exit(1)
        }
    }
}

function main() {
    const server: Server = new Server()
    server.startServer()
}

main()
