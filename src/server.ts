import { Application } from 'express';
import App from './App';
import Config from './config';

export class Server {
    private app : App ;
    private express : Application ;
    private config: Config ;


    constructor() {
        this.config = new Config();
        this.app = new App() ;
        this.express = this.app.express;
    }

    public async startServer() {
        const port: number = this.config.getPort() ;
        this.express.listen(port, () => {
            console.log(`Server is running on port ${port}!`)
        })
    }
 
}

function main() {
    const server : Server = new Server();
    server.startServer();
}

main();