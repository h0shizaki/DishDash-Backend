/* v8 ignore start */
import { Schema, model, Types } from 'mongoose'

export interface Recipe {
    _id?: string| Types.ObjectId
    RecipeId: string
    Name: string
    AuthorId: string
    AuthorName: string
    CookTime: string
    PrepTime: string
    TotalTime: string
    DatePublished: string
    Description: string
    Images: string[]
    RecipeCategory: string
    Keywords: string[]
    RecipeIngredientQuantities: string[]
    RecipeIngredientParts: string[]
    AggregatedRating: string
    Calories: string
    FatContent?: string
    SaturatedFatContent?: string
    CholesterolContent?: string
    SodiumContent?: string
    CarbohydrateContent?: string
    FiberContent?: string
    SugarContent?: string
    ProteinContent?: string
    RecipeServings?: string
    RecipeYield?: string
    RecipeInstructions: string[]
}

const RecipeSchema = new Schema<Recipe>({
    RecipeId: String,
    Name: String,
    AuthorId: String,
    AuthorName: String,
    CookTime: String,
    PrepTime: String,
    TotalTime: String,
    DatePublished: String,
    Description: String,
    Images: Array<string>,
    RecipeCategory: String,
    Keywords: Array<string>,
    RecipeIngredientQuantities: Array<string>,
    RecipeIngredientParts: Array<string>,
    AggregatedRating: String,
    Calories: String,
    FatContent: {type: String , required: false},
    SaturatedFatContent:{type: String , required: false},
    CholesterolContent: {type: String , required: false},
    SodiumContent: {type: String , required: false},
    CarbohydrateContent: {type: String , required: false},
    FiberContent: {type: String , required: false},
    SugarContent: {type: String , required: false},
    ProteinContent: {type: String , required: false},
    RecipeServings: {type: String , required: false},
    RecipeYield: {type: String , required: false},
    RecipeInstructions: Array<string>
})

export const RecipeM = model('recipe', RecipeSchema)
/* v8 ignore stop */