InboxSDK.loadScript('https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js')
InboxSDK.loadScript('https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js')

var g_bMoonhubApp = false;
var g_bShowGenerate = false;
InboxSDK.load(2, 'sdk_moonhub-inbox_d80d2bf259').then(function(sdk){
   // the SDK has been loaded, now do something with it!
   sdk.Compose.registerComposeViewHandler(function(composeView){
    setInterval(function() {
      //Check active element
      const el = document.activeElement;
      const el_Arr = document.querySelectorAll('[g_editable="true"]');
      el_Arr.forEach((element, index) => {
        if(el === element) {
          console.log("Detected!", index);
          addMoonhubApp(el);
        } else {
          if(el.classList.contains("moonhub") || g_bShowGenerate == true){
            //TODO
          } else {
            rmMoonhubApp();
          }
        }
      });
      //Watch the email status
    }, 500);
    
    function addMoonhubApp(el) {
      if(g_bMoonhubApp) return;

      const style = window.getComputedStyle(el);
      var div=document.createElement("div"); 
      div.setAttribute("id", "moonhub-container-elm");
      document.body.appendChild(div); 

      //Moonhub Container Element in Browser
      const moonhub_container_elm = new Vue({
        el: '#moonhub-container-elm',
        template: `
          <div id="moonhub-container">
            <div class="monnhub-container-relative">
            <div id="moonhub-tool-container" :style="[tool_container]"  class="moonhub">
              <template v-if="bTopicDetected">
                <template v-if="bShowGenerate">
                  <div id="generator-container"  class="moonhub">
                    <div class="generator-title moonhub">
                      <div class="title-icon moonhub"></div>
                      <div class="title-content  moonhub">
                        <div class="title-bottom moonhub">Generate text</div>
                      </div>
                    </div>
                    <div class="generator-body moonhub" @click="handleReplaceEmail">
                      <pre class="generator-body-content moonhub">{{ai_email}}</pre>
                    </div>
                    <div class="generator-button moonhub">
                    <button class="btn-refresh moonhub" @click="handleGenerate">Retry</button>
                    <button class="btn-cancel moonhub" @click="handleCancel">Cancel</button>
                    <button class="btn-keep moonhub" @click="handleReplaceEmail">Keep</button>
                    </div>
                  </div>
                  <button class="cross-btn only-btn moonhub" @click="handleCancel"></button>
                </template>
                <template v-else>
                  <button class="tool-button moonhub" @click="handleToolButton">
                    <div class="round-button-label moonhub">
                      <div class="round-button-label-content moonhub">{{sTopicDetected}}</div>
                    </div>
                    <div class="round-btn moonhub"></div>
                  </button>
                </template>
              </template>
              <template v-else>
                <button class="round-btn only-btn moonhub"></button>
              </template>
              </div>
            </div>
          </div>
        `,
        data() {
          return {
            timer : -1,
            ai_email : "Hi Mary,\nIt’s great to hear from you today!\nThe compensation for the SWE role is 100,000 - 150,000$.\nIf you are interested in moving forward can you find a time on my calendly here: calendly.com/nancy?",
            bTopicDetected : false,
            sTopicDetected : "1 topic detected",
            bShowGenerate : false,
            tool_container : {
            },
          }
        },
        methods: {
          watchEvent(){
            this.timer = setInterval(() => {
              let email = composeView.getTextContent();
              if(email !== '') {
                email = composeView.getHTMLContent().toString();
                // var temp = "This is a string.";
                let count = (email.match(/<div>/g) || []).length + 1;
                if(count == 1){
                  this.sTopicDetected = "1 topic detected";
                } else if(count > 1) {
                  this.sTopicDetected = count + " topics detected";
                }
                this.bTopicDetected = true;
                // this.moveToolContainer();
              } else { 
                this.bTopicDetected = false;
              }
            }, 500);
          },
          getAIEmail(){
            const email_content = composeView.getHTMLContent();
            //TODO
            axios({
              method: 'POST',
              url : `https://email-generation-backend-dev-ggwnhuypbq-uc.a.run.app/get-ai-email/`,
              headers : {
                'Content-Type' : 'application/json'
              },
              data : {
                text : email_content
              }
            })
            .then(res => {
              if (res.status === 200) {
                //TODO
                this.ai_email = res.data.ai_email;
                console.log(ai_email);
              } else {
                console.log(res.error);
              }
            });  
          },
          handleToolButton(event){
            this.bShowGenerate = true;
            g_bShowGenerate = true;
          },
          handleGenerate(event){
            this.getAIEmail();
          },
          handleCancel(event){
            this.bShowGenerate = false;
            g_bShowGenerate = false;
            const el_Arr = document.querySelectorAll('[g_editable="true"]');
            el_Arr[0].focus();
          },
          handleReplaceEmail(event){
            composeView.setBodyHTML('<pre style="white-space : pre-wrap">' + this.ai_email + '</pre>');
            this.handleCancel(event);
          },
          moveToolContainer() {
            const offset = getOffset(el);
            const right = window.innerWidth - parseInt(style.width.toString()) - offset.left;
            const bottom = window.innerHeight - parseInt(style.height.toString()) - offset.top;
            let moonhub = document.getElementById('moonhub-tool-container');
            mRight = (right + 20) + 'px';
            mBottom = (bottom + 20) + 'px';
            moonhub.style.right = mRight;
            moonhub.style.bottom = mBottom;
          }
        },
        created() {
          this.watchEvent();
        },
        mounted(){
          // if(!this.bTopicDetected) return;
          this.moveToolContainer();
        },
        beforeDestroy(){
          clearInterval(this.timer);
        }
      });
      g_bMoonhubApp = true;
    }

    function getOffset(el) {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
      };
    }

    function rmMoonhubApp(){
      try{
        document.getElementById('moonhub-container').remove();
        g_bMoonhubApp = false;
        g_bShowGenerate = false;
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
                  <input  id="#input-search" 
                          class="input-grey-rounded" 
                          type="text" 
                          placeholder="Search for anything here..."
                          v-model="searchInput"
                          v-on:input="handleSearchInput"
                  />
                </div>
                <template v-for="sentence in sentences">
                  <li :title="sentence" @click="handleItem">
                    {{sentence}}
                  </li>
                </template>
              </ul>
            </div>
          `,
          data(){
            return {
              searchInput : '',
              sentences : [
              ],
              all : [
              ]
            }
          },
          mounted() {
            var inboxDropdown = document.getElementById("word-suggestion-list").parentElement;
            inboxDropdown.style.border = '0px solid black';
            inboxDropdown.style["boxShadow"] = 'none';
            //TODO
            this.all.push("say it's great to hear from them");
            this.all.push("send calendly link");
            this.all.push("provide compensation details");
            this.all.push("Libero massa dolor. Nibh sed nec, non neque");
            this.all.push("You busy? have some time?");
            this.all.push("Nice to meet you!");
            this.all.push("say to him");
            this.all.forEach(item => this.sentences.push(item));//TODO
          },
          methods:{
            getSuggestionList(completion){
              //TODO
              axios({
                method: 'POST',
                url : `https://email-generation-backend-dev-ggwnhuypbq-uc.a.run.app/get-suggestion/`,
                headers : {
                  'Content-Type' : 'application/json'
                },
                data : {
                  text : completion
                }
              })
              .then(res => {
                if (res.status === 200) {
                  //TODO
                  suggesion_list = res.data.list;
                  console.log(suggesion_list);
                  suggesion_list.forEach(item => {
                    this.sentences.push(item);
                  });
                } else {
                  console.log(res.error);
                }
              });  
            },  
            handleItem(event){
              const content = event.target.title;
              //TODO
              let email = composeView.getHTMLContent();
              let s_email = composeView.getTextContent();
              if(s_email == ''){
                email = content;
              }else{
                email = email + `<div>${content}</div>`;
              }
              composeView.setBodyHTML(email);
              this.getSuggestionList(content);
            },
            handleSearchInput(event){
              this.sentences = this.all.filter(item => item.search(this.searchInput) > -1);
            },
          }
        });
        // let threadID = composeView.getThreadID();
        // if(threadID == ''){
        //   console.log('This is new email. Not reply!');
        // }else{
          // axios.get(`https://email-generation-backend-dev-ggwnhuypbq-uc.a.run.app/ai-email/${threadID}`, {
          //     headers : {
          //     'Content-Type' : 'application/json'
          //   }
          // })
          // .then(res => {
          //   if (res.status === 200) {
          //     email_contents = res.data.ai_emails;
          //     console.log(email_contents);
          //     email_contents = '<pre style="white-space : pre-wrap">' + email_contents + '</pre>';
          //     composeView.setBodyHTML(email_contents);   
          //   } else {
          //     console.log(res.error);
          //   }
          // });
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
    composeView.on('destroy', (event) => {
      rmMoonhubApp();
    });
    composeView.on('discard', (event) => {
      rmMoonhubApp();
    });
    composeView.on('presending', (event) => {
      rmMoonhubApp();
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
