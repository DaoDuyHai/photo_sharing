import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  file_name: { type: String },
  date_time: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  comments: [
    {
      comment: String,
      date_time: { type: Date, default: Date.now },
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    },
  ],
  
  
});

const Photo = mongoose.model("Photo", photoSchema);
export default Photo;