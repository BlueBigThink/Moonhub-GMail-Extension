InboxSDK.loadScript('https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js')
InboxSDK.loadScript('https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js')

InboxSDK.load(2, 'sdk_moonhub-inbox_d80d2bf259').then(function(sdk){
   // the SDK has been loaded, now do something with it!
   sdk.Compose.registerComposeViewHandler(function(composeView){
     // a compose view has come into existence, do something with it!
    composeView.addButton({
      title: "Add Nifty",
      iconUrl: chrome.extension.getURL('icon.png'),
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
                  >
                    {{ item.label }}
                  </button>
                </div>
              </template>
            </div>
          `,
          methods:{
            btnHandle(event) {
              let id = parseInt(event.target.id);
              let mail_content = '';
              switch(id) {
                case 1:
                  mail_content = "<div>Send them my calendly</div>";
                  break;
                case 2:
                  mail_content = "<div>Ask them for their resume</div>";
                  break;
                case 3:
                  mail_content = "<div>Send them the job description</div>";
                  break;
              }
              let content = composeView.getHTMLContent();
              content = getMailContent(content, mail_content);
              composeView.setBodyHTML(content);
            }
          },
          data() {
            return {
              buttons : [  
                {id : 1, label : 'Send them my calendly'},
                {id : 2, label : 'Ask them for their resume'},
                {id : 3, label : 'Send them the job description'}
              ],
              row : {
                'display' : 'block'
              },
              button : {
                'background-color': '#4CAF50',
                // 'backgroundColor': '#4CAF50',
                // 'backgroundColorHover': '#4CAFF0',
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
    });
    composeView.on('sent', (event) => {
      const threadID = composeView.getThreadID();
      console.log("Sent ========>", threadID);
      // axios.get(`https://fastapi.com/email?threadID=${123456789}&key=[xxxxxxxxxxxx]`)
      //   .then(res => {
      //     if (res.status === 200) {
      //       result = res.data;
      //       console.log(result)
      //     }
      //   });
    });
      
  });
});

 
