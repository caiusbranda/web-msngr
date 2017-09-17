var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    contentText: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: Number, required: true}
});

module.exports = mongoose.model('Message', schema);