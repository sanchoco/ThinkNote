const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const search = new Schema({
    searchUserId : { type: String, required: true },
    userId : { type: String, required: true },
},
   { timestamps: true });

search.virtual('searchId').get(function () {
   return this._id.toHexString();
});

search.set('toObject', {
   virtuals: true
});
search.set('toJSON', {
   virtuals: true
});

module.exports = mongoose.model('Search', search);