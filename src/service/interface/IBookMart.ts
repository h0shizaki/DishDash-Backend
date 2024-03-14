/* v8 ignore start */

import { Bookmark, Record } from "../../model/Bookmark";

export interface IBookMark {
    findAllBookmarkFolder(userId: string): Promise<Array<Bookmark>>
    find(id: string): Promise<Bookmark | null>
    save(user: Bookmark): Promise<Bookmark>
    update(id: string, bookmark: Bookmark): Promise<Bookmark | null>
    appendRecord(id: string, record: Record): Promise<Bookmark | null>
    removeRecord(id: string, record: Record): Promise<Bookmark | null>
}
/* v8 ignore stop */
