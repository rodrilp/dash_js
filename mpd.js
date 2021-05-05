document.addEventListener("DOMContentLoaded", function () {
    init();
    var ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: '# of Votes',
                data: bufferArr,
            },
            {
                label: '# of Votes',
                data: bitrateArr,
            }],

        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

var myChart
var bitrateArr = []
var bufferArr = []


function init() {
    var video,
        player,
        mpd_url = "./stream.mpd";
    video = document.querySelector("video");
    player = dashjs.MediaPlayer().create();
    player.initialize(video, mpd_url, true);
    player.on(dashjs.MediaPlayer.events["PLAYBACK_ENDED"], function () {
        clearInterval(eventPoller);
    });

    var eventPoller = setInterval(function () {
        var streamInfo = player.getActiveStream().getStreamInfo();
        var dashMetrics = player.getDashMetrics();
        var dashAdapter = player.getDashAdapter();

        if (dashMetrics && streamInfo) {
            const periodIdx = streamInfo.index;
            var repSwitch = dashMetrics.getCurrentRepresentationSwitch('video', true);
            var bufferLevel = dashMetrics.getCurrentBufferLevel('video', true);
            var bitrate = repSwitch ? Math.round(dashAdapter.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000) : NaN;
            document.getElementById('buffer').innerText = bufferLevel + " secs";
            document.getElementById('bitrate').innerText = bitrate + " Kbps";
            document.getElementById('representation').innerText = repSwitch.to;

            console.log(myChart);
            //bitrateArr.push(bitrate);
            //bufferArr.push(bufferLevel);
            if (myChart !== undefined) {
                myChart.data.datasets[0].data.push(bitrate);
                myChart.data.datasets[1].data.push(bufferLevel);
                myChart.update();
            }

        }
    }, 500);
}

