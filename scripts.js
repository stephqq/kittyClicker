// let's get our document ready!
$(document).ready(function() {

    // declare global variables!
    let scoreCounter = 0;
    let timerCounter = 30;
    let scoreHistory = 0;
    let bonusGenerator = 0;
    let bonusTop = 0;
    let bonusLeft = 0;
    let imgGenerator = 0;
    const altTag = {
        1: 'ball of yarn',
        2: 'pet comb',
        3: 'bowl of pet food',
        4: 'pet collar with bell',
        5: 'goldfish',
        6: 'yellow and red bird',
        7: 'yellow bow',
        8: 'string cat toy'
    };
    let bonusPercent = 0;

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
    const $bonus = $('.bonusContainer');

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
        // reset img if needed
        if ($kitty.attr('src') === './assets/kittyStateThree.png') {
            $kitty.attr('src', './assets/kitty.png');
        }

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
        music.currentTime = 0;
        music.volume = 0.5;
        music.play();

        // run the countdown timer 30s -> 0s
        const intervalTimer = setInterval(function() {
            timerCounter--;
            // run the bonus multiplier check
            bonusMultiplier();
            // update the timer element & stop it as well as everything else
            if (timerCounter == -1) {
                //close any bonus
                if ($bonus.css('display') === 'block') {
                    $bonus.hide();
                }
                //timer reset
                $timer.hide();
                $timer.text('00:30');
                timerCounter = 30;
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
                //reset the score
                scoreCounter = 0;
                // stop the music
                music.pause();
                // play ending chime
                chime.volume = 0.2;
                chime.play();
                // stop listening for clicks on the kitty
                $kitty.off();
                // stop listening for keydown on DOM
                $(document).off();
                // turn off the timer
                clearInterval(intervalTimer);
            } else if (timerCounter === 15) {
                $timer.text('00:' + timerCounter);
                $kitty.attr('src', './assets/kittyStateTwo.png');
            } else if (timerCounter === 5) {
                $timer.text('00:0' + timerCounter);
                $kitty.attr('src', './assets/kittyStateThree.png');
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
            } else if (event.keyCode === 13) {
                if ($bonus.css('display') === 'block') {
                    spinTheBonusWheel()
                }
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

    // bonus multiplier function
    function bonusMultiplier() {
        //every second randomly generate a number to determine if a bonus item will appear
        bonusGenerator = Math.random();
        //if the determined range is generated
        if (bonusGenerator > .5 && bonusGenerator < .7) {
            //randomly generate img src html in div
            imgGenerator = getRandom(1, 9);
            $bonus.html(`<img src="./assets/bonus/png/${imgGenerator}.png" alt="${altTag[imgGenerator]}">`);
            //randomly generate top: bottom: values for div css
            //show div
            //listen for events on div
            bonusTop = getRandom(0, 70); //in vh
            bonusLeft = getRandom(0, 320); //in px
            $bonus.css({'top': bonusTop + 'vh', 'left': bonusLeft + 'px'}).show('slow').one('click', spinTheBonusWheel);
            setTimeout(function() {
                if ($bonus.css('display') === 'block') {
                    $bonus.hide();
                }
            }, 3000);
        }
    } //end of bonus multiplier function

    //spin the bonus wheel function
    function spinTheBonusWheel() {
        //on fire randomly determine bonus % bw a range
        bonusPercent = getRandom(1.2, 1.75);
        //apply determined bonus % on score
        scoreCounter += scoreCounter * bonusPercent;
        $bonus.hide();
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
    } //end of spin the bonus wheel function

    // random number bw min max function
    function getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    } //end of random num gen function
}); //end of document ready
