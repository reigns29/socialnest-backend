import mongoose, { ObjectId } from 'mongoose';

const FollowingSchema = new mongoose.Schema({
    fromUserId : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true }
});

export const FollowingModel = mongoose.model('Following' , FollowingSchema);

// following actions 

export const createFollowing = (fromUserId : string) => new FollowingModel({fromUserId : fromUserId } ).save().then((followingObject) => followingObject.toObject());

export const getFollowingObject = (fromUserId : string) => FollowingModel.findOne({fromUserId : fromUserId});

export const deleteFollowing = (id : string) => FollowingModel.findOneAndDelete({_id : id});



