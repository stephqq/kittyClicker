// let's get our document ready!
$(document).ready(function() {

    // let's declare some global variables!
    let scoreCounter = 0;
    let timerCounter = 30;
    
    // let's grab some elements on the page!
    const $start = $('.start');
    const $startModal = $('.startModal');
    const $endModal = $('.endModal');
    const $timer = $('.timer');
    const $kitty = $('img');
    const $score = $('.score');

    // game start!
    $start.on('click', function() {
        // hide the start modal
        $startModal.hide();
        // show the countdown timer
        $timer.show();
        // show the score
        $score.show();
        // run the countdown timer 30s -> 0s
        const intervalTimer = setInterval(function() {
            timerCounter--;
            // update the timer element & stop it
            if (timerCounter == -1) {
                $timer.hide();
                $score.hide();
                $endModal.show();
                clearInterval(intervalTimer);
            } else if (timerCounter < 10) {
                $timer.text('00:0' + timerCounter);
            } else {
                $timer.text('00:' + timerCounter);
            }
        }, 1000);
        // listen for clicks on the kitty
        $kitty.on('click', function() {
            // then update the score variable
            scoreCounter++;
            // then update the score element with the score, taking into account the design of '00000' appearance
            if (scoreCounter < 10) {
                $score.text('0000' + scoreCounter);
            } else if (scoreCounter < 100) {
                $score.text('000' + scoreCounter);
            } else if (scoreCounter < 1000) {
                $score.text('00' + scoreCounter);
            } else if (scoreCounter < 10000) {
                $score.text('0' + scoreCounter);
            } else {
                $score.text(scoreCounter);
            }
        });
    });


});