
const btn = document.querySelector('button');
btn.addEventListener('click', () => displayMessage('Siri: Hi there, how can I help you?','warning'));

function displayMessage(msgText, msgType) {
    
    const body = document.body;

    const panel = document.createElement('div');
    panel.setAttribute('class','msgBox');
    body.appendChild(panel);
    
    const msg = document.createElement('p');
    msg.textContent = msgText;
    panel.appendChild(msg);
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    panel.appendChild(closeBtn);
    
    closeBtn.addEventListener('click', () => panel.parentNode.removeChild(panel));

    if (msgType === 'warning') {
        msg.style.backgroundImage = 'url(siri.png)';
        msg.style.backgroundSize="20% 60%";
        panel.style.backgroundColor = '#F2C4ce';
      } else if (msgType === 'chat') {
        msg.style.backgroundImage = 'url(icons/chat.png)';
        panel.style.backgroundColor = 'aqua';
      } else {
        msg.style.paddingLeft = '20px';
      }
}
