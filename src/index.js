class LaunchDarklyTool {
  flags;
  isReady;
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    $(() => {
      $('.prompt')
        .off('keyup')
        .on('keyup', (s) => {
          this.filterFlags( $('.prompt').val());
        });

    });
  }

  setFlags(flags){
    this.flags = flags;
    this.renderFlags(Object.keys(flags));
  }

  start(){
    this.isReady = true;
    if(this.flags){
      this.renderFlags(Object.keys(this.flags));
    }
  }


  filterFlags(filter){
    if(this.flags) {
      const filteredFlags = Object.keys(this.flags).filter( flag => flag.toUpperCase().indexOf(filter.toUpperCase()) > -1  );
      this.renderFlags(filteredFlags);
    }
      }

  renderFlags(flagKeys){
    const nodes = flagKeys.map( (values) => {
      const val = this.flags[values].value;
      const node = $(`<div class="item">
          <i class="small middle aligned icon ${val === true ? 'circle green' : val === false ? 'circle red' : 'flag blue'}"></i>
          <div class="content">${values}</div>
        </div>`);
      node.on('click', (event) =>{
        this.renderValues(event.target.innerText)
      });

      return node;
    })
    $("#flags").html( nodes);
  }

  renderValues(key){
    const values = this.flags[key];
    const nodes = Object.keys(values).map( key => {
      return `<div> ${key} : ${values[key]} </div>`;
    });

    $('#values').html(nodes);
  }
}


const mixpanelTool = new LaunchDarklyTool();


//Handler request from background page
chrome.extension.onMessage.addListener(function (message, sender) {
  console.log(message.flags);
  if(message.flags){
    mixpanelTool.setFlags(JSON.parse(message.flags));
    if(mixpanelTool.isReady){
      mixpanelTool.start();
    }
  }
});


$(function () {
  mixpanelTool.start();
});
