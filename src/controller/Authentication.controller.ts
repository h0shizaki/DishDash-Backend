import { Router,Request,Response } from "express";


export class AuthController {
    private router : Router ;

    constructor() {
        this.router = Router() ;
    }

    public getRouter() : Router {
        return this.router ;
    }

}