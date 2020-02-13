// let's get our document ready!
$(document).ready(function() {
    kittyClicker.init();
}); //end of document ready

const kittyClicker = {};

kittyClicker.init = function() {
    kittyClicker.loadAudio();
    kittyClicker.declareGlobal();
    kittyClicker.grabDOMElements();
    kittyClicker.checkScoreHistory();
    kittyClicker.listenUp();
} //end of init method

kittyClicker.loadAudio = function() {
    // let's load the music!
    kittyClicker.musicCatalogue = {};
    kittyClicker.musicCatalogue.music = new Audio('./assets/gameMusic.wav');
    kittyClicker.musicCatalogue.music.loop = true;
    kittyClicker.musicCatalogue.music.volume = 0.5;
    kittyClicker.musicCatalogue.chime = new Audio('./assets/endOfGame.wav');
    kittyClicker.musicCatalogue.chime.volume = 0.2;
    kittyClicker.musicCatalogue.clickAudio = new Audio('./assets/click.wav');
    kittyClicker.musicCatalogue.clickAudio.volume = 0.1;
    kittyClicker.musicCatalogue.bonusAudio = new Audio('./assets/bonusAudio.wav');
    kittyClicker.musicCatalogue.bonusAudio.volume = 0.5;
} //end of loadAudio

kittyClicker.declareGlobal = function() {
    kittyClicker.scoreCounter = 0;
    kittyClicker.timerCounter = 30;
} //end of declareGlobal

kittyClicker.grabDOMElements = function() {
    // let's grab some elements on the page!
    kittyClicker.$start = $('.start');
    kittyClicker.$startModal = $('.startModal');
    kittyClicker.$endModal = $('.endModal');
    kittyClicker.$timer = $('.timer');
    kittyClicker.$kitty = $('img');
    kittyClicker.$kittyContainer = $('.imgContainer');
    kittyClicker.$score = $('.score');
    kittyClicker.$finalScore = $('.finalScore');
    kittyClicker.$replay = $('.tryAgain');
    kittyClicker.$topScore = $('.topScore');
    kittyClicker.$volOn = $('.turnUp');
    kittyClicker.$volMute = $('.turnOff');
    kittyClicker.$bonus = $('.bonusContainer');
} //end of grabDOMElements

kittyClicker.checkScoreHistory = function() {
    // let's check if we've played this game before and load the top score!
    if (localStorage.length > 0) {
        kittyClicker.scoreHistory = localStorage.getItem('previousScore');
        kittyClicker.$topScore.html(`Top Score:<span></span> ${kittyClicker.scoreHistory}`);
    }
} //end of checkScoreHistory

kittyClicker.listenUp = function() {
    //attach some event listeners
    kittyClicker.$volMute.on('click', kittyClicker.volumeOff);
    kittyClicker.$volOn.on('click', kittyClicker.volumeOn);
    kittyClicker.$start.on('click', kittyClicker.runGame);
} //end of listenUp

kittyClicker.volumeOff = function() {
    if (!kittyClicker.musicCatalogue.music.muted) {
        kittyClicker.$volOn.css('color', 'black');
        kittyClicker.$volMute.css('color', 'rgba(0, 0, 0, 0.3)');
        for (let audioFile in kittyClicker.musicCatalogue) {
            kittyClicker.musicCatalogue[audioFile].muted = true;
        }
    }
} //end of vol off method

kittyClicker.volumeOn = function() {
    if (kittyClicker.musicCatalogue.music.muted) {
        kittyClicker.$volOn.css('color', 'rgba(0, 0, 0, 0.3)');
        kittyClicker.$volMute.css('color', 'black');
        for (let audioFile in kittyClicker.musicCatalogue) {
            kittyClicker.musicCatalogue[audioFile].muted = false;
        }
    }
} //end of vol on method

kittyClicker.getRandom = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
} //end of random num gen method

// clicker functionality
kittyClicker.iveBeenClicked = function() {
    // play noise
    kittyClicker.musicCatalogue.clickAudio.play();
    // update the score variable
    kittyClicker.scoreCounter++;
    //animate on event
    kittyClicker.$kittyContainer.toggleClass('animateClick');
    kittyClicker.updateScore();
} //end of iveBeenClicked method

kittyClicker.updateScore = function() {
    // update the score element with the score, taking into account the design of '00000' appearance
    // NOTE: I would've used .padStart() for this to avoid using if/else but it's not supported on IE :( bad IE
    if (kittyClicker.scoreCounter < 10) {
        kittyClicker.$score.text('0000' + kittyClicker.scoreCounter);
    } else if (kittyClicker.scoreCounter < 100) {
        kittyClicker.$score.text('000' + kittyClicker.scoreCounter);
    } else if (kittyClicker.scoreCounter < 1000) {
        kittyClicker.$score.text('00' + kittyClicker.scoreCounter);
    } else if (kittyClicker.scoreCounter < 10000) {
        kittyClicker.$score.text('0' + kittyClicker.scoreCounter);
    } else {
        kittyClicker.$score.text(kittyClicker.scoreCounter);
    }    
} //end of updateScore method

kittyClicker.eventDeterminator = function() {
    if (event.type === 'click' || event.keyCode === 32) {
        kittyClicker.iveBeenClicked();
    } else if (event.keyCode === 13) {
        if (kittyClicker.$bonus.css('display') === 'block') {
            kittyClicker.spinTheBonusWheel();
        }
    }
} //end of eventDeterminator method

kittyClicker.spinTheBonusWheel = function() {
    //play audio
    kittyClicker.musicCatalogue.bonusAudio.play();
    //on fire randomly determine bonus % bw a range
    const bonusPercent = kittyClicker.getRandom(1.2, 1.75);
    //apply determined bonus % on score
    kittyClicker.scoreCounter += kittyClicker.scoreCounter * bonusPercent;
    //hide the bonus item
    kittyClicker.$bonus.hide();
    kittyClicker.updateScore();
} //end of spin the bonus wheel method

kittyClicker.bonusMultiplier = function() {
    //every second randomly generate a number to determine if a bonus item will appear
    const bonusGenerator = Math.random();
    //if the determined range is generated
    if (bonusGenerator > .5 && bonusGenerator < .7) {
        //randomly generate img src html in div
        const imgGenerator = kittyClicker.getRandom(1, 9);
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
        kittyClicker.$bonus.html(`<img src="./assets/bonus/png/${imgGenerator}.png" alt="${altTag[imgGenerator]}">`);
        //randomly generate top: bottom: values for div css
        //show div
        //listen for events on div
        const bonusTop = kittyClicker.getRandom(0, 70); //in vh
        const bonusLeft = kittyClicker.getRandom(0, 320); //in px
        kittyClicker.$bonus.css({'top': bonusTop + 'vh', 'left': bonusLeft + 'px'}).show('slow').one('click', kittyClicker.spinTheBonusWheel);
        //close the div after 3 seconds if not clicked
        setTimeout(function() {
            if (kittyClicker.$bonus.css('display') === 'block') {
                kittyClicker.$bonus.hide().off();
            }
        }, 3000);
    }
} //end of bonus multiplier method

kittyClicker.setUpGame = function() {
    // reset img if needed
    if (kittyClicker.$kitty.attr('src') !== './assets/kitty.png') {
        kittyClicker.$kitty.attr('src', './assets/kitty.png');
    }

    // hide the start/end modal
    if (kittyClicker.$startModal.css("display") == 'block') {
        kittyClicker.$startModal.hide();
    } else if (kittyClicker.$endModal.css("display") == 'block') {
        kittyClicker.$endModal.hide();
    }

    // show the countdown timer
    kittyClicker.$timer.show();

    // show the score
    kittyClicker.$score.show();

    // animate the kitty
    kittyClicker.$kitty.addClass('animate');    

    // play the music
    kittyClicker.musicCatalogue.music.currentTime = 0;
    kittyClicker.musicCatalogue.music.play();
    
    // listen for clicks on the kitty
    kittyClicker.$kitty.on('click', kittyClicker.eventDeterminator);

    // listen for keypress events on the DOM - accessibility feature
    $(document).on('keyup', kittyClicker.eventDeterminator);
} //end of setUpGame method

kittyClicker.shutDown = function() {
    //close any bonus
    if (kittyClicker.$bonus.css('display') === 'block') {
        kittyClicker.$bonus.hide().off();
    }
    //animations turn off
    kittyClicker.$kitty.removeClass('animate');
    kittyClicker.$kittyContainer.removeClass('animateClick');
    //hide game area elements
    kittyClicker.$timer.hide();
    kittyClicker.$score.hide();
    // stop the music
    kittyClicker.musicCatalogue.music.pause();
    // stop listening for clicks on the kitty
    kittyClicker.$kitty.off();
    // stop listening for keydown on DOM
    $(document).off();
    // play ending chime
    kittyClicker.musicCatalogue.chime.play();
    //bring up the try again modal
    kittyClicker.$endModal.show('slow');
} //end of shutDown method

kittyClicker.resetGame = function() {
    //timer reset
    kittyClicker.$timer.text('00:30');
    kittyClicker.timerCounter = 30;
    //score reset
    kittyClicker.$score.text('00000');
    kittyClicker.scoreCounter = 0;
    // game replay! - buffer added to event listener fire to address bug with score carrying over when the replay button is pressed too soon
    setTimeout(function() {
        kittyClicker.$replay.one('click', kittyClicker.runGame);
    }, 3000);
    // turn off the timer
    clearInterval(kittyClicker.intervalTimer);
} //end of resetGame method

kittyClicker.setFinalScore = function() {
    //update the final score
    // NOTE: I would've used .padStart() for this to avoid using if/else but it's not supported on IE :( bad IE
    if (kittyClicker.scoreCounter < 10) {
        kittyClicker.$finalScore.text('0000' + kittyClicker.scoreCounter);
    } else if (kittyClicker.scoreCounter < 100) {
        kittyClicker.$finalScore.text('000' + kittyClicker.scoreCounter);
    } else if (kittyClicker.scoreCounter < 1000) {
        kittyClicker.$finalScore.text('00' + kittyClicker.scoreCounter);
    } else if (kittyClicker.scoreCounter < 10000) {
        kittyClicker.$finalScore.text('0' + kittyClicker.scoreCounter);
    } else {
        kittyClicker.$finalScore.text(kittyClicker.scoreCounter);
    }

    //update localStorage if it's a new top score and update the DOM
    if (localStorage.length === 0) {
        localStorage.setItem('previousScore', kittyClicker.scoreCounter);
        kittyClicker.scoreHistory = localStorage.getItem('previousScore');
        kittyClicker.$topScore.html(`Top Score:<span></span> ${kittyClicker.scoreHistory}`);
    } else if (localStorage.length === 1) {
        if (localStorage.getItem('previousScore') < kittyClicker.scoreCounter) {
            localStorage.setItem('previousScore', kittyClicker.scoreCounter);
            kittyClicker.scoreHistory = localStorage.getItem('previousScore');
            kittyClicker.$topScore.html(`Top Score:<span></span> ${kittyClicker.scoreHistory}`);
        }
    }
} //end of setFinalScore method

kittyClicker.countdownTimer = function() {
    // run the countdown timer 30s -> 0s
    kittyClicker.intervalTimer = setInterval(function() {
        //decrease timer
        kittyClicker.timerCounter--;
        // run the bonus multiplier check
        kittyClicker.bonusMultiplier();
        //determine what needs to be updated based on timer
        kittyClicker.countdownTimerUpdate();
    }, 1000);
} //end of countdownTimer method

kittyClicker.countdownTimerUpdate = function() {
    // update the timer element & stop it as well as everything else
    if (kittyClicker.timerCounter == -1) {
        kittyClicker.setFinalScore();
        kittyClicker.shutDown();
        kittyClicker.resetGame();
    } else if (kittyClicker.timerCounter === 15) {
        kittyClicker.$timer.text('00:' + kittyClicker.timerCounter);
        kittyClicker.$kitty.attr('src', './assets/kittyStateTwo.png');
    } else if (kittyClicker.timerCounter === 5) {
        kittyClicker.$timer.text('00:0' + kittyClicker.timerCounter);
        kittyClicker.$kitty.attr('src', './assets/kittyStateThree.png');
    } else if (kittyClicker.timerCounter < 10) {
        kittyClicker.$timer.text('00:0' + kittyClicker.timerCounter);
    } else {
        kittyClicker.$timer.text('00:' + kittyClicker.timerCounter);
    }
} //end of countdownTimerUpdate method

kittyClicker.runGame = function() {
    kittyClicker.setUpGame();
    kittyClicker.countdownTimer();
} //end of runGame method