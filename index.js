var SerialPort = require("serialport").SerialPort;
var Twit = require('twit');

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

var tweets = [];
var current = 0;
var count;

function displayTweets() {
    sp.write([0xFE,0x58]);
    sp.write([0xFE,0x47,0x01,0x02]);
    sp.write("Tina tweets");

    displayTweet(tweets[current], done);
}

sp.on('open',function() {
    sp.on('data', function(data) {
        console.log('>>>>>', data);
    });

    T.get('statuses/user_timeline', {user_id: '612043406', count: 3} , function(err, data) {
        for (var i = 0; i < data.length ; i++) {
            console.log(data[i].text);
            tweets.push(data[i].text);
        }

        count = tweets.length-1;
        displayTweets();
    });


    //stream.on('tweet', function (tweet) {
    //    //console.log('');
    //    console.log(tweet.text + ' (' + tweet.user.screen_name  + ')');
    //    //console.dir(tweet);
    //    sp.write(tweet.text, function() {
    //        console.log('Serial write');
    //    });
    //    console.log('');
    //    //console.dir(tweet);
    //});
});

function displayTweet(tweet, done) {
    tweet += "                ";
    var index = 0;
    var max = tweet.length-16;
    displayPart(tweet, index, max, done);
}

function displayPart(tweet, index, max, done) {
    sp.write([0xFE,0x48]);
    sp.write(tweet.substr(index, 15));
    index++;
    if (index <= max) {
        setTimeout(displayPart, 300, tweet, index, max, done);
    } else {
        done();
    }
}

function done() {
    if (current >= count) {
        current = 0;
    } else {
        current++;
    }

    displayTweet(tweets[current], done);
}