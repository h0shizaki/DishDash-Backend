import dotenv from "dotenv" 
import path from "path";
dotenv.config({path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}`: '.env' })


class Config {

    private databaseUrl : string;
    private port: number ;
    constructor() {
        this.port = parseInt(<string>process.env.PORT,10) || 4000 ;        
        this.databaseUrl = process.env.DATABASE_URL || 'mongodb://mongo@localhost:27017/'
    }

    public getDatabaseUrl() {
        return this.databaseUrl
    }
    
    public getPort(): number {
        return this.port ;
    }
}

export default Config ;