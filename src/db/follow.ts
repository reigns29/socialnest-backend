import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema({
    toUserId : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true }
});

export const FollowModel = mongoose.model('Follow' , FollowSchema);

// follow actions 

export const createFollow = (toUserId : string) => new FollowModel({toUserId : toUserId}).save().then((followObject) => followObject.toObject());

export const getFollowObject = (toUserId : string) => FollowModel.findOne({toUserId : toUserId});

export const deleteFollow = (id : string) => FollowModel.findOneAndDelete({_id : id});


