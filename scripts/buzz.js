
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  $(document).ready(function() {
    $(".new-bee-trigger").click(function() {
        controller.MakeNewBee();
    });

    $("body .bee").on("mouseenter", function() {
        console.log("ouch")
    })
  });

var beeCounter = 0;
var noiseCounter = 0;

const turningLeft = 1;
const goingStraight = 2;
const turningRight = 3;


function FadeStuff() {
    $(".fadeMe").each(function() {
        var opacity = $(this).css("opacity");
        opacity -= 0.2;
        if(opacity==0) {
            $(this).remove();
        } else {
            $(this).css({ opacity: opacity });
        }
    });

    setTimeout(FadeStuff,200);
}
FadeStuff();

var BeeModel = function() {

    var self = this;

    self.position = {x : 100, y : 100};
    self.currentAngle = 45;
    self.turningOrStraight = goingStraight;
    self.id = "";
    self.fullId = "";

    self.phrases = ["buzzzzzzz ","zzzzzzzzz ","buzz ","bbbzzzzzzzzzzzzzz "];
    self.currentPhrase = "buzzzzzzz ";
    self.phraseIndex = 0;

    self.UpdateVisualLocation = function() {
        $(self.fullId).css({ left: self.position.x, top: self.position.y });
        $(self.fullId).css({ transform: "rotate("+self.currentAngle+"deg)" });
    };



    /*
    generate a buzz trail of text behind the bee
    */
    self.MakeNoise = function() {
        let output = "";

        output = self.currentPhrase[self.phraseIndex];

        noiseCounter += 1;
        let noiseId = "noise" + noiseCounter;
        let noiseHtml = "<div class='sound' id='"+noiseId+"' style='transform: rotate("+self.currentAngle+"deg); left : "+self.position.x+"px; top: "+self.position.y+"px'>"+output+"</div>";
        
        // this is a lazy way to put the noise slightly behind the bee
        setTimeout(function() { $("body").append(noiseHtml); }, 300);
        setTimeout(function() { 
            // after some time put in a class indicating this element can start fading out
             $("#"+noiseId).addClass("fadeMe");
        }, 5000);
        

        self.phraseIndex += 1;
        if(self.phraseIndex >= self.currentPhrase.length) {
            // we've completed the current phrase, let's get a new one!
            let newIndex = randomIntFromInterval(0,self.phrases.length -1);
            self.currentPhrase = self.phrases[newIndex];
            self.phraseIndex = 0;
        }
    };
    
    self.Move = function() {
        const movementLength = 3;
        // move forward based on our current angle
        let theta_radians = (self.currentAngle) * (Math.PI/180);

        // what is the adjacent (X)
        let adjacent = Math.cos(theta_radians) * movementLength;
        // what is the opposite (Y)
        let opposite = Math.sin(theta_radians) * movementLength;

        self.position.x = self.position.x + adjacent;
        self.position.y = self.position.y + opposite;

        self.UpdateVisualLocation();
    };
    /*
    This methods decides if the bee wants to change direction - we try to keep doing whatever the bee is currently doing
    e.g. if it is turning left then there is a 90% change it will keep doing that
    */
    self.MaybeChangeDirection = function() {
        const angleChange = 5;    // how much do we turn by in degrees
        // mostly stick to the direction we're going in
        let keepDoingWhatWereDoing = randomIntFromInterval(1,100);
        if(keepDoingWhatWereDoing <= 90) {
            // we're going to keep doing what we're doing, so if we're turning then change the angle some more
            if(self.turningOrStraight === turningLeft) {
                self.currentAngle -= angleChange;
            } else if (self.turningOrStraight === turningRight) {
                self.currentAngle += angleChange;
            }
        } else {
            // ok, we're going to change direction
            // we have the three values 1,2,3 for turningOrStraight which represent left, straight, right
            // we either set out turningOrStraight to plus one or minus one, then if it is outside of the values 1 to 3 we correct it
            let directionChange= randomIntFromInterval(0,1);
            if(directionChange === 0) {
                self.turningOrStraight -= 1;
            } else {
                self.turningOrStraight += 1;
            }
            if(self.turningOrStraight < 1) {
                self.turningOrStraight = 3;
            }
            if(self.turningOrStraight > 3) {
                self.turningOrStraight = 1;
            }
        }

    };
    // self.MoveLoop = function() {
    //     self.MaybeChangeDirection();
    //     self.Move();
    //     setTimeout(self.MoveLoop, 100);
    // };
    // self.MoveLoop();
    // self.NoiseLoop = function() {
    //     self.MakeNoise();
    //     setTimeout(self.NoiseLoop, 300);
    // };
    // setTimeout(self.NoiseLoop, 300);    // start making noise after a little pause

    self.Initialize = function() {
        beeCounter += 1;
        self.id = "bee"+ beeCounter;
        self.fullId = "#"+self.id;

        let x = randomIntFromInterval(50,$(document).width()-50);
        let y = randomIntFromInterval(50,$(document).height()-50);
        self.position.x = x;
        self.position.y = y;
        self.currentAngle = randomIntFromInterval(0,360);

        let beeHtml = "<div class='bee' id='"+self.id+"'>bee</div>";
        $("body").append(beeHtml);
        self.UpdateVisualLocation();
        console.log("created bee "+beeCounter)
    };
    self.Initialize();

};

var BeeController = function() {
    var self = this;

    self.bees = [];

    self.MakeNewBee = function() {
        var newBee = new BeeModel();
        self.bees.push(newBee);
    }

    // start with five
    self.MakeNewBee();
    self.MakeNewBee();
    self.MakeNewBee();
    self.MakeNewBee();
    self.MakeNewBee();

    self.MoveLoop = function() {
        for(let i = 0; i < self.bees.length; i++) {
            self.bees[i].MaybeChangeDirection();
            self.bees[i].Move();
        }
        setTimeout(self.MoveLoop, 100);
    };
    self.MoveLoop();
    self.NoiseLoop = function() {
        for(let i = 0; i < self.bees.length; i++) {
            self.bees[i].MakeNoise();
        }
        setTimeout(self.NoiseLoop, 300);
    };
    setTimeout(self.NoiseLoop, 300);    // start making noise after a little pause

    self.CullLostBees = function() {
        let escapeFactor = 100;
        let height = $(window).height() + escapeFactor;
        let width = $(window).width() + escapeFactor;
        let beesToCull = []; // collect the indexes of the bees we need to get rid of
        for(let i = 0; i < self.bees.length; i++) {
            if(self.bees[i].position.x > width || self.bees[i].position.x < -escapeFactor) {
                beesToCull.push(i);
            } else if(self.bees[i].position.y > height || self.bees[i].position.y < -escapeFactor) {
                beesToCull.push(i);
            }
        }
        // go through all the bees we don't want any more and remove them
        // start at highest index otherwise it will jumble and remove wrong ones
        for(let i = beesToCull.length; i > 0; i--) {
            var index = beesToCull[i-1];
            let beeId = self.bees[index].id;
            self.bees.splice(index, 1); // remove from array
            $("#"+beeId).remove();  // remove html
        }
        setTimeout(self.CullLostBees, 5000);
    };
    self.CullLostBees();
};

var controller = new BeeController();