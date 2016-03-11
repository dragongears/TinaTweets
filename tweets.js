var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Tweets = function(sp) {

    // we need to store the reference of `this` to `self`, so that we can use the current context in the setTimeout (or any callback) functions
    // using `this` in the setTimeout functions will refer to those functions, not the Tweets class
    var self = this;

    this.sp = sp;

    this.tweetList = [];
    this.current = 0;

    this.index = 0;
    this.max = 0;
};

// extend the EventEmitter class using our Tweets class
util.inherits(Tweets, EventEmitter);

// Return false if string contains a URL or is a retweet
Tweets.prototype.isUsable = function(text) {
    return (!new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(text)) && (text.indexOf("@tinatbh") == -1);
};

Tweets.prototype.sanitize = function(text) {
    return text.replace(/[\n\r]/g, ' ').replace(/…/g, '...').replace(/’/g, '\'').replace(/“/g, '"').replace(/”/g, '"');
};

Tweets.prototype.push = function(text) {
    this.tweetList.push(text);
};

Tweets.prototype.display = function() {
    this.sp.write([0xFE,0x58]);
    this.sp.write([0xFE,0x47,0x01,0x02]);
    this.sp.write("Tina tweets");

    this.displayTweet();
};

Tweets.prototype.displayTweet = function() {
    var color = [[255, 255, 0], [128, 128, 255], [255, 128, 128]];

    // Change color
    this.sp.write([0xFE,0xD0]);
    this.sp.write(color[this.current % 3]);
    //this.sp.write([255, 255, 255]);

    var tweet = this.tweetList[this.current];
    tweet += "                ";
    this.index = 0;
    this.max = tweet.length-16;
    this.displayPart(tweet, this.index, this.max);
};

Tweets.prototype.displayPart = function(tweet, index, max) {
    var func = this['displayPart'].bind(this);
    var timeout = index ? 300 : 1000 ;

    this.sp.write([0xFE,0x48]);
    this.sp.write(tweet.substr(index, 15));
    index++;
    if (index <= max) {
        setTimeout(func, timeout, tweet, index, max);
    } else {

        // if any tweets were pushed, bring total back down
        while (this.tweetList.length > 3) {
            this.tweetList.shift();
        }

        if (this.current >= this.tweetList.length-1) {
            this.current = 0;
        } else {
            this.current++;
        }

        this.emit('tweetDone', 'Tweet done!');
    }
};

// we specify that this module is a reference to the Tweets class
module.exports = Tweets;
