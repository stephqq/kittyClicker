// let's get our document ready!
$(document).ready(function() {

    // declare global variables!
    let scoreHistory = 0;

    // let's load the music!
    const music = new Audio('./assets/game-music.wav');
    const chime = new Audio('./assets/endOfGame.wav');
    const clickAudio = new Audio('./assets/click.wav');
    
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
    const $topScore = $('.topScore');
    const $volOn = $('.turnUp');
    const $volMute = $('.turnOff');

    // let's check if we've played this game before and load the top score!
    if (localStorage.length > 0) {
        scoreHistory = localStorage.getItem('previousScore');
        $topScore.html(`Top Score:<span></span> ${scoreHistory}`);
    }

    // volume mute
    $volMute.on('click', volumeOff);

    // volume on
    $volOn.on('click', volumeOn);

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

        // play the music
        music.loop = true;
        music.fastSeek(0);
        music.volume = 0.5;
        music.play();

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
                //update localStorage if it's a new top score and update the DOM
                if (localStorage.length === 0) {
                    localStorage.setItem('previousScore', scoreCounter);
                    scoreHistory = localStorage.getItem('previousScore');
                    $topScore.html(`Top Score:<span></span> ${scoreHistory}`);
                } else if (localStorage.length === 1) {
                    if (localStorage.getItem('previousScore') < scoreCounter) {
                        localStorage.setItem('previousScore', scoreCounter);
                        scoreHistory = localStorage.getItem('previousScore');
                        $topScore.html(`Top Score:<span></span> ${scoreHistory}`);
                    }
                }
                //bring up the try again modal
                $endModal.show('slow');
                // stop the music
                music.pause();
                // play ending chime
                chime.volume = 0.5;
                chime.play();
                // stop listening for clicks on the kitty
                $kitty.off();
                // stop listening for keydown on DOM
                $(document).off();
                // turn off the timer
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
                // play noise
                clickAudio.volume = 0.1;
                clickAudio.play();
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

    // volume off function
    function volumeOff() {
        $volOn.css('color', 'black');
        $volMute.css('color', 'rgba(0, 0, 0, 0.3)');
        music.muted = true;
        chime.muted = true;
        clickAudio.muted = true;
    } //end of vol off function

    // volume on function
    function volumeOn() {
        $volOn.css('color', 'rgba(0, 0, 0, 0.3)');
        $volMute.css('color', 'black');
        music.muted = false;
        chime.muted = false;
        clickAudio.muted = false;
    } //end of vol on function
}); //end of document ready