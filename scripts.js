// let's get our document ready!
$(document).ready(function() {
    kittyClicker.init();
}); //end of document ready

const userCollection = firebase.database().ref('/users');
const kittyClicker = {};

kittyClicker.init = function() {
    kittyClicker.getData();
    kittyClicker.loadAudio();
    kittyClicker.declareGlobal();
    kittyClicker.grabDOMElements();
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
    kittyClicker.$selectModal = $('.selectModal');
    kittyClicker.$timer = $('.timer');
    kittyClicker.$charSelect = $('.selectMe');
    kittyClicker.$kittyContainer = $('.imgContainer');
    kittyClicker.$score = $('.score');
    kittyClicker.$finalScore = $('.finalScore');
    kittyClicker.$replay = $('.tryAgain');
    kittyClicker.$topScore = $('.topScore');
    kittyClicker.$volOn = $('.turnUp');
    kittyClicker.$volMute = $('.turnOff');
    kittyClicker.$bonus = $('.bonusContainer');
    kittyClicker.$submit = $('.submitName');
    kittyClicker.$submitModal = $('.helloModal');
    kittyClicker.$leaderboard = $('.leaderboards ul');
} //end of grabDOMElements

kittyClicker.checkScoreHistory = function() {
    // let's check if we've played this game before and load the top score!
    //we need to get the hash assigned to the user as well for score updating
    for (let i = 0; i < kittyClicker.sortedDataArray.length; i++) {
        if (kittyClicker.sortedDataArray[i].name === kittyClicker.username && kittyClicker.sortedDataArray[i].identifier === kittyClicker.useridentifier) {
            kittyClicker.$topScore.html(`Top Score:<span></span> ${kittyClicker.sortedDataArray[i].score}`);
            kittyClicker.userScore = kittyClicker.sortedDataArray[i].score;
            kittyClicker.userHash = kittyClicker.sortedDataArray[i].hash;
        }
    }

    //old localstorage way
    // if (localStorage.length > 0) {
    //     kittyClicker.scoreHistory = localStorage.getItem('previousScore');
    //     kittyClicker.$topScore.html(`Top Score:<span></span> ${kittyClicker.scoreHistory}`);
    // }
} //end of checkScoreHistory

kittyClicker.getData = function() {
    //there must be an easier way to do this but we haven't learned yet so this is what my logic told me to do
    userCollection.on('value', (data) => {
        //clear leaderboard bc this listener re-appends to list
        kittyClicker.$leaderboard.html('');
        let userInfo = data.val();
        kittyClicker.dataArray = [];
        for (let key in userInfo) {
            kittyClicker.dataArray.push({hash: key, name: userInfo[key].name, score: userInfo[key].score, identifier: userInfo[key].identifier});
        }
        function compare(a, b) {
            const aa = a.score;
            const bb = b.score;
            let comparison = 0;
            if (aa > bb) {
                comparison = -1;
            } else if (aa < bb) {
                comparison = 1;
            }
            return comparison;
        };
        kittyClicker.sortedDataArray = kittyClicker.dataArray.sort(compare);
        //post max 15 results, if less than 15 in db then exit
        for (let i = 0; i < 16; i++) {
            if (kittyClicker.sortedDataArray[i] === undefined) {
                return;
            } else {
                kittyClicker.$leaderboard.append(`<li>${kittyClicker.sortedDataArray[i].name}, ${kittyClicker.sortedDataArray[i].score}</li>`);
            }
        }
    });
}

kittyClicker.listenUp = function() {
    //attach some event listeners
    kittyClicker.$volMute.on('click', kittyClicker.volumeOff);
    kittyClicker.$volOn.on('click', kittyClicker.volumeOn);
    kittyClicker.$submit.one('click', kittyClicker.submitName);
    kittyClicker.$charSelect.one('click', kittyClicker.assignCharacter);
    kittyClicker.$start.on('click', kittyClicker.runGame);
} //end of listenUp

kittyClicker.submitName = function(e) {
    e.preventDefault();
    kittyClicker.username = $('input#name').val();
    kittyClicker.useridentifier = $('input#identifier').val();
    kittyClicker.checkScoreHistory();
    kittyClicker.$submitModal.hide();
    kittyClicker.$selectModal.show();
    kittyClicker.$charSelect[0].focus();
}

kittyClicker.assignCharacter = function(e) {
    e.preventDefault();
    //if-else to determine if the img was clicked by a mouse or if the a was clicked with the keyboard [accessibility]
    if (e.target.nodeName === 'IMG') {
        kittyClicker.$kittyContainer.html(`<img src="${e.target.src}" class="kitty" alt="${e.target.alt}">`);
        kittyClicker.kittyURL = e.target.src;
    } else {
        kittyClicker.$kittyContainer.html(`<img src="${e.target.firstChild.src}" class="kitty" alt="${e.target.firstChild.alt}">`);
        kittyClicker.kittyURL = e.target.firstChild.src;
    }
    kittyClicker.$kitty = $('.kitty');
    kittyClicker.$selectModal.hide();
    kittyClicker.$startModal.show();
    kittyClicker.$start.focus();
}

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
    kittyClicker.$kitty.toggleClass('animateClick');
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
    if (kittyClicker.$kitty.attr('src').includes('State2') || kittyClicker.$kitty.attr('src').includes('State3')) {
        kittyClicker.$kitty.attr('src', kittyClicker.kittyURL);
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
    kittyClicker.$kittyContainer.addClass('animate');    

    // play the music
    kittyClicker.musicCatalogue.music.currentTime = 0;
    kittyClicker.musicCatalogue.music.play();
    
    // listen for clicks on the kitty
    kittyClicker.$kittyContainer.on('click', kittyClicker.eventDeterminator);

    // listen for keypress events on the DOM - accessibility feature
    $(document).on('keyup', kittyClicker.eventDeterminator);
} //end of setUpGame method

kittyClicker.shutDown = function() {
    //close any bonus
    if (kittyClicker.$bonus.css('display') === 'block') {
        kittyClicker.$bonus.hide().off();
    }
    //animations turn off
    kittyClicker.$kittyContainer.removeClass('animate');
    kittyClicker.$kitty.removeClass('animateClick');
    //hide game area elements
    kittyClicker.$timer.hide();
    kittyClicker.$score.hide();
    // stop the music
    kittyClicker.musicCatalogue.music.pause();
    // stop listening for clicks on the kitty
    kittyClicker.$kittyContainer.off();
    // stop listening for keydown on DOM
    $(document).off();
    // play ending chime
    kittyClicker.musicCatalogue.chime.play();
    //bring up the try again modal
    kittyClicker.$endModal.show('slow');
    kittyClicker.$replay.focus();
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
    //update the final score on DOM
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

    //update database and DOM with score
    if (kittyClicker.userScore === undefined) {
        userCollection.push({name: kittyClicker.username, score: kittyClicker.scoreCounter, identifier: kittyClicker.useridentifier});
        kittyClicker.userScore = kittyClicker.scoreCounter;
        kittyClicker.$topScore.html(`Top Score:<span></span> ${kittyClicker.userScore}`);
        //we need to obtain the generated userHash
        for (let i = 0; i < kittyClicker.sortedDataArray.length; i++) {
            if (kittyClicker.sortedDataArray[i].name === kittyClicker.username && kittyClicker.sortedDataArray[i].identifier === kittyClicker.useridentifier) {
                kittyClicker.userHash = kittyClicker.sortedDataArray[i].hash;
            }
        }
    } else if (kittyClicker.userScore < kittyClicker.scoreCounter) {
        firebase.database().ref(`/users/${kittyClicker.userHash}`).set({score: kittyClicker.scoreCounter});
        kittyClicker.userScore = kittyClicker.scoreCounter;
        kittyClicker.$topScore.html(`Top Score:<span></span> ${kittyClicker.userScore}`);
    }

    //OLD WAY - update localStorage if it's a new top score and update the DOM
    // if (localStorage.length === 0) {
    //     localStorage.setItem('previousScore', kittyClicker.scoreCounter);
    //     kittyClicker.scoreHistory = localStorage.getItem('previousScore');
    //     kittyClicker.$topScore.html(`Top Score:<span></span> ${kittyClicker.scoreHistory}`);
    // } else if (localStorage.length === 1) {
    //     if (localStorage.getItem('previousScore') < kittyClicker.scoreCounter) {
    //         localStorage.setItem('previousScore', kittyClicker.scoreCounter);
    //         kittyClicker.scoreHistory = localStorage.getItem('previousScore');
    //         kittyClicker.$topScore.html(`Top Score:<span></span> ${kittyClicker.scoreHistory}`);
    //     }
    // }
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
        if (kittyClicker.$kitty.attr('src').includes('-1')) {
            kittyClicker.$kitty.attr('src', './assets/kittyState2-1.png');
        } else if (kittyClicker.$kitty.attr('src').includes('-2')) {
            kittyClicker.$kitty.attr('src', './assets/kittyState2-2.png');
        } else if (kittyClicker.$kitty.attr('src').includes('-3')) {
            kittyClicker.$kitty.attr('src', './assets/kittyState2-3.png');
        }
    } else if (kittyClicker.timerCounter === 5) {
        kittyClicker.$timer.text('00:0' + kittyClicker.timerCounter);
        if (kittyClicker.$kitty.attr('src').includes('-1')) {
            kittyClicker.$kitty.attr('src', './assets/kittyState3-1.png');
        } else if (kittyClicker.$kitty.attr('src').includes('-2')) {
            kittyClicker.$kitty.attr('src', './assets/kittyState3-2.png');
        } else if (kittyClicker.$kitty.attr('src').includes('-3')) {
            kittyClicker.$kitty.attr('src', './assets/kittyState3-3.png');
        }
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