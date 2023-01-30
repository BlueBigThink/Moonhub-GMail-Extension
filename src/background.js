chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.message === 'login') {
        const newURL = "http://stackoverflow.com/";
        // const newURL = " http://localhost:8000";
        chrome.tabs.create({ url: newURL });
        sendResponse({message : 'success'});
    }
});