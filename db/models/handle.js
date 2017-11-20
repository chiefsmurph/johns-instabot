// The Handle model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var handleSchema = new Schema({
    // basics
    handle: String,
    fullname: String,
    // in depth stats
    numposts: Number,
    numfollowers: Number
    // result of actions
    postlikes: [{
        url: String,
        relatedtag: String,
        date: {
          type: Date,
          default: Date.now
        },
        waittime: Number
    }],
    postcomments: [{
        url: String,
        relatedtag: String,
        date: {
          type: Date,
          default: Date.now
        },
        waittime: Number
    }],
    // relationship
    follower: Boolean,
    followof: Boolean,
    customerfollowedon: Date,
    noticedfollowedcustomeron: Date,
    followedcustomerbefore: Boolean
});

module.exports = mongoose.model('Handle', handleSchema);
