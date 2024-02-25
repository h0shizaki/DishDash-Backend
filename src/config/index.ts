import "dotenv/config"

class Config {

    private port: number ;
    constructor() {
        this.port = parseInt(<string>process.env.PORT,10) || 4000 ;
    }

    public getPort(): number {
        return this.port ;
    }


}

export default Config ;