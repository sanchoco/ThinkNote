const mongoose = require('mongoose');
const { Schema } = mongoose;

const dailyQuestion = new Schema({
	userId: { type: String, required : true },
	question1: { type: String, required: true },
	question2: { type: String, required : true },
    question3: { type: String, required : true },
    date: { type: String, required: true, default: Date.now() },
},
	{ timestamps: true });

questionCard.virtual('questionId').get(function () {
	return this._id.toHexString();
});

questionCard.set('toObject', {
	virtuals: true
});
questionCard.set('toJSON', {
	virtuals: true
});

module.exports = mongoose.model('DailyQuestion', dailyQuestion);