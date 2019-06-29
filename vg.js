const elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'https://vg:Zz123456@tmone.xyz:9200',
    //log: 'trace'
});
const https = require('https');
var publicIP = {};

https.get('https://ipinfo.io/geo', (resp) => {
    var data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        try {
            publicIP = JSON.parse(data);
            publicIP.hostname = hostName;
        } catch (err) {

        }
    });
});
var saveModel = async function (data, callback) {

    var savePre = async function (strPredic) {
        var td = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000 + 3600000 * 7);
        var time = td.getTime();
        var yyyy = td.getFullYear();
        var mo = td.getMonth() + 1;
        var da = td.getDate();
        var hh = td.getHours();

        var body = Object.assign({
            id: time,
            prestr: strPredic,
            valid: false,
            time: time,
            year: yyyy,
            month: mo,
            date: da,
            hour: hh
        }, publicIP)

        client.index({
            index: "predicstime",
            type: "predicstime",
            id: time,
            body: body
        }, function (err, res) {
            if (err) {
                console.log(JSON.stringify(err));
            }
        });
    }
    savePre(data);
}
var lastHour = 1;
var runing = false;
var lastPredict = "";
function runrun() {
    if (runing) {
        return;
    }
    runing = true;
    var td = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000 + 3600000 * 7);

    var hr = td.getHours();
    if (lastHour) {
        if (lastHour == hr) {
            return;
        }
        if (hr % 2) {
            return;
        }
    }
    lastHour = hr;
    var tg = '0'.repeat(45).split('').map((x, i) => {
        return (i + 1).toString().padStart(2, 0);
    });
    var str = [];
    for (var i = 0; i < 6; i++) {
        var idx = Math.floor(Math.random() * tg.length);
        str.push(tg.splice(idx, 1));
    }
    lastPredict = str.sort().join(',');
    console.log(lastPredict)
    saveModel(lastPredict).then(function(){
        runing = false;
    });
}
runrun();
setInterval(runrun, 15 * 60 * 1000);