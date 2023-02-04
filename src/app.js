InboxSDK.loadScript('https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js')
InboxSDK.loadScript('https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js')

var g_bMoonhubApp = false;

InboxSDK.load(2, 'sdk_moonhub-inbox_d80d2bf259').then(function(sdk){
   // the SDK has been loaded, now do something with it!
   sdk.Compose.registerComposeViewHandler(function(composeView){
    setInterval(function() {
      const el = document.activeElement;
      const el_Arr = document.querySelectorAll('[g_editable="true"]');
      el_Arr.forEach((element, index) => {
        if(el === element) {
          console.log("Detected!", index);
          addMoonhubApp(el);
        } else {
          rmMoonhubApp();
        }
      });
    }, 1000);
    
    function addMoonhubApp(el) {
      if(g_bMoonhubApp) return;

      const style = window.getComputedStyle(el);
      var div=document.createElement("div"); 
      div.setAttribute("id", "moonhub-container-elm");
      document.body.appendChild(div); 
      const moonhub_container_elm = new Vue({
        el: '#moonhub-container-elm',
        template: `
          <div id="moonhub-container">
            <template v-if="topicDetected">
              <div id="moonhub-tool-container" :style="[tool_container]">
                <div id="generator-container">
                  <div class="generator-title">
                    <div class="title-icon"></div>
                    <div class="title-content">
                      <div class="title-top">3 topics detected</div>
                      <div class="title-bottom">Generate text</div>
                    </div>
                  </div>
                  <div class="generator-body">
                    <pre class="generator-body-content">{{ai_email}}</pre>
                  </div>
                  <div class="generator-button">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-generate">Generate</button>
                  </div>
                </div>
                <div class="tool-button">
                  <div class="round-btn"></div>
                  <div class="round-button-label">
                    <div class="round-button-label-content">3 topics detected</div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="round-btn only-btn"></div>
            </template>
          </div>
        `,
        data() {
          return {
            ai_email : "Hi Mary,\nIt’s great to hear from you today!\nThe compensation for the SWE role is 100,000 - 150,000$.\nIf you are interested in moving forward can you find a time on my calendly here: calendly.com/nancy?",
            // ai_email : "Hi Mary,\nIt’s great to hear from you today!",
            topicDetected : false,
            tool_container : {
            },
          }
        },
        mounted(){
          nBottom = style.bottom;
          nRight = style.right;
          this.tool_container['bottom'] = nBottom;
          this.tool_container['right'] = nRight;
          // this.tool_container['position'] = 'absolute';
        }
      });
      g_bMoonhubApp = true;
    }

    function rmMoonhubApp(){
      try{
        document.getElementById('moonhub-container').remove();
        g_bMoonhubApp = false;
      }catch(err){
        console.log('No exist moonhub app!');
      }
    }

     // a compose view has come into existence, do something with it!
    composeView.addButton({
      title: "Moonhub",
      iconUrl: chrome.extension.getURL('images/icon.png'),
      chrome : false,
      hasDropdown: true,
      onClick: async function(event) {
        event.dropdown.el.innerHTML = '<div id="drop-down-menu"></div>';
        const suggestion_word_list = new Vue({
          el: '#drop-down-menu',
          template: `
            <div id="word-suggestion-list">
              <ul>
                <div class="li-search">
                  <input id="#input-search" class="input-grey-rounded" type="text" placeholder="Search for anything here..."/>
                </div>
                <li v-for="sentence in sentences">
                  {{sentence}}
                </li>
              </ul>
            </div>
          `,
          data(){
            return {
              sentences : [
                "say it's great to hear from them",
                "send calendly link",
                "provide compensation details",
                "Libero massa dolor. Nibh sed nec, non neque",
                "You busy? have some time?",
                "Nice to meet you!",
                "say to him",
              ]
            }
          },
          mounted() {
            var inboxDropdown = document.getElementById("word-suggestion-list").parentElement;
            inboxDropdown.style.border = '0px solid black';
            inboxDropdown.style["boxShadow"] = 'none';
          }
        });
        // let threadID = composeView.getThreadID();
        // if(threadID == ''){
        //   console.log('This is new email. Not reply!');
        // }else{
        //   axios.get(`https://email-generation-backend-dev-ggwnhuypbq-uc.a.run.app/ai-email/${threadID}`, {
        //       headers : {
        //       'Content-Type' : 'application/json'
        //     }
        //   })
        //   .then(res => {
        //     if (res.status === 200) {
        //       email_contents = res.data.ai_emails;
        //       console.log(email_contents);
        //       email_contents = '<pre style="white-space : pre-wrap">' + email_contents + '</pre>';
        //       composeView.setBodyHTML(email_contents);   
        //     } else {
        //       console.log(res.error);
        //     }
        //   });
        // }
        // const content = composeView.getHTMLContent();
        // let userText = getUserText(content);
        // let email_Body = '<div id="email-body"></div>';

        // let modalView = null;
        // if(!(await isLoggedIn())) {
        //   modalView = sdk.Widgets.showModalView({
        //     'el': `<div id="google-signin"></div>`,
        //     chrome : false
        //   });
        // } else {
        //  composeView.setBodyHTML(email_Body);    
        // }
/*
        const googleSignIn = new Vue({
          el: '#google-signin',
          template: `
            <div>
              <div id="google-signin-body">
                <button class="login-with-google-btn" @click="handleSignIn">Sign in with Google</button>
              </div>
            </div>
          `,
          methods:{
            handleSignIn(event){
              let curUser = sdk.User.getEmailAddress();
              console.log(curUser);
              modalView.close();
              chrome.runtime.sendMessage({ message: 'login' },function(response){
                // if(response.message == 'success'){
                // }
                axios.get(`http://127.0.0.1:5000/api/signin?useraddress=${curUser}`)
                .then(res => {
                  if (res.status === 200) {
                    bSigned = res.data.signin;
                    if(bSigned){
                      localStorage.setItem("login", "true");//TODO
                    }else{
                      localStorage.setItem("login", "false");//TODO
                    }
                  }
                });
              });
            }
          },
          data(){
            return {
              isLoggedIn : false
            }
          },
          mounted(){
            this.isLoggedIn = false;
          }
        });
        */
      },
    });

    composeView.on('sent', (event) => {
      const threadID = composeView.getThreadID();
      console.log("Sent ========>", threadID);
      // axios.get(`http://127.0.0.1:5000/api/send?threadid=${threadID}`)
      // .then(res => {
      //   if (res.status === 200) {
      //     console.log("Sent threadID");
      //   }
      // });
    });
  });
});
