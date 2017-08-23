var SerialPort = require("serialport");
var Twit = require('twit');
var Tweets = require('./tweets.js');

var sp = new SerialPort("/dev/ttyACM0", {
    baudRate: 115200
});

var T = new Twit({
    consumer_key:           '9Wv2ga7clMaym2XllEDWNYvFu'
    , consumer_secret:      'n39hsvmHVqJLbb8SkiE4XopVdZZduSRIer1pCSUBVjHBZ2zG3N'
    , access_token:         '68781907-hFadXB6VLuR7H6ePP5akPDrTBOIW561XFALF5AV5B'
    , access_token_secret:  'Mzz5IPNqUeFlhmi2TZcmU2A1IByKj2U8TPwr7iQxHLGqU'
});

var stream = T.stream('statuses/filter', {follow: '612043406'});

var tweets = new Tweets(sp);
console.dir(tweets);

tweets.on('tweetDone', function() {
    //console.log('tweetDone!');
    var func = tweets.displayTweet.bind(tweets);
    setTimeout(func, 3);
});

// Open serial port
sp.on('open',function() {

    // Data from serial (should never happen)
    sp.on('data', function(data) {
        console.log('>>>>>', data);
    });


    // Get some tweets to start
    T.get('statuses/user_timeline', {user_id: '612043406', count: 20} , function(err, data) {
        var arr = [];

        // Filter out tweets with URLs
        arr = data.filter(function(tweet){
            return tweets.isUsable(tweet.text);
        });

        // Take only the three most recent tweets
        arr = arr.slice(arr.length - 3);

        arr.forEach(function (dataElement) {
            console.log(dataElement.text);
            tweets.push(tweets.sanitize(dataElement.text));
        });

        tweets.display(sp);

    });

    // Add new tweets
    stream.on('tweet', function (tweet) {
        if (tweets.isUsable(tweet.text)) {
            tweets.push(tweets.sanitize(tweet.text));

            console.log(tweet.text);
        }
    });

});
