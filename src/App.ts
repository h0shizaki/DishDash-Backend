import express, {Application ,Request , Response, Router } from 'express';
import cor from './middleware/cor';
class App {
    public express: Application ;
 
    constructor() {
        this.express = express() ;
        this.express.use(express.urlencoded({extended:false}));
        this.express.use(express.json());
        this.express.use(cor.enableCORS);
        this.express.enable("trust proxy");
        this.loadRoutes();
    }

    private loadRoutes() {
        const router = express.Router() ;
        router.get('/' , (req: Request , res: Response) => {
            return res.send(`${process.env.NODE_ENV}`);
        })
        
        // router.use('/api',  );

        router.use('*' , (req: Request , res : Response) => {
            return res.status(404).send('404 not found');
        })

        this.express.use(router);
    }
}

export default App ;