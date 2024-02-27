import mongoose from "mongoose";
import Config from ".";

export class Database {
    private databaseUrl: string
    constructor(config: Config) {
        this.databaseUrl = config.getDatabaseUrl()
    }

    public async connect() {
        try{
            await mongoose.connect(this.databaseUrl)
            console.log("Connected To Database");
        }catch(e){
            throw e;
        }
    }
    public getDatabaseUrl() {
        return this.databaseUrl
    }
}
