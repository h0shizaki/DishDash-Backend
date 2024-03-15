import { Router, Request, Response } from 'express'
import { IBookMark } from '../service/interface/IBookMart'
import { BookmarkService } from '../service/BookMark'
import { Types } from 'mongoose'
import { writeErrorJson, writeResponseJson } from '../utils/responseWriter'
import { Bookmark, Record } from '../model/Bookmark'
import { decodeToken, extractToken } from '../utils/jwt'
import security from '../middleware/security'

export class BookmarkController {
    private router: Router
    public bookmarkService: IBookMark

    constructor() {
        this.router = Router()
        this.bookmarkService = new BookmarkService()
        this.router.get('/', async (req, res) => {
            return await this.findAllBookmarkByUserId(req, res)
        })

        this.router.post('/', async (req, res) => {
            return await this.addRecordToBookmark(req, res)
        })

        this.router.delete('/', async (req, res) => {
            return await this.removeRecipeFromBookmark(req, res)
        })
    }

    public getRouter(): Router {
        return this.router
    }

    public async addRecordToBookmark(req: Request, res: Response) {
        try {
            if (!req.headers.authorization) return res.send(403)
            const { _id } = decodeToken(extractToken(req)!.toString())

            const { bookmarkTitle, bookmarkId, recipeId, rating } = req.body

            if (!recipeId && !rating) {
                return writeErrorJson(res, 'Incomplete provided data', 400)
            }

            if (bookmarkId) {
                const bookmark = await this.bookmarkService.find(bookmarkId)
                if (bookmark === null) {
                    return writeErrorJson(res, 'Bookmark not found', 404)
                }

                const result = await this.bookmarkService.appendRecord(
                    bookmarkId,
                    { recipe: recipeId, rating: Number(rating) },
                )
                if (!result) {
                    return writeErrorJson(res, 'update record failed', 500)
                }
                return writeResponseJson(
                    res,
                    'success',
                    { message: 'bookmark updated' },
                    200,
                )
            } else {
                if (!bookmarkTitle)
                    return writeErrorJson(res, 'Incomplete request body', 400)
                const initRecord =
                    recipeId != null && rating != null
                        ? [{ recipe: recipeId, rating: Number(rating) }]
                        : []
                const result = await this.createNewBookmark(
                    _id,
                    bookmarkTitle,
                    initRecord,
                )

                return writeResponseJson(
                    res,
                    'success',
                    { message: 'bookmark created', data: result },
                    200,
                )
            }
        } catch (error) {
            // console.error(error)
            let status = 500
            if (error instanceof Error) {
                if(error.message === 'Invalid or expired JWT token') status = 403
                const message = error.message || 'Something went wrong.'
                return writeErrorJson(res, message, status)
            } else {
                return writeErrorJson(res, 'Internal server error', status)
            }
        }
    }

    private async createNewBookmark(
        userId: string,
        title: string,
        records: Array<Record> = [],
    ) {
        const rawBookmark: Bookmark = {
            userId: userId,
            records: records,
            title: title,
        }

        const res = await this.bookmarkService.save(rawBookmark)
        return res
    }

    public async removeRecipeFromBookmark(req: Request, res: Response) {
        try {
            const { bookmarkId, recipeId } = req.body

            if (!(recipeId && bookmarkId)) {
                return writeErrorJson(res, 'Incomplete provided data', 400)
            }

            const result = await this.bookmarkService.removeRecord(
                bookmarkId,
                recipeId,
            )
            if (!result) {
                return writeErrorJson(res, 'update record failed', 500)
            }

            const bookmark = await this.bookmarkService.find(bookmarkId)
            return res.json(bookmark)
        } catch (error) {
            // console.error(error)
            let status = 500
            if (error instanceof Error) {
                if(error.message === 'Invalid or expired JWT token') status = 403
                const message = error.message || 'Something went wrong.'
                return writeErrorJson(res, message, status)
            } else {
                return writeErrorJson(res, 'Internal server error', status)
            }
        }
    }

    public async findAllBookmarkByUserId(req: Request, res: Response) {
        try {
            if (!req.headers.authorization) {
                return res.sendStatus(403)
            }

            const { _id } = decodeToken(extractToken(req)!.toString())

            if (!Types.ObjectId.isValid(_id)) {
                return writeErrorJson(res, 'Incorrect user id', 400)
            }

            const bookmarks =
                await this.bookmarkService.findAllBookmarkFolder(_id)
            return res.json(bookmarks)
        } catch (error) {
            // console.error(error)
            let status = 500
            if (error instanceof Error) {
                if(error.message === 'Invalid or expired JWT token') status = 403
                const message = error.message || 'Something went wrong.'
                return writeErrorJson(res, message, status)
            } else {
                return writeErrorJson(res, 'Internal server error', status)
            }
        }
    }
}
