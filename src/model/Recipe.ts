import { ObjectId } from 'mongoose'

export interface Recipe {
    _id?: string | ObjectId
    RecipeId: string
    Name: string
    AuthorId: string
    AuthorName: string
    CookTime: string
    PrepTime: string
    TotalTime: string
    DatePublished: string
    Description: string
    RecipeCategory: string
    Keywords: string[]
    RecipeIngredientParts: string[]
    AggregatedRating: string
    Calories: string
    FatContent: string
    SaturatedFatContent: string
    CholesterolContent: string
    SodiumContent: string
    CarbohydrateContent: string
    FiberContent: string
    SugarContent: string
    ProteinContent: string
    RecipeServings: string
    RecipeYield: string
}
