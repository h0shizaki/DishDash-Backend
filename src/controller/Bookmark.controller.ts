/* v8 ignore start */
import { Router, Request, Response } from 'express'
import { IBookMark } from '../service/interface/IBookMart'
import { BookmarkService } from '../service/BookMark'
import { Types } from 'mongoose'
import { writeErrorJson, writeResponseJson } from '../utils/responseWriter'
import { Bookmark, Record } from '../model/Bookmark'
import { decodeToken, extractToken } from '../utils/jwt'

export class BookmarkController {
    private router: Router
    public bookmarkService: IBookMark

    constructor() {
        this.router = Router()
        this.bookmarkService = new BookmarkService()

        this.router.get('/', async (req, res) => {
            return await this.findAllBookmarkByUserId(req, res)
        })

        this.router.post('/create', async (req, res) => {
            return await this.createBookmark(req, res)
        })

        this.router.post('/record', async (req, res) => {
            return await this.addRecordToBookmark(req, res)
        })

        this.router.delete('/', async (req, res) => {
            return await this.removeRecipeFromBookmark(req, res)
        })

        this.router.get('/:bookmarkId', async (req, res) => {
            return await this.getBookmark(req, res)
        })

        this.router.put('/:bookmarkId', async (req, res) => {
            return await this.updateBookmark(req, res)
        })

        this.router.put('/:bookmarkId/record', async (req, res) => {
            return await this.updateRecordRating(req, res)
        })
    }

    public getRouter(): Router {
        return this.router
    }

    public async createBookmark(req: Request, res: Response) {
        if (!req.headers.authorization) return res.send(403)
        const { _id } = decodeToken(extractToken(req)!.toString())
        const { title, thumbnail, records } = req.body
        try {
            if (!title)
                return writeErrorJson(res, 'Incomplete provided data', 400)
            const bookmark = {
                title: title,
                thumbnail: thumbnail,
                records: records? records: [],
                userId: new Types.ObjectId(_id)
            }

            const result = await this.bookmarkService.save(bookmark)

            return writeResponseJson(
                res,
                'success',
                { message: 'bookmark created', data: result },
                200,
            )
        } catch (error) {
            let status = 500
            if (error instanceof Error) {
                if (error.message === 'Invalid or expired JWT token')
                    status = 403
                const message = error.message || 'Something went wrong.'
                return writeErrorJson(res, message, status)
            } else {
                return writeErrorJson(res, 'Internal server error', status)
            }
        }
    }
    public async getBookmark(req: Request, res: Response) {
        try {
            if (!req.headers.authorization) return res.send(403)
            const bookmarkId = req.params.bookmarkId
            const bookmark = await this.bookmarkService.find(bookmarkId)

            return writeResponseJson(res, 'success', { bookmark }, 200)
        } catch (error) {
            // console.error(error)
            let status = 500
            if (error instanceof Error) {
                if (error.message === 'Invalid or expired JWT token')
                    status = 403
                const message = error.message || 'Something went wrong.'
                return writeErrorJson(res, message, status)
            } else {
                return writeErrorJson(res, 'Internal server error', status)
            }
        }
    }

    public async updateRecordRating(req: Request, res: Response) {
        try {
            if (!req.headers.authorization) return res.send(403)
            const bookmarkId = req.params.bookmarkId

            const { record } = req.body

            if (!record)
                return writeErrorJson(res, 'Incomplete provided data', 400)

            const resp = await this.bookmarkService.updateRecordRating(
                bookmarkId,
                record,
            )
            return writeResponseJson(res, 'success', { result: resp }, 200)
        } catch (error) {
            // console.error(error)
            let status = 500
            if (error instanceof Error) {
                if (error.message === 'Invalid or expired JWT token')
                    status = 403
                const message = error.message || 'Something went wrong.'
                return writeErrorJson(res, message, status)
            } else {
                return writeErrorJson(res, 'Internal server error', status)
            }
        }
    }

    public async addRecordToBookmark(req: Request, res: Response) {
        try {
            if (!req.headers.authorization) return res.send(403)
            const { _id } = decodeToken(extractToken(req)!.toString())

            const { bookmarkTitle, bookmarkId, recipeId, rating } = req.body

            console.log(bookmarkTitle, bookmarkId, recipeId, rating)

            if (!recipeId && !rating) {
                return writeErrorJson(res, 'Incomplete provided data', 400)
            }

            if (bookmarkId) {
                const bookmark = await this.bookmarkService.find(bookmarkId)
                if (bookmark === null) {
                    return writeErrorJson(res, 'Bookmark not found', 404)
                }
                // console.log(bookmark);

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
                    { message: 'bookmark updated', result },
                    200,
                )
            } else {
                if (!bookmarkTitle)
                    return writeErrorJson(res, 'Incomplete request body', 400)

                const initRecord =
                    recipeId != null && rating != null
                        ? [
                              {
                                  recipe: new Types.ObjectId(recipeId),
                                  rating: Number(rating),
                              },
                          ]
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
                if (error.message === 'Invalid or expired JWT token')
                    status = 403
                const message = error.message || 'Something went wrong.'
                return writeErrorJson(res, message, status)
            } else {
                return writeErrorJson(res, 'Internal server error', status)
            }
        }
    }

    public async updateBookmark(req: Request, res: Response) {
        try {
            if (!req.headers.authorization) return res.send(403)
            const bookmarkId = req.params.bookmarkId

            const newBookmark = req.body.bookmark
            if (!newBookmark) {
                return writeErrorJson(res, 'Empty bookmark body', 400)
            }

            const result = await this.bookmarkService.update(
                bookmarkId,
                newBookmark,
            )

            return writeResponseJson(
                res,
                'success',
                { message: 'bookmark updated', data: result },
                200,
            )
        } catch (error) {
            // console.error(error)
            let status = 500
            if (error instanceof Error) {
                if (error.message === 'Invalid or expired JWT token')
                    status = 403
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
                if (error.message === 'Invalid or expired JWT token')
                    status = 403
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

            const isLightWeight = req.query.isLightWeight
            const { _id } = decodeToken(extractToken(req)!.toString())

            if (!Types.ObjectId.isValid(_id)) {
                return writeErrorJson(res, 'Incorrect user id', 400)
            }

            const bookmarks = await this.bookmarkService.findAllBookmarkFolder(
                _id,
                isLightWeight === 'true',
            )
            return res.json(bookmarks)
        } catch (error) {
            // console.error(error)
            let status = 500
            if (error instanceof Error) {
                if (error.message === 'Invalid or expired JWT token')
                    status = 403
                const message = error.message || 'Something went wrong.'
                return writeErrorJson(res, message, status)
            } else {
                return writeErrorJson(res, 'Internal server error', status)
            }
        }
    }
}
/* v8 ignore stop */
