
$(function () {
    var socket = io();
    let recording = true;
    let coordinates = [];
    let myElement = document.getElementById('clickArea');
    let hammertime = new Hammer(myElement);
    setTimeout(fadeInstruction, 4000);
    bodyScrollLock.disableBodyScroll(myElement);

    hammertime.on('tap', (ev) => {
        console.log(ev);
        if (recording) {
            let coordinate = {
                x: ev.center.x,
                y: ev.center.y
            };
            let screenSize = {
                screenWidth: document.body.clientWidth,
                screenHeight: document.body.clientHeight
            };
            socket.emit('click', [coordinate, screenSize]);
            recording = false;
            setTimeout(resetRecordingState, 2000);
        }
    });

    function resetRecordingState() {
        recording = true;
    }

    function fadeInstruction() {
        $("#instruction").fadeOut();
    }
});