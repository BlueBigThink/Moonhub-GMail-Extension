chrome.browserAction.onClicked.addListener((tab) => {
    // const el = document.activeElement
    // const el = document.querySelector('.username');
    // console.log(el === document.activeElement);
    console.log("98798797997998");
    chrome.browserAction.getTitle({ tabId: tab.id }, (title) => {
        if (!tab.id) {
            return;
        }
        console.log(title);
        // if (title === "Enable") {
        //     console.log("Enable content script");
        //     chrome.tabs.executeScript({
        //         file: "lib/focused-element.js",
        //     });
        // } else {
        //     console.log("Disable content script");
        //     chrome.tabs.sendMessage(tab.id, {
        //         action: "disable",
        //     });
        // }
    });
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.message === 'login') {
        const newURL = "https://accounts.google.com/o/oauth2/v2/auth?client_id=819824658209-ok6n232e9bnjo7kegagtouqqocn9nph8.apps.googleusercontent.com&response_type=code&scope=https://www.googleapis.com/auth/gmail.readonly&redirect_uri=https://mail.google.com/mail/u/0/#inbox?compose=new&access_type=offline";
        // const newURL = " http://localhost:8000";
        chrome.tabs.update({ url: newURL });
        // chrome.tabs.create({ url: newURL });
        // sendResponse({message : 'success'});
    }
});

