import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title : { type : String , required : true},
    description : { type : String , required : true},
    userId : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true },
    likes : [{ type : mongoose.Schema.Types.ObjectId , ref : 'Like'}],
    comments : [{ type : mongoose.Schema.Types.ObjectId , ref : 'Comment'}]
} , {timestamps : true})

export const PostModel = mongoose.model('Post' , PostSchema);

// Post Actions

export const getPosts = () => PostModel.find().populate('likes').populate('comments');
export const getPostsByUserId = (userId : string) => PostModel.find({userId : userId }).populate('likes').populate('comments');
export const getPostById = (id : string) => PostModel.findById(id).populate('likes').populate('comments');

export const getPostsByTitle = (title : string) => PostModel.find({ title: { $regex: title, $options: 'i' } }).populate('likes').populate('comments');

// adding or deleting likes to posts
export const updatePostAfterLike = (postId : string , likeId : string) => PostModel.updateOne({_id : postId }, { $push : {likes : likeId } });
export const updatePostAfterUnLike = (postId : string , likeId : string) => PostModel.updateOne({ _id: postId }, { $pull: { likes: likeId } });

// adding or deleting comments to posts
export const updatePostAfterComment = (postId : string , commentId : string) => PostModel.updateOne({ _id : postId } , { $push : { comments : commentId } })
export const updatePostAfterCommentDeletion = (postId : string , commentId : string) => PostModel.updateOne({ _id : postId } , { $pull : { comments : commentId} })

export const createPost = (values : Record <string ,any>) => new PostModel(values).save().then((post) => post.toObject());
export const updatePostById = (id : string , values : Record<string , any>) => PostModel.findByIdAndUpdate(id , values);
export const deletePostById = (id : string) => PostModel.findOneAndDelete({_id : id});