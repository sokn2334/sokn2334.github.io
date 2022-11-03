
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

console.log('TRIAL OF NEW THING!')

  const axios = require("axios");

  const options = {
    method: 'GET',
    url: 'https://famous-quotes4.p.rapidapi.com/random',
    params: {category: 'all', count: '2'},
    headers: {
      'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
      'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com'
    }
  };
  
  axios.request(options).then(function (response) {
      console.log(response.data);
  }).catch(function (error) {
      console.error(error);
  });
