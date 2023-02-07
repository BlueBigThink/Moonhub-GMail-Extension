InboxSDK.loadScript('https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js')
InboxSDK.loadScript('https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js')

InboxSDK.load(2, 'sdk_moonhub-inbox_d80d2bf259').then(function(sdk){
   // the SDK has been loaded, now do something with it!
   sdk.Compose.registerComposeViewHandler(function(composeView){
     // a compose view has come into existence, do something with it!
    composeView.addButton({
      title: "Moonhub",
      iconUrl: chrome.extension.getURL('images/icon.png'),
      onClick: async function(event) {
        let threadID = composeView.getThreadID();
        if(threadID == ''){
          console.log('This is new email. Not reply!');
        }else{
          axios.get(`https://email-generation-backend-dev-ggwnhuypbq-uc.a.run.app/ai-email/${threadID}`, {
            headers : {
              'Content-Type' : 'application/json'
            },
          })
          .then(res => {
            if (res.status === 200) {
              email_contents = res.data.ai_emails;
              email_contents = '<pre style="white-space : pre-wrap">' + email_contents + '</pre>';
              composeView.setBodyHTML(email_contents);   
            } else {
              console.log(res.error);
            }
          });
        }
      }
    });
  });
});
