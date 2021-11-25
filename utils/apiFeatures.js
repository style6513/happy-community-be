
class APIFeatures {
   constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString
   }
   filter() {
      // build query
      const queryObj = { ...this.queryString }
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(ele => delete queryObj[ele]);

      // localhost:9000/posts?desc=something&duration[gte]=5
      // { desc : "something", duration : { $gte : 5 } }
      // gte, te, lte, lt
      // https://localhost:3000/post?hashtag=애쉬퍼플  =>  req.query = { hashtag : "애쉬퍼플" }

      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

      this.query.find(JSON.parse(queryStr));
      return this;
   }
   sort() {
      if(this.queryString.sort) {
         const sortBy = this.queryString.sort.split(",").join(" ");
         this.query = this.query.sort(sortBy)
      } else {
         this.query = this.query.sort("-createdAt")
      }
      
      return this;
   }
   limitFields() {
      if(this.queryString.fields) {
         const fields = this.queryString.fields.split(",").join(" ");
         this.query = this.query.select(fields)
      } else {
         this.query = this.query.select('-__v');
      }

      return this;
   }
   paginate() {
      //pagination
      // localhost:9000/posts?page=2&limit=10
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit

      this.query = this.query.skip(skip).limit(limit);

      return this;
   }
   handleHashtags() {
      if(this.queryString.hashtag) {
         
      }
   }
}

module.exports = APIFeatures;