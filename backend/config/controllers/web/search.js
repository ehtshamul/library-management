
const Books = require("../../models/admin/Addbook");

// Search books by title or author keywords

const searchBooks= async (req,res)=>{
    const {query}=req.query;
    try{
        let queryobj={};
        if(query){
            queryobj={
                $or:[
                    {title:{$regex:query,$options:"i"}},
                    {author:{$regex:query,$options:"i"}},
                    { keywords: { $elemMatch: { $regex: query, $options: "i" } } }
                ],
            };
        }
        const books = await Books.find(queryobj).sort({createdAt:-1});
        res.json(books)
       
        

    }catch(error){
        
        res.status(500).json({error:error.message});
    }
}
module.exports={searchBooks};