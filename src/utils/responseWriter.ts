import { Response } from "express";

export function writeResponseJson( res : Response, message: String , data : any, status?: number ) {
    if(status === undefined){
        status = 200 ;
    }

    const response = {
        "header": {
            "code": status
        },
        "body": {
            "message" : message,
            "data":data
        }
    }

    return res.status(status).json(response) ;
}

export function writeErrorJson(res : Response, message: String, status?:number ){
    if(status === undefined) status = 500 ;
    return writeResponseJson(res,message, "", status);
}