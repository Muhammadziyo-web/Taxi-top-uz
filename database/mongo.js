import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://for3863:valiyev1112@jobhire.lsn79qa.mongodb.net/?retryWrites=true&w=majority"
  ) 
  .then(() => {
  
  })
  .catch((er) => console.log(er));
