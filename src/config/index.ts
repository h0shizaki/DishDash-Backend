import dotenv from "dotenv" 
import path from "path";
dotenv.config({path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}`: '.env' })


class Config {

    private databaseUrl : string;
    private port: number ;
    private jwtSecret: string;

    constructor() {
        this.port = parseInt(<string>process.env.PORT,10) || 4000 ;        
        this.databaseUrl = process.env.DATABASE_URL || 'mongodb://mongo@localhost:27017/'
        this.jwtSecret = process.env.JWT_SECRET || ''
    }

    public getDatabaseUrl() {
        return this.databaseUrl
    }
    
    public getPort(): number {
        return this.port ;
    }

    public getJwtSecret(): string {
        return this.jwtSecret ;
    }
}

export default Config ;