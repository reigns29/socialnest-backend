import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    },
    follows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Follow' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Following' }]
})

export const UserModel = mongoose.model('User', UserSchema);

// User Actions

export const getUsers = () => UserModel.find().populate('follows').populate('following');
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
export const getUsersByUsername = (username: string) => UserModel.find({ username: { $regex: username, $options: 'i' } })
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

// follow and following actions

export const updateUserAfterFollow = (id: string, followId: string) => UserModel.updateOne({ _id: id }, { $push: { follows: followId } })

export const updateUserAfterFollowing = (id: string, followingId: string) => UserModel.updateOne({ _id: id }, { $push: { following: followingId } })

export const updateUserAfterUnfollow = (id: string, followId: string) => UserModel.updateOne({ _id: id }, { $pull: { follows: followId } })

export const updateUserAfterUnfollowing = (id: string, followingId: string) => UserModel.updateOne({ _id: id }, { $pull: { following: followingId } })