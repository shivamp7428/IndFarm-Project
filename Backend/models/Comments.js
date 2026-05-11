import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
{
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },

   productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
   },

   farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },

   comment: {
      type: String,
      required: true
   },

   rating: {
      type: Number,
      min: 1,
      max: 5
   }

},
{ timestamps: true }
)

const comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default comment;