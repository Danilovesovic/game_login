// dinamican array slika ..............................................................
var allImages = ['facebook', 'google-plus', 'pinterest', 'instagram', 'deviantart', 'flickr', 'swarm', 'tumblr', 'soundcloud'];
if (localStorage.level) {
    var level = parseInt(localStorage.level);
    console.log(level);
} else {
    var level = 1;
}
setGoalByLevel(level);
var reloadBtn = $('#reload');
var progress = $('.procent');
var metch = $('#metch')[0];
var metch2 = $('#metch2')[0];
var timeUp = $('#timeUp')[0];
var startBtn = $('#start');
var infoDiv = $('.infoHolder');
var fbIcon = $('#fbCount');
var swIcon = $('#swCount');
var pinIcon = $('#pinCount');
var flIcon = $('#flCount');
var devIcon = $('#devCount');
var instIcon = $('#instCount');
var tumIcon = $('#tumCount');
var googleIcon = $('#googleCount');
var soundIcon = $('#soundCount');
var fbCounter;
var swCounter;
var pinCounter;
var flCounter;
var devCounter;
var instCounter;
var tumCounter;
var googleCounter;
var soundCounter;
var progressHeight = 0;
if (localStorage.canReload) {
    var canReload = localStorage.canReload;
    if(canReload == "true"){
        reloadBtn.addClass('active-reload');
    }
} else {
    var canReload = false;
};
setAllSpans();
setProgressBar();
reloadBtn.on('click', shuffleIcons);

function setProgressBar() {
    // ovde cu i da ostavim klasu reloadu ako je true u localSto......

    if (localStorage.progress) {
        progressHeight = parseInt(localStorage.progress);
    } else {
        progressHeight = 0;
    }
    progress.animate({
        height: '+=' + progressHeight
    }, 300)
}

function setAllSpans() {
    fbIcon.html(fbCounter);
    swIcon.html(swCounter);
    pinIcon.html(pinCounter);
    flIcon.html(flCounter);
    devIcon.html(devCounter);
    instIcon.html(instCounter);
    tumIcon.html(tumCounter);
    googleIcon.html(googleCounter);
    soundIcon.html(soundCounter);
}
infoDiv.animate({
        top: '+=500'
    },
    200,
    function() {
        /* stuff to do after animation is complete */
    });
infoDiv.on('click', function() {
    $(this).animate({
            top: '-=500'
        },
        200,
        function() {
            $(this).css('display', 'none');
        });
});

// sve kolone ....................................
var cols = $('.col');
createBoxes(); // prvo zovemo da se popune ikonice
// selektujemo sve ikonice
var allBoxes = $('.box');
// svim ikonicama dajemo klikove
allBoxes.on('click', checkSiblings);

function createBoxes() { // kreiramo ikonice
    var counter = 0;
    var boxesArray = [];
    for (var i = 0; i < 50; i++) {
        var rand = Math.floor(Math.random() * allImages.length);
        boxesArray.push('<div class="box"><img src="images/' + allImages[rand] + '.png" /></div>');
    };
    for (var i = 0; i < cols.length; i++) {
        for (var x = 0; x < 10; x++) {
            var newBox = $(boxesArray[counter]);
            newBox.css('top', x * 50);
            $(cols[i]).append(newBox);
            counter++;
        };
    };
}

function checkSiblings() {
    var self = $(this);

    var thisIndex = self.index(); // index el na kog smo kliknuli
    var thisParent = self.parent(); // njegov roditelj
    var thisParentIndex = thisParent.index(); // roditeljev index
    var centerImage = self.find('img').attr('src'); // uzimamo ime src slike
    if (centerImage == "images/gold-cup.png") {
        level++;
        startLevel(level);
    }
    var startingMathes = [self];
    // prvi gore
    if (matchImages(self.prev(), centerImage)) {
        startingMathes.push(self.prev());
    }
    //prvi dole
    if (matchImages(self.next(), centerImage)) {
        startingMathes.push(self.next());
    }
    //prvi levo
    if (thisParentIndex !== 0) {
        var prevCol = thisParent.prev();
        var prevEl = prevCol.find('.box').eq(thisIndex);
        if (matchImages(prevEl, centerImage)) {
            startingMathes.push(prevEl)
        }
    }
    //prvi desno
    if (thisParentIndex !== 4) {
        var nextCol = thisParent.next();
        var nextEl = nextCol.find('.box').eq(thisIndex);
        if (matchImages(nextEl, centerImage)) {
            startingMathes.push(nextEl)
        }
    }
    // Svim elementima iz areja dati klasu selected
    $(startingMathes).each(function(i, e) {
            $(e).addClass('selected');
        })
        //pokrecemo pretragu u obliku x za svaki selektovani el
    console.clear()

    expandSearch(startingMathes)
    console.log(startingMathes);
}

function expandSearch(startingMathes) {
    var newArraySelected = [true];
    $(startingMathes).each(function(i, el) { // za svaki od prvobitnih iz x-a

            if (i > 0) { // ne treba nam prosli centralni
                var thisIndex = $(el).index();
                var thisParentIndex = $(el).parent().index();
                var centerImage = $(el).find('img').attr('src');
                var prevEl = $(el).prev();
                var nextEl = $(el).next();
                // prvi gore
                if (matchImages(prevEl, centerImage) && !prevEl.hasClass('selected')) {
                    newArraySelected.push(prevEl);
                }
                // prvi dole
                if (matchImages(nextEl, centerImage) && !nextEl.hasClass('selected')) {
                    newArraySelected.push(nextEl);
                }
                //prvi levo
                if (thisParentIndex !== 0) {
                    var prevCol = $(el).parent().prev();
                    var prevEl = prevCol.find('.box').eq(thisIndex);
                    if (matchImages(prevEl, centerImage) && !prevEl.hasClass('selected')) {
                        newArraySelected.push(prevEl)
                    }
                }
                //prvi desno
                if (thisParentIndex !== 4) {
                    var nextCol = $(el).parent().next();
                    var nextEl = nextCol.find('.box').eq(thisIndex);
                    if (matchImages(nextEl, centerImage) && !nextEl.hasClass('selected')) {
                        newArraySelected.push(nextEl)
                    }
                }
            }
        }) // end forEach

    $(newArraySelected).each(function(i, el) {
        $(el).addClass('selected')
    })
    if (newArraySelected.length > 1) { // ako ima bar jos jedna selektovana iz osnovnog x-a ponovo search x
        expandSearch(newArraySelected);
    } else {
        slideNewOnes();
    }
}

function slideNewOnes() {
    var selected = $('.selected');
    if (selected.length > 1) {
        updateCounters(selected); // srediti spanove svavke ikonice
    }

    // obrisati sve sa klasom selected .......
    if (selected.length > 1) {
        (selected.length > 3) ? metch2.play(): metch.play();
        selected.each(function(index, el) {
            $(el).find('img').addClass('animated tada');
        });
        selected.fadeTo(500, 0, function() {
            selected.remove();
        });

        // .................Dodati nove boxeve svakoj koloni............................................
        $('.col').each(function(i, e) {
            var counter = 0;
            var colSelected = $(e).find('.selected');
            colSelected.each(function(index, element) {
                var rand = Math.floor(Math.random() * allImages.length);
                if (allImages[rand]) {
                    var newBox = $('<div class="box"><img src="images/' + allImages[rand] + '.png" /></div>');
                } else {
                    var newBox = $('<div class="box"><img src="images/gold-cup.png" /></div>');
                }
                newBox.on('click', checkSiblings);
                counter -= 50;
                newBox.css({
                    top: counter
                });
                $(e).prepend(newBox);

            })

        })

        selected.each(function(i, e) {
            $(e).prevAll('.box').animate({
                top: '+=50'
            }, 70)

        })

    } else {
        selected.removeClass('selected');
    }
}

function matchImages(el, img) {
    if (el.find('img').attr('src') == img) {
        return true;
    } else {
        return false;
    };
}

function updateCounters(selected) {
    // nova logika ......
    var points = 0;
    if (selected.length == 2) {
        points = 2;
    };
    if (selected.length == 3) {
        points = 3;
    };
    if (selected.length == 4) {
        points = 5
    }
    if (selected.length == 5) {
        points = 7;
    }
    if (selected.length == 6) {
        points = 10;
    }
    if (selected.length == 7) {
        points = 12;
    }
    if (selected.length > 7) {
        points = selected.length * 2;
    }
    //update progress bar

    progress.animate({
        height: '+=' + points
    }, 300)
    progressHeight += points;
    console.log(progressHeight);
    if (progressHeight > 548) {
        progressHeight = 0;
         progress.animate({
        height: 0
    }, 300)
         localStorage.progress = 0;
        enableReloadBtn();
    };

    var imgSrc = selected.eq(0).find('img').attr('src');
    switch (imgSrc) {
        case "images/facebook.png":
            fbCounter = fbCounter - points;
            if (fbCounter <= 0) {
                magicChange(imgSrc);
            }
            break;
        case "images/swarm.png":
            swCounter = swCounter - points;
            if (swCounter <= 0) {
                magicChange(imgSrc);
            }
            break;
        case "images/pinterest.png":
            pinCounter = pinCounter - points;
            if (pinCounter <= 0) {
                magicChange(imgSrc);
            }
            break;
        case "images/flickr.png":
            flCounter = flCounter - points;
            if (flCounter <= 0) {
                magicChange(imgSrc);
            }
            break;
        case "images/deviantart.png":
            devCounter = devCounter - points;
            if (devCounter <= 0) {
                magicChange(imgSrc);
            }
            break;
        case "images/tumblr.png":
            tumCounter = tumCounter - points;
            if (tumCounter <= 0) {
                magicChange(imgSrc);
            }
            break;
        case "images/instagram.png":
            instCounter = instCounter - points;
            if (instCounter <= 0) {
                magicChange(imgSrc);
            }
            break;
        case "images/google-plus.png":
            googleCounter = googleCounter - points;
            if (googleCounter <= 0) {
                magicChange(imgSrc);
            }
            break;
        case "images/soundcloud.png":
            soundCounter = soundCounter - points;
            if (soundCounter <= 0) {
                magicChange(imgSrc);
            }
            break;
    }
    fbIcon.html(fbCounter);
    swIcon.html(swCounter);
    pinIcon.html(pinCounter);
    flIcon.html(flCounter);
    devIcon.html(devCounter);
    instIcon.html(instCounter);
    tumIcon.html(tumCounter);
    googleIcon.html(googleCounter);
    soundIcon.html(soundCounter);

    // .....end nova logika ...........

}

function magicChange(image) {
    if (image) {
        var trueImageSource = image.replace('images/', "").replace('.png', "");
        if (allImages.indexOf(trueImageSource) != -1) {
            var imageIndex = allImages.indexOf(trueImageSource);
            allImages.splice(imageIndex, 1);
            var rand = Math.floor(Math.random() * allImages.length);
            var newImage = allImages[rand];
            $('.box').find('img').each(function(i, e) {
                if ($(e).attr('src') === image) {
                    $(e).fadeTo(400, 0.1, function() {
                        $(e).attr('src', 'images/' + newImage + '.png');
                        $(e).fadeTo(400, 1);
                    });
                }
            })
        };

    }
}

function startLevel(level) {
    localStorage.level = level++;;
    localStorage.progress = progressHeight;
    location.reload();
}

function setGoalByLevel(level) {
    fbCounter = 10 * level;
    swCounter = 10 * level;
    pinCounter = 10 * level;
    flCounter = 10 * level;
    devCounter = 10 * level;
    instCounter = 10 * level;
    tumCounter = 10 * level;
    googleCounter = 10 * level;
    soundCounter = 10 * level;
}

function enableReloadBtn() {
    reloadBtn.addClass('active-reload');
    localStorage.canReload = true;
}

function shuffleIcons() {
    if (canReload == 'true') {
        reloadBtn.removeClass('active-reload');
        localStorage.canReload = false;
        $('.box').remove();
        createBoxes();
        $('.box').on('click', checkSiblings);
    };

}