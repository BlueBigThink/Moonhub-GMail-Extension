InboxSDK.load(2, 'sdk_moonhub-inbox_d80d2bf259').then(function(sdk){
    // the SDK has been loaded, now do something with it!
    sdk.Compose.registerComposeViewHandler(function(composeView){
      // a compose view has come into existence, do something with it!
      composeView.addButton({
        title: "My Nifty Button!",
        iconUrl: 'https://img.icons8.com/parakeet/48/null/box.png',
        onClick: function(event) {
          event.composeView.insertTextIntoBodyAtCursor('Hello World!');
        },
      });

      console.log("getThreadID : ", composeView.getThreadID());
    });
  });