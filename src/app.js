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
          axios.get(`https://email-generation-backend-dev-ggwnhuypbq-uc.a.run.app/thread-emails/${threadID}`, {
            headers : {
              'Content-Type' : 'application/json'
            }
          })
          .then(res => {
            if (res.status === 200) {
              email_contents = res.data.ai_emails;
              console.log(email_contents);
              email_contents = '<pre style="white-space : pre-wrap">' + email_contents + '</pre>';
              composeView.setBodyHTML(email_contents);   
            } else {
              console.log(res.error);
            }
          });
        }
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
        /*
        const emailBody = new Vue({
          el: '#email-body',
          template: `
            <div id="mail-content" :style="fColorWhite">
              <div :style="[standard, header, fColorWhite, alignCenter]">
                <img id="logoIcon" src="https://raw.githubusercontent.com/Blue-BigTech/Moonhub-Images/master/icon.png" :style="[logoIcon]"/>
                <div :style="[headerTitle]">
                  <h3 :style="[standard, hTitle]"><a href="https://moonhub.ai/" target="_blank" :style="[textNone, fColorWhite, pointer]">M&#9864;onhub</a></h3>
                </div>
              </div>
              <div id="button-body" :style="[row, standard, alignLeft]">
                <div :style="button_body">
                  <template v-for="item in buttons">
                    <div>
                      <button 
                        :id="item.id" 
                        :style="[button, button_blue, alignCenter, fColorWhite]" 
                        @click="btnHandle"
                        :value="item.label"
                      >
                        {{ item.label }}
                      </button>
                    </div>
                  </template>
                </div>
              </div>
              <div id="text-body" :style="[row, paper]">
                <template v-for="label in labels">
                  <div :style="[fColorWhite]">
                    <h3 :style="[margin0]">{{label.title}}</h3>
                    <pre :style="[wrap, margin0]">{{label.content}}</pre>
                  </div>
                </template>
                <template v-if="userTextVisible == true">
                  <div :style="userTextStyle">
                    <div id="user-title" :style="[fColorWhite]">
                      <h3 :style="[margin0, noSendColor]">Additional Content(<= No Send) : &#x23CE;</h3>
                    </div>
                    <div id="user-text" :style="[margin0, fColorWhite]">&nbsp;</div>
                  </div>
                </template>
              </div>
              <div id="footer" :style="[footer]">
              </div>
            </div>
          `,
          methods:{
            inputPhoneHandle(event){
              phonenumber = event.target.value;
              let reg = /^-?\d*\.?\d*$/;
              if(reg.test(phonenumber)){
                this.contact.phone = phonenumber;
              }
            },
            btnHandle(event) {
              let id = parseInt(event.target.id);
              let label = event.target.value;
              this.labels.push(label);
              this.buttons = removeAt(this.buttons, id);
              let query = '';
              switch(id) {
                case 1:
                  query = "calendar/";
                  break;
                case 2:
                  query = "resume/";
                  break;
                case 3:
                  query = "resumeback/";
                  break;
              }
              query += label;
              const res = {
                data : {
                  subject : label,
                  content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis sagittis hendrerit. Nulla faucibus ante at ex finibus vulputate."
                }
              }
              this.labels.push({
                title : "",
                content : res.data.content
              });
              composeView.setSubject(res.data.subject);
              // axios.get(`http://127.0.0.1:5000/api/${query}`)
              // axios.get(`http://127.0.0.1:5000/api`)
              // .then(res => {
              //   if (res.status === 200) {
              //     mail_content = res.data.text;
              //     mail_content = makeMailContent(mail_content);
              //     composeView.setBodyHTML(mail_content);
              //   }
              // });
            }
          },
          mounted(){
            if(userText != '') {
              this.userTextVisible = true;
              this.userText = userText;
              document.getElementById("user-text").innerHTML = this.userText;
            }
            let threadID = composeView.getThreadID();
            if(threadID == ''){
              console.log('This is new email. Not reply!');
            }else{
              axios.get(`https://email-generation-backend-dev-ggwnhuypbq-uc.a.run.app/thread-emails/${threadID}`, {
                headers : {
                  'Content-Type' : 'application/json'
                }
              })
              .then(res => {
                if (res.status === 200) {
                  email_contents = res.data.emails[0];
                  console.log(email_contents);
                  this.labels.push({
                    title : '',
                    content : email_contents
                  });
                } else {
                  console.log(res.error);
                }
              });
            }
    
            // let logoIcon = document.getElementById("logoIcon");
            // logoIcon.src = chrome.extension.getURL('images/icon.png');
          },
          data() {
            return {
              buttons : [  
                // {id : 1, label : 'Send them my calendly'},
                // {id : 2, label : 'I have shared your resume with Together'},
                // {id : 3, label : 'I will share the resume and get back to you'}
              ],
              labels : [
              ],
              userText:"",
              userTextVisible : true,
              userTextStyle : {
                'padding' : '5px 0px'
              },
              contact : {
                phone: ''
              },
              wrap : {
                'white-space' : 'pre-wrap'
              },
              noSendColor : {
                'color' : '#1475E1'
              },
              fullWidth : {
                'width' : '100%'
              },
              header: {
                'padding': '13px 13px 3px 13px',
                'font-size': '15px',
                'display' : 'flex',
                'border-radius': '20px 20px 0px 0px' 
              },
              textNone : {
                'text-decoration': 'none'
              },
              pointer:{
                'cursor': 'pointer',
              },
              footer : {
                'display' : 'flex',
                'border-radius': '0px 0px 20px 20px',
                'background': '#303030',
                'padding' : '15px'
              },
              headerTitle: {
                'height' : '40px',
                'display' : 'table',
                'margin-left': '13px',
              },
              hTitle: {
                'display': 'table-cell',
                'vertical-align': 'middle',
                'height' : '20px',
              },
              logoIcon:{
                'width' : '40px',
                'height' : '40px',
              },
              input_contact: {
                'display' : 'flex'
              },
              input_contact_child: {
                'margin-left' : '13px',
                'padding' : '5px 0px'
              },
              fColorWhite : {
                'color': 'white',
              },
              alignCenter : {
                'text-align': 'center',
              },
              alignRight : {
                'text-align': 'right',
              },
              alignLeft : {
                'text-align': 'left',
              },
              paper:{
                'background': '#505050',
                'padding': '0px 10px',
              },
              standard : {
                'margin': '0',
                'background': '#303030',
              },
              margin0 : {
                'margin': '0',
              },
              row : {
                'display' : 'block'
              },
              button : {
                'background-color': '#4CAF50',
                'border': 'none',
                'color': 'white',
                'colorHover': 'white',
                'padding': '10px 20px',
                'text-decoration': 'none',
                'display': 'inline-block',
                'font-size': '14px',
                'margin': '4px 2px',
                'transition-duration': '0.4s',
                'cursor': 'pointer',
                'user-select': 'none'
              },
              button_blue : {
                'background-color': '#1475E1',
                'border': '2px solid #1475E1',
                'border-radius': '10px',
                'font-weight': 'bold',
              },
              button_body : {
                'padding': '5px',
              }   
            }
          },
        });
        */
        async function isLoggedIn(...args){
          const logValue = localStorage.getItem("login");
          return logValue == 'true';
        }

        function removeAt(arr, id) {
          return arr.filter((obj) => obj.id !== id);
        }

        function getUserText(content) {
          if(content.search("mail-content") == -1) return content;
          let parser = new DOMParser();
          let doc = parser.parseFromString(content, 'text/html');
          let userText = '';
          try {
            const user_text = doc.getElementById("user-text");
            userText = user_text.innerHTML;
          } catch (error) {
            console.log("No user text!")
          }
          return userText;
        }
      },
    });
    composeView.on('presending', (event) => {
      // let content = composeView.getHTMLContent();
      // content = getMailContent(content);
      // composeView.setBodyHTML(content);

      // function getMailContent(content) {
      //   let parser = new DOMParser();
      //   let doc = parser.parseFromString(content, 'text/html');
      //   const text_body = doc.getElementById("text-body").innerHTML;
      //   try {
      //     doc.getElementById("button-body").remove();
      //     doc.getElementById("user-title").remove();
      //   } catch (error) {
      //     console.log("No item to remove!")
      //   }
      //   let userTextConent = doc.getElementById("user-text").innerText;
      //   if(userTextConent.length == 0) 
      //     doc.getElementById("user-text").remove();
      //   let mail = doc.getElementById("mail-content");
      //   if(mail != null){
      //     content = mail.innerHTML;
      //   }
      //   return content;
      // }
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
