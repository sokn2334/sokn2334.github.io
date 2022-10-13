const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.getElementById('story');

function randomValueFromArray(array){
  const random = Math.floor(Math.random()*array.length);
  return array[random];
}

let storyText = "It was a blistering afternoon. The thermometer read 94 fahrenheit, and no one was caught outside for very long. :insertx: decided to find someplace to cool down. On their journey, they stumbled upon :inserty:. As they began cooling in their new found location, they recieved questioning looks from those who passed by. It turns out that :insertx: was really a :insertz:! Bob silently videotaped the occurance, and when he sent it off to the news station he recieved a stack of money that weighed 300 pounds!";

var insertX = new Array();
insertX[0] = "Duane the Rock Johnson";
insertX[1] = "Confucius";
insertX[2] = "Elvis Presley";
insertX[3] = "Napoleon Bonaparte";

var insertY = new Array();
insertY[0] = "a luxury pool";
insertY[1] = "a small paper parasol";
insertY[2] = "a small spot under a strangers porch";
insertY[3] = "a small puddle on the side of the road";

var insertZ = new Array();
insertZ[0] = "ghost";
insertZ[1] = "frog";
insertZ[2] = "zombie";
insertZ[3] = "alien";


randomize.addEventListener('click', result);

function result() {
  let newStory = storyText;
  let xItem = randomValueFromArray(insertX);
  let yItem = randomValueFromArray(insertY);
  let zItem = randomValueFromArray(insertZ);
  newStory = newStory.replaceAll(':insertx:', xItem);
  newStory = newStory.replaceAll(':inserty:', yItem);
  newStory = newStory.replaceAll(':insertz:', zItem);

  if(customName.value !== '') {
    const name = customName.value;
    newStory = newStory.replaceAll('Bob', name);
  }

  if(document.getElementById("uk").checked) {
    const weight = Math.round(300 * 0.0714286)+ ' stone';
    const temperature =  Math.round((94-32)* 5 / 9) + ' celcius';
    newStory = newStory.replace('94 fahrenheit', temperature);
    newStory = newStory.replace('300 pounds', weight);
  }

  console.log("Test Message");
  story.textContent = newStory;
  story.style.visibility = 'visible';
}
