var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    contentText: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Message', schema);