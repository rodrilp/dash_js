document.addEventListener("DOMContentLoaded", function () {
    init();
});



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

            if (myChart !== undefined) {

                if(myChart.data.datasets[0].data.length > 10){
                    myChart.data.datasets[0].data.shift();
                    myChart.data.datasets[1].data.shift();
                    myChart.data.labels.shift();
                }

                myChart.data.datasets[0].data.push(bitrate);
                myChart.data.datasets[1].data.push(bufferLevel);

                momentoActual = new Date();
                hora = momentoActual.getHours();
                minuto = momentoActual.getMinutes();
                segundo = momentoActual.getSeconds();
                horaImprimible = hora + " : " + (minuto < 10 ? "0" + minuto : minuto) + " : " + (segundo < 10 ? "0" + segundo : segundo);
                
                myChart.data.labels.push(horaImprimible);
                myChart.update();
            }

        }
    }, 1500)
}

