var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
    name: {type: String, required: true}
});

module.exports = mongoose.model('Chat', schema);