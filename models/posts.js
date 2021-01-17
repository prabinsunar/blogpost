const { Timestamp } = require('bson');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, required: true, maxlength: 100 },
	post: { type: String, required: true },
	timestamp: { type: Date, default: Date.now() },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

PostSchema.virtual('timestamp_formatted').get(function () {
	return Math.round(this.timestamp / 1000);
});

PostSchema.virtual('url').get(function () {
	return `${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);
