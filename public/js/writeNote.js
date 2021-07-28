let googleUser;
window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};
const handleNoteSubmit = () => {
    // 1. Capture the form data
    const noteTitle = document.querySelector('#noteTitle');
    const noteText = document.querySelector('#noteText');
    const noteLabels = document.querySelector("#noteLabels");
    const labels = noteLabels.value.split(",").map(e => e.trim());
    const uuid = createUUID();
    firebase.database().ref(`users/${googleUser.uid}/messages`).push({
        title: noteTitle.value,
        text: noteText.value,
        uuid
    })
    .then(() => {
        noteTitle.value = "";
        noteText.value = "";
        noteLabels.value = "";
    });
    for (const i in labels) {
        const labelsRef = firebase.database().ref(`users/${googleUser.uid}/labels/${labels[i]}`).push({
            uuid
        });
    }
}
function createUUID(){
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    })
    return uuid;
}