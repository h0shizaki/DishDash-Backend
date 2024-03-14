import { Bookmark, Record } from "../model/Bookmark";
import { IBookMark } from "./interface/IBookMart";
export class BookmarkService implements IBookMark {
    findAllBookmarkFolder(userId: string): Promise<Bookmark[]> {
        throw new Error("Method not implemented.");
    }
    find(id: string): Promise<Bookmark | null> {
        throw new Error("Method not implemented.");
    }
    save(user: Bookmark): Promise<Bookmark> {
        throw new Error("Method not implemented.");
    }
    update(id: string, bookmark: Bookmark): Promise<Bookmark | null> {
        throw new Error("Method not implemented.");
    }
    appendRecord(id: string, record: Record): Promise<Bookmark | null> {
        throw new Error("Method not implemented.");
    }
    removeRecord(id: string, record: Record): Promise<Bookmark | null> {
        throw new Error("Method not implemented.");
    }
}