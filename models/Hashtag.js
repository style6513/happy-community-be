const mongoose = require("mongoose");
const HashtagSchema = new mongoose.Schema({
  name : {
    type : String,
    minlength : 1,
    maxlength : 20,
    
  },
  posts : [{ type : mongoose.Schema.Types.ObjectId, ref : "Post" }]
}, 
   { timestamps : true }
);


const Hashtag = mongoose.model("Hashtag", HashtagSchema);

module.exports = Hashtag;
