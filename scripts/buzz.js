
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

var beeCounter = 0;

var turningLeft = 1;
var goingStraight = 2;
var turningRight = 3;

var BeeModel = function() {

    var self = this;

    self.position = {x : 100, y : 100};
    self.currentAngle = 45;
    self.turningOrStraight = goingStraight;
    self.id = "";
    self.fullId = "";

    self.currentPhrase = "buzzzzzzz ";
    self.phraseIndex = 0;

    self.UpdateVisualLocation = function() {
        $(self.fullId).css({ left: self.position.x, top: self.position.y });
        $(self.fullId).css({ transform: "rotate("+self.currentAngle+"deg)" });
    };

    self.MakeNoise = function() {
        var output = "";

        output = self.currentPhrase[self.phraseIndex];

        //var noiseHtml = "<div class='sound' style='css : { transform: \"rotate("+self.currentAngle+"deg)\", left : "+self.position.x+", top: "+self.position.y+" }'>"+output+"</div>";
        var noiseHtml = "<div class='sound' style='transform: rotate("+self.currentAngle+"deg); left : "+self.position.x+"px; top: "+self.position.y+"px'>"+output+"</div>";
        
        // this is a lazy way to put the noise slightly behind the bee
        setTimeout(function() { $("body").append(noiseHtml); }, 300);

        self.phraseIndex += 1;
        if(self.phraseIndex >= self.currentPhrase.length) {
            self.phraseIndex = 0;
        }
    };
    
    self.Move = function() {
        var movementLength = 3;
        // move forward based on our current angle
        var theta_radians = (self.currentAngle) * (Math.PI/180);

        // what is the adjacent (X)
        var adjacent = Math.cos(theta_radians) * movementLength;
        // what is the opposite (Y)
        var opposite = Math.sin(theta_radians) * movementLength;

        self.position.x = self.position.x + adjacent;
        self.position.y = self.position.y + opposite;

        self.UpdateVisualLocation();
    };
    self.MaybeChangeDirection = function() {
        var angleChange = 5;
        // mostly stick to the direction we're going in
        var keepDoingWhatWereDoing = randomIntFromInterval(1,100);
        //console.log("keepGoing is " + keepDoingWhatWereDoing);
        if(keepDoingWhatWereDoing <= 90) {
            if(self.turningOrStraight === turningLeft) {
                self.currentAngle -= angleChange;
            } else if (self.turningOrStraight === turningRight) {
                self.currentAngle += angleChange;
            }
            //console.log("new angle is " + self.currentAngle);
        } else {
            // ok, we're going to change direction
            var directionChange= randomIntFromInterval(0,1);
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
            //console.log("changed to " + self.turningOrStraight);
        }

    };
    self.MoveLoop = function() {
        self.MaybeChangeDirection();
        self.Move();
        setTimeout(self.MoveLoop, 100);
    };
    self.MoveLoop();
    self.NoiseLoop = function() {
        self.MakeNoise();
        setTimeout(self.NoiseLoop, 300);
    };
    setTimeout(self.NoiseLoop, 300);

    self.Initialize = function() {
        beeCounter += 1;
        self.id = "bee"+ beeCounter;
        self.fullId = "#"+self.id;

        var x = randomIntFromInterval(100,800);
        var y = randomIntFromInterval(100,500);
        self.position.x = x;
        self.position.y = y;
        self.currentAngle = randomIntFromInterval(0,360);

        var beeHtml = "<div class='bee' id='"+self.id+"'>bee</div>";
        $("body").append(beeHtml);
        self.UpdateVisualLocation();
    };
    self.Initialize();

};

var bee1 = new BeeModel();
//var bee2 = new BeeModel();
//var bee3 = new BeeModel();