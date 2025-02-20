import mongoose, { Schema } from "mongoose"
const maintainanceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
    ,
    country: {
        type: String,
        required: true
    }
})
const maintainanceModel = mongoose.model('maintainance', maintainanceSchema)
export default maintainanceModel