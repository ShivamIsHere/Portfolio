import mongoose from "mongoose"
const dbConnection = () => {
  mongoose.connect(process.env.MONGO_URL,{
    dbName:"PORTFOLIO",
  })
  .then(()=>{
    console.log("Connected to database")
  })
  .catch((err)=>{
    console.log(`Some Error Occured while Connecting to Database:${err}`);
  })

}

export default dbConnection
