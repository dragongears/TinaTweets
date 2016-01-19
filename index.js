var SerialPort = require("serialport").SerialPort;
var Twit = require('twit');

var sp = new SerialPort("/dev/ttyACM0", {
    baudRate: 9600,
    rtscts: false
});

var T = new Twit({
    consumer_key:           '9Wv2ga7clMaym2XllEDWNYvFu'
    , consumer_secret:      'n39hsvmHVqJLbb8SkiE4XopVdZZduSRIer1pCSUBVjHBZ2zG3N'
    , access_token:         '68781907-hFadXB6VLuR7H6ePP5akPDrTBOIW561XFALF5AV5B'
    , access_token_secret:  'Mzz5IPNqUeFlhmi2TZcmU2A1IByKj2U8TPwr7iQxHLGqU'
});

var stream = T.stream('statuses/filter', {follow: '612043406'});

//T.get('statuses/user_timeline', {user_id: '612043406', count: 3} , function(err, data) {
//    for (var i = 0; i < data.length ; i++) {
//        console.log(data[i].text);
//    }
//});

sp.on('open',function() {
    sp.on('data', function(data) {
        console.log('>>>>>', data);
    });

    sp.write("\xFE\x58");

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
