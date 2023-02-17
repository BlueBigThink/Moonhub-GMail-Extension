InboxSDK.loadScript('https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js')
InboxSDK.loadScript('https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js')

var g_bMoonhubApp = false;
var g_bShowGenerate = false;
var g_nWatchTimer = -1;
var g_Edit = null;
InboxSDK.load(2, 'sdk_moonhub-inbox_d80d2bf259').then(function(sdk){
   // the SDK has been loaded, now do something with it!
   sdk.Compose.registerComposeViewHandler(function(composeView){

    setInterval(function() {
      //Check active element
      const el = document.activeElement;
      const el_Arr = document.querySelectorAll('[g_editable="true"]');
      el_Arr.forEach((element, index) => {
        if(el === element) {
          // console.log("Detected!", index);
          g_Edit = el;
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

    function isNum(c){
      let bRes = false;
      if(c >= '0' && c <= '9')
        bRes = true;
      return bRes;
    }

    function isLetter(c){
      let bRes = false;
      if(c >='A' && c <='z')
        bRes = true;
      return bRes;
    }

    const Modifier = {
      get getHTML(){
        return g_Edit.innerHTML;
        // return composeView.getHTMLContent();
      },
      get getText(){
        return g_Edit.innerText;
        // return composeView.getTextContent();
      },
      get getThreadID(){
        return composeView.getThreadID();
      },
      set sHTML(html){
        g_Edit.innerHTML = html;
        // composeView.setBodyHTML(html);
      },
      set sText(text){
        g_Edit.innerText = text;
        // composeView.setBodyText(text);
      }
    }  

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
                      <template v-if="bLoading">
                        <div class="indicator-container">
                          <div class="svg-wrapper">
                            <svg class="moon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111.77 111.77">
                              <circle cx="55.89" cy="55.89" r="55.64" fill="none" stroke="#505050" stroke-miterlimit="10" stroke-width=".5" stroke-dasharray="4"/>
                              <circle cx="55.89" cy="55.89" r="43.65" fill="#752eff"/>
                              <path d="M73 91.22a52.22 52.22 0 0 1-51.1-62.71 43.64 43.64 0 0 0 60.8 61.8 52.45 52.45 0 0 1-9.7.91z" fill="#5d2fea" fill-rule="evenodd"/>
                              <circle cx="49.01" cy="38.35" r="6.88" fill="#4c2bd8"/>
                              <path d="M45.79 32.82a10.1 10.1 0 0 1 9.78 7.61 6.87 6.87 0 0 0-10.7-7.56c.3-.03.6-.05.92-.05z" fill="#3923b7" fill-rule="evenodd"/>
                              <circle cx="74.07" cy="31.47" r="2.02" fill="#4c2bd8"/>
                              <path d="M73.12 29.85A3 3 0 0 1 76 32.08a2 2 0 0 0-3.14-2.22h.27z" fill="#3923b7" fill-rule="evenodd"/>
                              <circle cx="80.11" cy="77.6" r="2.02" fill="#4c2bd8"/>
                              <path d="M79.16 76A3 3 0 0 1 82 78.21 2 2 0 0 0 78.89 76h.27z" fill="#3923b7" fill-rule="evenodd"/>
                              <circle cx="54.47" cy="17.54" r="1.17" fill="#4c2bd8"/>
                              <path d="M53.92 16.6a1.72 1.72 0 0 1 1.66 1.3 1.17 1.17 0 0 0-1.82-1.29h.16z" fill="#3923b7" fill-rule="evenodd"/>
                              <circle cx="33.27" cy="88.97" r="1.17" fill="#4c2bd8"/>
                              <path d="M32.72 88a1.72 1.72 0 0 1 1.66 1.3 1.17 1.17 0 0 0-1.81-1.3h.16z" fill="#3923b7" fill-rule="evenodd"/>
                              <circle cx="25.28" cy="36.79" r="1.77" fill="#4c2bd8"/>
                              <path d="M24.46 35.37a2.6 2.6 0 0 1 2.51 2 1.77 1.77 0 0 0-2.75-1.95h.24z" fill="#3923b7" fill-rule="evenodd"/>
                              <circle cx="82.51" cy="51.39" r="3.84" fill="#4c2bd8"/>
                              <path d="M80.71 48.3a5.63 5.63 0 0 1 5.46 4.25 3.84 3.84 0 0 0-6-4.22z" fill="#3923b7" fill-rule="evenodd"/>
                              <circle cx="54.47" cy="64.73" r="3.75" fill="#4c2bd8"/>
                              <path d="M52.71 61.71A5.5 5.5 0 0 1 58 65.86a3.74 3.74 0 0 0-5.83-4.12z" fill="#3923b7" fill-rule="evenodd"/>
                              <circle cx="26.57" cy="75.59" r="2.99" fill="#4c2bd8"/>
                              <path d="M25.17 73.18a4.39 4.39 0 0 1 4.25 3.31 3 3 0 0 0-4.65-3.29z" fill="#3923b7" fill-rule="evenodd"/>
                            </svg>
                            <svg class="moon-satelite" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111.8 111.8">
                              <circle fill="#4444F9" cx="28.3" cy="7.6" r="3"/>
                            </svg>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <pre class="generator-body-content moonhub">{{ai_email}}</pre>
                      </template>
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
                      <div class="round-button-label-content moonhub">Generate</div>
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
            ai_email : "",
            bTopicDetected : false,
            sTopicDetected : "1 topic detected",
            bShowGenerate : false,
            bLoading : false,
            tool_container : {
            },
          }
        },
        methods: {
          watchEvent(){
            g_nWatchTimer = setInterval(() => {
              let email = Modifier.getText;
              let emailHtml = Modifier.getHTML;
              // console.log("Debug => ", Modifier.getHTML.toString(), email.length);
              if(email !== '' && email.length !== 1) {
                email = Modifier.getHTML.toString();
                // var temp = "This is a string.";
                // let count = (email.match(/<div>/g) || []).length;
                // if(count == 1){
                //   this.sTopicDetected = "1 topic detected";
                // } else if(count > 1) {
                //   this.sTopicDetected = count + " topics detected";
                // }
                this.bTopicDetected = true;
                // this.moveToolContainer();
              } else { 
                this.bTopicDetected = false;
              }
            }, 500);
          },
          getAIEmail(){
            loading = this.bLoading;
            if(loading) return;
            this.bLoading = true;
            const email_content = Modifier.getText;
            //TODO
            axios.post(`https://email-generation-backend-dev-ggwnhuypbq-uc.a.run.app/ai-email-prompt`,{
              headers : {
                'Content-Type' : 'text/plain'
              },
              data : {
                text : email_content
              }
            })
            .then(res => {
              if (res.status === 200) {
                this.ai_email = res.data.ai_emails;
                console.log(res.data);
              } else {
                console.log("error", res.error);
              }
              this.bLoading = false;
            });  
          },
          handleToolButton(event){
            this.getAIEmail();
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
            loading = this.bLoading;
            if(loading) return;
            Modifier.sHTML = '<pre style="white-space : pre-wrap">' + this.ai_email + '</pre>'
            // composeView.setBodyHTML('<pre style="white-space : pre-wrap">' + this.ai_email + '</pre>');
            this.handleCancel(event);
          },
          moveToolContainer() {
            const offset = getOffset(el);
            const right = window.innerWidth - parseInt(style.width.toString()) - offset.left;
            const bottom = window.innerHeight - parseInt(style.height.toString()) - offset.top;
            let moonhub = document.getElementById('moonhub-tool-container');
            mRight = (right + 20) + 'px';
            mBottom = (bottom + 10) + 'px';
            moonhub.style.right = mRight;
            moonhub.style.bottom = mBottom;
          }
        },
        created() {
          clearInterval(g_nWatchTimer);
          this.watchEvent();
        },
        mounted(){
          // if(!this.bTopicDetected) return;
          this.moveToolContainer();
        },
        beforeDestroy(){
          clearInterval(g_nWatchTimer);
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
        clearInterval(g_nWatchTimer);
        document.getElementById('moonhub-container').remove();
        g_bMoonhubApp = false;
        g_bShowGenerate = false;
      }catch(err){
        // console.log('No exist moonhub app!');
      }
    }

     // a compose view has come into existence, do something with it!
    composeView.addButton({
      title: "Moonhub",
      iconUrl: chrome.extension.getURL('images/icon.png'),
      onClick: async function(event) {
        event.dropdown.el.innerHTML = '<div id="drop-down-menu"></div>';
        const suggestion_word_list = new Vue({
          el: '#drop-down-menu',
          template: `
            <div id="word-suggestion-list">
              <template v-if="nfetching == 1">
                <div class="loading-container">
                  <div class="loading">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                  </div>             
                </div>
              </template>
              <template v-else-if="nfetching == 2">
                <div class="loading-container">
                  <div class="retry-container">
                    <button class="btn-retry" @click="handleRetry">Retry</button>
                  </div>             
                </div>
              </template>
              <template v-else>
                <ul>
                  <template v-for="completion in completions">
                    <li :title="completion" @click="handleItem">
                      {{completion}}
                    </li>
                  </template>
                </ul>
              </template>
            </div>
          `,
          data(){
            return {
              nfetching : 0,
              bfetching : false,
              searchInput : '',
              completions : [
              ],
              all : [
              ]
            }
          },
          created() {
          },
          mounted() {
            var inboxDropdown = document.getElementById("word-suggestion-list").parentElement;
            inboxDropdown.style.border = '0px solid black';
            inboxDropdown.style["boxShadow"] = 'none';
            const threadID = Modifier.getThreadID;
            if(threadID == ''){
              console.log('This is new email. Not reply!');
              return;
            }
            this.getSuggestionList(threadID);
          },
          methods:{
            getSuggestionList(threadID){
              // this.bfetching = true;
              this.nfetching = 1;
              const email_content = Modifier.getText;
              //TODO
              axios({
                method: 'GET',
                url : `https://email-generation-backend-dev-ggwnhuypbq-uc.a.run.app/get-suggestions/?thread_id=${threadID}&compose_view=${email_content}`,
                headers : {
                  'Content-Type' : 'application/json'
                }
              })
              .then(res => {
                if (res.status === 200) {
                  suggesion_list = res.data;
                  // console.log(suggesion_list);
                  suggesion_list.forEach(item => {
                    if(item != '')
                      this.completions.push(item);
                  });
                  // this.bfetching = false;
                  this.nfetching = 0;
                } else {
                  console.log("Error =>", res.error);
                  // this.bfetching = false;
                  this.nfetching = 0;
                }
              })
              .catch(error => {
                console.log("Request Error =>", error);
                // this.bfetching = false;
                // this.getSuggestionList(threadID);
                this.nfetching = 2;
              })
            },  
            handleItem(event){
              this.completions = [];
              const threadID = Modifier.getThreadID;
              if(threadID == ''){
                console.log('This is new email. Not reply!');
                return;
              }    
              const content = event.target.title;
              //TODO
              let email = Modifier.getHTML;
              let s_email = Modifier.getText.toString();
              if(s_email == ' <br>') email = '';
              if(s_email == ''){
                email = `<div>${content}</div>`;
              }else{
                email = email + `<div>${content}</div>`;
              }
              Modifier.sHTML = email;
              this.getSuggestionList(threadID);
            },
            handleSearchInput(event){
              this.completions = this.all.filter(item => item.search(this.searchInput) > -1);
            },
            handleRetry(event){
              this.completions = [];
              const threadID = Modifier.getThreadID;
              if(threadID == ''){
                console.log('This is new email. Not reply!');
                return;
              }
              this.getSuggestionList(threadID);
            }
          }
        });
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
                      localStorage.setItem("login", "true");
                    }else{
                      localStorage.setItem("login", "false");
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
