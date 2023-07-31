import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
    userId : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true },
    postId : { type : mongoose.Schema.Types.ObjectId , ref : 'Post' , required : true }
})

export const LikeModel = mongoose.model('Like' , LikeSchema);

// Like Actions 

export const createLike = (values : Record<string , any>) => new LikeModel(values).save().then((like) => like.toObject());

export const getLikesByPostId = (postId : string) => LikeModel.find({postId : postId})

export const getLikesByUserIdAndPostId = (userId : string , postId : string) => LikeModel.findOne({userId : userId , postId : postId});

export const deleteLike = (id : string) => LikeModel.findOneAndDelete({_id : id});