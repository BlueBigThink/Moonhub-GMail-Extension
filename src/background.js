chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.message === 'login') {
        const newURL = "https://accounts.google.com/o/oauth2/v2/auth?client_id=819824658209-ok6n232e9bnjo7kegagtouqqocn9nph8.apps.googleusercontent.com&response_type=code&scope=https://www.googleapis.com/auth/gmail.readonly&redirect_uri=https://mail.google.com/&access_type=offline";
        // const newURL = " http://localhost:8000";
        chrome.tabs.create({ url: newURL });
        // sendResponse({message : 'success'});
    }
});


