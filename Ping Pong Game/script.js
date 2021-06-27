//fetching the ids
var ball = document.getElementById('ball');
var plate1 = document.getElementById('rod1');
var plate2 = document.getElementById('rod2');

//score
var s1 = document.getElementById('score1');
var s2 = document.getElementById('score2');

localStorage.clear();
//used for the local storage , localStorage.getItem(variable) and localStorage.setItem(variable , setting 
//value);
const storeName = "rodName";
const storeScore = "rodScore";

//inner height means viewport heights and widths
var wh = window.innerHeight;
var ww = window.innerWidth;

//speed of the balls actually shows coordinates , the top left corner is 0,0 having x - axis towards right
//and y-axis towards down
var ballSpeedX = 2;
var ballSpeedY = 2;

//score is used for updating scores , maxscore is to keep track of max score and rod is which rod win the 
//match and game is boolean which is waiting for the "Enter" button to be pressed
var score1 = 0  , score2 = 0, maxscore , rod ;
var game = false;

//This is IIFE , this function will be automatically called when the code runs
(function(){
 
      //here we are initilly getting the data before starting the game (previous session data) 
      rod = localStorage.getItem(storeName);
      maxscore = localStorage.getItem(storeScore);
      console.log(rod , maxscore);
      //first time visit
     if(rod === null || maxscore === null){
        console.log("first time visit");
        alert("This is your first time in this game!! Press enter to continue");
       // score = 0;
        score1 = 0 ; score2 = 0;
        maxscore = 0;
        rod = "rod1";
        //intially we are taking rod as rod1 which means ball will be present on rod2
    }else{
        console.log("second time visit");
      //second time visit (data of previous sesssion)
        alert(rod + " has maximum score of " + maxscore*100 + " till now");
    }

    //reset the board will set the ball , plates to middle and score value to 0
    resetBoard(rod);
})();


function resetBoard(rod){
    
    //centering the rodes and the ball
    plate1.style.left = (ww - plate1.offsetWidth)/2 + 'px';
    plate2.style.left = (ww - plate2.offsetWidth)/2 + 'px';
    ball.style.left =  (ww - ball.offsetWidth)/2 + 'px';
   
    //if rod2 wins then ball will be on rod1 next time
    //direction of y axis is positive downwards
    if(rod === "rod2"){
               
          ball.style.top = (plate1.offsetHeight+ plate1.offsetTop) + 'px';
          ballSpeedY = 2;      
    }
    else if(rod === "rod1"){
        console.log("in rod2 h");
        ball.style.top = (plate2.offsetTop - plate2.offsetHeight) + 'px';
        console.log("top " + ball.style.top);
        ballSpeedY = -2;
    }
    //initiaising the score to 0
    score1 = 0;score2 = 0;
    s1.innerHTML = "0";
    s2.innerHTML = "0";
    game = false;
};

function storeRecord(rodname , value){
    console.log("in records");

    //rodname -> wining rod
    //value -> its score
    if(maxscore < value){
        maxscore = value;
        //storing the values in storeName and storeValue
        localStorage.setItem(storeName , rodname);
        localStorage.setItem(storeScore , maxscore);
    }
    clearInterval(move);
    alert("Game is Over!!" + " " + rodname + " has the winning score of " + value + " points");
    resetBoard(rodname); 
}

window.addEventListener('keydown' , function(event){

     //getting keycode 
      var value = event.keyCode;
      var rodSpeed = 20;
     
      let rodRect = plate1.getBoundingClientRect();
      
      //managing the left and right keys here
      if(value === 39 && plate1.offsetWidth + rodRect.x < ww){
          console.log("39");
          plate1.style.left =  rodRect.x + rodSpeed + "px";    
          plate2.style.left = plate1.style.left;      
      }

      if(value === 37 && rodRect.x > 0){
          console.log("37");
          plate1.style.left = (rodRect.x - rodSpeed )+ "px";
          plate2.style.left = plate1.style.left;
      }

      //from here our game starts
      if(event.code === "Enter"){

        if(!game){

            game = true;
                   
            let ballRect = ball.getBoundingClientRect();
            
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let balldia = ballRect.width;
           
             move  = setInterval(function(){

                console.log("Inside setInterval");
                 ballX = ballX + ballSpeedX; // keep on updating the x , y coordinated at each interval , till  we get clear
                 ballY = ballY + ballSpeedY;//interval to stop this
               
                 let rod1left = plate1.getBoundingClientRect().x;//now every time we move our rod left and right , its location
                 let rod2left = plate2.getBoundingClientRect().x;//changes so in order to track current status , it should
                 //be placed inside setInterval

                 ball.style.left =  ballX + "px";//updating the ball location hand to hand
                 ball.style.top =   ballY + "px";
               
                  //here to prevent crossing side horizontal borders, we check this condition
                 if((ballX +balldia >  ww) || (ballX < 0)){
                     ballSpeedX = -ballSpeedX;
                 }

                 // distance of center of ball from the left side
                 let mid = ballX + balldia/2;
                
                  //checking when ball collides with top rod 
                  if(ballY <= plate1.offsetHeight){
                         
                      ballSpeedY = -ballSpeedY;
                      score1++;
                      s1.innerHTML++;
                    
                    //if ball fall in empty area of rod1 , rod2 wins
                    if((mid < rod1left) || (rod1left + plate1.offsetWidth < mid)){
                       let name = "rod2";
                        storeRecord(name , score1);
                     }
    
                  }
                   
                  //checing if ball collide with down rod
                  if((ballY + balldia) >= ( wh - plate2.offsetHeight)){

                    ballSpeedY = -ballSpeedY;
                    score2++;
                    s2.innerHTML++;
                    //if ball fall in empty area of rod2 , rod1 wins
                    if((mid < rod2left) || (rod2left + plate2.offsetWidth < mid)){
                    console.log("in main records");
                        let name = "rod1";
                        storeRecord(name , score2);
                     }
                  }


             } , 10);
        }
      }

});