const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstname: { type: String, required: true, maxlength: 100 },
	lastname: { type: String, required: true, maxlength: 100 },
	username: { type: String, required: true, maxlength: 100 },
	password: { type: String, required: true, maxlength: 100 },
	membership_status: {
		type: String,
		required: true,
		enum: ['Member', 'Not a member'],
		default: 'Not a member',
	},
	admin: { type: Boolean, default: false, required: true },
});

UserSchema.virtual('url').get(function () {
	return `/${this._id}`;
});

UserSchema.virtual('fullname').get(function () {
	return `${this.lastname}, ${this.firstname}`;
});

module.exports = mongoose.model('User', UserSchema);
