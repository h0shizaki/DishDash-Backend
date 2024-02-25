import "dotenv/config"
import mongoose from "mongoose";

export class Database {
    databaseUrl : string;
    constructor(dataUrl?: string) {
        this.databaseUrl = process.env.DATABASE_URL as string || dataUrl || ''
    }

    public async connect() {
        try{
            await mongoose.connect(this.databaseUrl + "?authSource=admin")
            console.log("Connected To Database");
        }catch(e){
            throw e;
        }
    }
}
