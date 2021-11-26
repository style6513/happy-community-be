// 다른 유저가 자기 자신의 post를 like or comment
// 친추
const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  type : {
    type : String,
    enum : ['following', 'like', 'comment']
  },
  isRead : { type : Boolean, default : false }
}{
  timestamps : true
});
