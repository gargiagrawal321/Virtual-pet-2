/*
  function setToHour(){
    if(Feedtime>=12){
      pasttime=Feedtime%12+"PM"
      }
    else{
      pasttime=Feedtime%12+"AM"
    }
  }
*/
      
var dog, dog1, dog2, database, foodS, foodStock;
var name="Bruno";
var foodObj;
var lastFed;


function preload(){
  //load images here
  
  dog1 = loadImage("images/dogI.png")
  dog2 = loadImage("images/dogImg1.png");
}


async function setup() {
  database = firebase.database();
  //console.log(database);

  createCanvas(windowWidth, windowHeight);
  
//creating sprites

  dog = createSprite(500,300);
  dog.addImage(dog1)
  dog.scale=0.2;

  feed=createButton("Feed "+name);
  feed.position(700,400);
  feed.mousePressed(feedDog);

  add=createButton("Add Food")
  add.position(700,440);
  add.mousePressed(addFood);
  
  foodObj=new Food();

  foodStockRef = database.ref('food');
  await foodStockRef.on("value",function(data)
  {
    foodS=data.val();
  });
console.log(foodS);
  
  textSize(20);
  await database.ref('fedTime').on("value",function(data){
    lastFed=data.val()
    })
    //console.log(lastFed);
}


function draw() {
background(rgb(46,139,87));

//giving a condition thay if the up key is pressed the image should change 
//console.log(foodS);
foodObj.display();
foodObj.updateFoodStock(foodS);
  //add styles here
textSize(15);
fill("white");
text("Important Note: Press the button to Feed Bruno",5,50);
text("Food ate by Dog:"+foodS,20,100);
text("Time of eating: "+lastFed,20,140);
text("Name of the dog: "+name,20,180);
drawSprites();
}

//function to read values from DB
function readStock(data){
   foodS = data.val();
  foodObj.updateFoodStock(foodS);
 // console.log(foodS)
}

function feedDog()
{
  dog.addImage(dog2);
  //console.log(foodObj.getFoodStock())

  if(foodObj.getFoodStock()<=0)
  {
     foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }
  else
  {
    foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  }

  database.ref("/").update(
    {
      food: foodObj.getFoodStock(),
      fedTime: hour()
    }
  )
}

function addFood(){
  foodS++;
  database.ref("/").update({
  food: foodS,
})
}
   