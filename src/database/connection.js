import mongoose from 'mongoose'
const DbConnection = async () => {
    await mongoose.connect(process.env.DATABASE_URL).then(() => {
        console.log("database connected successfully");
    }).catch((err) => {
        console.log(err);
    })
}
export default DbConnection