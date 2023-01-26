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
        const content = composeView.getHTMLContent();
        let newContent = getMailContent(content);
        let mainButtonBody = '<div id="main-button-body"></div>';
        newContent += mainButtonBody;
        composeView.setBodyHTML(newContent);

        const mainBtnBody = new Vue({
          el: '#main-button-body',
          template: `
            <div id="button-body" :style="row">
              <template v-for="item in buttons">
                <div>
                  <button 
                    :id="item.id" 
                    :style="[button, button_blue]" 
                    @click="btnHandle"
                    :value="item.label"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </template>
              <div id="text-body" :style="row">
                <template v-for="txt in label">
                  <div>
                    <span>{{txt}}</span>
                  </div>
                </template>
              </div>
            </div>
          `,
          methods:{
            btnHandle(event) {
              let id = parseInt(event.target.id);
              this.label.push(event.target.value);              
              this.buttons = removeAt(this.buttons, id);
              // let query = '';
              // switch(id) {
              //   case 1:
              //     query = "calendar";
              //     break;
              //   case 2:
              //     query = "resume";
              //     break;
              //   case 3:
              //     query = "job";
              //     break;
              // }
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
          data() {
            return {
              buttons : [  
                {id : 1, label : 'Send them my calendly'},
                {id : 2, label : 'I have shared your resume with Together'},
                {id : 3, label : 'I will share the resume and get back to you'}
              ],
              label : [
              ],
              row : {
                'display' : 'block'
              },
              button : {
                'background-color': '#4CAF50',
                'border': 'none',
                'color': 'white',
                'colorHover': 'white',
                'padding': '10px 20px',
                'text-align': 'center',
                'text-decoration': 'none',
                'display': 'inline-block',
                'font-size': '14px',
                'margin': '4px 2px',
                'transition-duration': '0.4s',
                'cursor': 'pointer',
                'user-select': 'none'
              },
              button_blue : {
                'background-color': 'white',
                'color': 'black',
                'border': '2px solid #000000',
                'border-radius': '10px'
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
