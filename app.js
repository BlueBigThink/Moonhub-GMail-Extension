InboxSDK.loadScript('https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js')
InboxSDK.loadScript('https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js')

InboxSDK.load(2, 'sdk_moonhub-inbox_d80d2bf259').then(function(sdk){
   // the SDK has been loaded, now do something with it!
   sdk.Compose.registerComposeViewHandler(function(composeView){
     // a compose view has come into existence, do something with it!
    composeView.addButton({
      title: "Moonhub",
      iconUrl: chrome.extension.getURL('images/icon.png'),
      onClick: function(event) {
        // const content = composeView.getHTMLContent();
        // let newContent = getMailContent(content);
        let email_Body = '<div id="email-body"></div>';
        // newContent += mainButtonBody;
        // composeView.setBodyHTML(newContent);
        composeView.setBodyHTML(email_Body);

        const emailBody = new Vue({
          el: '#email-body',
          template: `
            <div :style="fColorWhite">
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
                <template v-for="txt in label">
                  <div>
                    <span>{{txt}}<br/>{{lorem.txt}}</span>
                  </div>
                </template>
              </div>
              <div id="footer" :style="[footer]">
                <div :style="[fColorWhite, alignCenter]">
                </div>
              </div>
            </div>
          `,
          methods:{
            btnHandle(event) {
              let id = parseInt(event.target.id);
              this.label.push(event.target.value);              
              this.buttons = removeAt(this.buttons, id);
              let subject = '';
              switch(id) {
                case 1:
                  subject = "Calendar";
                  break;
                case 2:
                  subject = "Share Resume";
                  break;
                case 3:
                  subject = "Get back to you";
                  break;
              }
              composeView.setSubject(subject);
              // axios.get(`http://127.0.0.1:5000/api/${query}`)
              // axios.get(`http://127.0.0.1:5000/api`)
              // .then(res => {
              //   if (res.status === 200) {
              //     mail_content = res.data.text;
              //     mail_content = makeMailContent(mail_content);
              //     composeView.setBodyHTML(mail_content);
              //   }
              // });
              //For Test
              // axios.get(`https://dog.ceo/api/breeds/image/random`)
              // .then(res => {
              //   if (res.status === 200) {
              //     mail_content = res.data.message;
              //     mail_content = makeMailContent(mail_content);
              //     composeView.setBodyHTML(mail_content);
              //   }
              // });
            }
          },
          // mounted(){
          //   let logoIcon = document.getElementById("logoIcon");
          //   logoIcon.src = chrome.extension.getURL('images/icon.png');
          // },
          data() {
            return {
              buttons : [  
                {id : 1, label : 'Send them my calendly'},
                {id : 2, label : 'I have shared your resume with Together'},
                {id : 3, label : 'I will share the resume and get back to you'}
              ],
              lorem : {
                txt : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis sagittis hendrerit. Nulla faucibus ante at ex finibus vulputate.",
              },
              label : [
              ],
              header: {
                'padding': '13px 3px 3px 13px',
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
                'height': '30px',
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

        function removeAt(arr, id) {
          return arr.filter((obj) => obj.id !== id);
        }

        function getMailContent(content, addition = "") {
          let parser = new DOMParser();
          let doc = parser.parseFromString(content, 'text/html');
          try {
            doc.getElementById("button-body").remove();
          } catch (error) {
            console.log("No button body!")
          }
          let mail = doc.getElementById("mail-content");
          if(mail != null){
            content = mail.innerHTML;
          }
          if(addition != "") content += addition;
          let new_content = '<div id="mail-content">' + content + '</div>';
          return new_content;
        }
      },
    });
    composeView.on('presending', (event) => {
      let content = composeView.getHTMLContent();
      content = getMailContent(content);
      composeView.setBodyHTML(content);

      function getMailContent(content) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(content, 'text/html');
        const text_body = doc.getElementById("text-body").innerHTML;
        try {
          doc.getElementById("button-body").remove();
        } catch (error) {
          console.log("No button body!")
        }
        let mail = doc.getElementById("mail-content");
        if(mail != null){
          content = mail.innerHTML;
        }
        content += text_body;
        let new_content = '<div id="mail-content">' + content + '</div>';
        return new_content;
      }
    });
    composeView.on('sent', (event) => {
      const threadID = composeView.getThreadID();
      console.log("Sent ========>", threadID);
    });
  });
});
