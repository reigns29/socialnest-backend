import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    userId : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true },
    postId : { type : mongoose.Schema.Types.ObjectId , ref : 'Post' , required : true },
    content : { type : String , required : true }
}, {timestamps : true})

export const CommentModel = mongoose.model('Comment' , CommentSchema);

// Comment Actions 

export const createComment = (values : Record <string , any>) => new CommentModel(values).save().then((comment) => comment.toObject());

export const getCommentsByPostId = (postId : string) => CommentModel.find({postId : postId})

export const getCommentById = (id : string) => CommentModel.findById(id);

export const getCommentByUserIdAndPostId = (userId : string , postId : string) => CommentModel.findOne({userId : userId , postId : postId});

export const updateCommentById = (id : string , values : Record<string , any>) => CommentModel.findByIdAndUpdate(id , values);

export const deleteCommentById = (id : string) => CommentModel.findOneAndDelete({_id : id });