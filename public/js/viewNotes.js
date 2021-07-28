let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      console.log(user);
      getNotes(user.uid, user.displayName);
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

function getNotes(userId, name) {
    const notesRef = firebase.database().ref(`users/${userId}`);
    notesRef.on('value', (db) => {
        const data = db.val();
        renderData(data, name);

    });
}

function renderData(data, name) {
    console.log(data); 
    let html = '';
    for(const dataKey in data) {
        const note = data[dataKey];
        const cardHtml = renderCard(note, name);
        html += cardHtml  
    }

    document.querySelector('#app').innerHTML = html;
}
function randColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function renderCard(note, name) {
    // convert a note to html and return it
   /* const div = document.createElement('div');
    div.classList.add('column', 'is-one-quarter');

    const card = coument.createElement('div');
    card.classList.add('card');

    div.appendChild(card); */
    let backgroundColor = randColor();
    let inverseColor = invertColor(backgroundColor);
    return `
        <div class = "column is-one-quarter">
            <div class ="card" style = "background-color: ${backgroundColor}; color: ${inverseColor}" >
                <header class="card-header">
                    <span class="card-header-title" style = "color: ${inverseColor}">${note.title}</span>
                </header>
                <div class="card-content">
                    <div class="content" >${ note.text }</div>
                </div>
                <div class = "card-content">
                    <div class="content" style = "font-size: 10px"><i>Written by ${name}</i></div>
                </div>
            </div>
        </div>
    `;
}