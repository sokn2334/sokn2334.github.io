//let body = document.querySelector('body');
//body.addEventListener('click', giveAlert);


//function giveAlert(){
    //alert('This is an alert');
//}

const btn = document.getElementById('btn');

btn.addEventListener('click', function onClick(event) {
    if (document.body.style.backgroundColor.match('black'))
    {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
    }else
    {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
    }
  
});

function changeImg() {
    var image = document.getElementById('myImg');
    if (image.src.match("dog.jpg")) {
        image.src = "cat.jpg";
    }
    else {
        image.src = "dog.jpg";
    }
}
