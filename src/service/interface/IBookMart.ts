/* v8 ignore start */

import { Bookmark, Record } from "../../model/Bookmark";

export interface IBookMark {
    findAllBookmarkFolder(userId: string, isLightWeight: boolean): Promise<Array<Bookmark>>
    find(id: string): Promise<Bookmark | null>
    save(user: Bookmark): Promise<Bookmark>
    update(id: string, bookmark: Bookmark): Promise<Bookmark | null>
    appendRecord(id: string, record: Record): Promise<boolean | null>
    removeRecord(id: string, recordId: string): Promise<boolean | null>
    updateRecordRating(id: string, record: Record): Promise<boolean | null>
}
/* v8 ignore stop */
