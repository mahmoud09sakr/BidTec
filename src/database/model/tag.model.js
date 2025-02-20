import mongoose, { Schema } from "mongoose"
import slugify from "slugify"

const TagSchema = new Schema({
    name: {
        type: String,
        required: true
    }
    ,
    slug: {
        type: String,
    }
})
TagSchema.pre('save', function () {
    this.slug = slugify(this.title)
})
const tagModel = mongoose.model("tag", TagSchema)
export default tagModel