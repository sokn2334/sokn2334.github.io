
const quote = document.querySelector('.new-quote button');
const endpoint = 'https://api.whatdoestrumpthink.com/api/v1/quotes/random';
const btn = document.getElementById('js-new-quote');
const btnTweet = document.getElementById('js-tweet');

getQuote();

function getQuote(){
    fetch(endpoint)
    .then((response) => response.json())
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
    dispQuote.textContent = data.message;
    console.log(data.message);
};


btn.addEventListener('click', function handleClick() {
  console.log('Button clicked');
  getQuote();
});

btnTweet.addEventListener('click', function handleClick() {
    alert("No, I don't really think you should do that...");
  });


