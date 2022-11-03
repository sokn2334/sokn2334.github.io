const quote = document.querySelector('.new-quote button');
const endpoint = 'https://my-bao-server.herokuapp.com/api/breadpuns';
const btn = document.getElementById('js-new-quote');
const btnTweet = document.getElementById('js-tweet');

getQuote();

function getQuote(){
    fetch(endpoint)
    .then((response) => response.text())
    .then((data) => {
        console.log(data)
        displayQuote(data)
    })
    .catch((error) => {
        console.error('Message Failed', error)
        alert('Message Failed')
    });
};

function displayQuote(data){
    const dispQuote = document.getElementById('js-quote-text');
    dispQuote.textContent = data;
    console.log(data);

    const numImagesAvailable = 155;  //how many photos are total in the collection
    const numItemsToGenerate = 1; //how many photos you want to display
    const collectionID = 2349860;   //the collection ID from the original url
    function renderGalleryItem(randomNumber){
      fetch(`https://source.unsplash.com/collection/${collectionID}/?sig=${randomNumber}`)
        .then((response) => {
          console.log(response.url)
          document.body.style.backgroundImage = `url(${response.url})`;
          document.body.style.backgroundRepeat = "no-repeat"
          document.body.style.backgroundPosition = "top center"
          document.body.style.backgroundSize = "cover"
        })
      }
    for(let i=0; i < numItemsToGenerate; i++){
        let randomImageIndex = Math.floor(Math.random() * numImagesAvailable);
    renderGalleryItem(randomImageIndex);
      }

};


btn.addEventListener('click', function handleClick() {
  console.log('Button clicked');
  getQuote();
});

btnTweet.addEventListener('click', function handleClick() {
    alert("My extension adds a random picture of bread as the background using an Unsplash bread collection.");
  });

