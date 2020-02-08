// let's get our document ready!
$(document).ready(function() {
    
    // let's grab some elements on the page!
    const $start = $('.start');
    const $startModal = $('.startModal');
    const $endModal = $('.endModal');
    const $timer = $('.timer');
    const $kitty = $('img');
    const $kittyContainer = $('.imgContainer');
    const $score = $('.score');
    const $finalScore = $('.finalScore');
    const $replay = $('.tryAgain');

    // game start!
    $start.on('click', runGame);

    // game replay!
    $replay.on('click', runGame);

    // run game function
    function runGame() {
        let scoreCounter = 0;
        let timerCounter = 30;

        // hide the start/end modal
        if ($startModal.css("display") == 'block') {
            $startModal.hide();
        } else if ($endModal.css("display") == 'block') {
            $endModal.hide();
        }

        // show the countdown timer
        $timer.show();

        // show the score
        $score.show();

        // animate the kitty
        $kitty.addClass('animate');

        // run the countdown timer 30s -> 0s
        const intervalTimer = setInterval(function() {
            timerCounter--;
            // update the timer element & stop it as well as everything else
            if (timerCounter == -1) {
                //timer reset
                $timer.hide();
                $timer.text('00:30');
                //score reset
                $score.hide();
                $score.text('00000');
                //animations turn off
                $kitty.removeClass('animate');
                $kittyContainer.removeClass('animateClick');
                //update the final score
                if (scoreCounter < 10) {
                    $finalScore.text('0000' + scoreCounter);
                } else if (scoreCounter < 100) {
                    $finalScore.text('000' + scoreCounter);
                } else if (scoreCounter < 1000) {
                    $finalScore.text('00' + scoreCounter);
                } else if (scoreCounter < 10000) {
                    $finalScore.text('0' + scoreCounter);
                } else {
                    $finalScore.text(scoreCounter);
                }
                $endModal.show('slow');
                // stop listening for clicks on the kitty
                $kitty.off();
                // stop listening for keydown on DOM
                $(document).off();
                clearInterval(intervalTimer);
            } else if (timerCounter < 10) {
                $timer.text('00:0' + timerCounter);
            } else {
                $timer.text('00:' + timerCounter);
            }
        }, 1000);

        // listen for clicks on the kitty
        $kitty.on('click', kittyClicker);

        // listen for keypress events on the DOM - accessibility feature
        $(document).on('keyup', kittyClicker);

        // kitty clicker function tied to event listeners
        function kittyClicker() {
            if (event.type === 'click') {
                iveBeenClicked();
            } else if (event.keyCode === 32) {
                iveBeenClicked();
            }
            // clicker functionality
            function iveBeenClicked() {
                // update the score variable
                scoreCounter++;
                // update the score element with the score, taking into   account the design of '00000' appearance
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
                //animate on event
                $kittyContainer.toggleClass('animateClick');
            } //end of iveBeenClicked function

        } //end of kittyClicker function
    } //end of runGame function
}); //end of document ready