/**
 * MixpanelTool chrome extension
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @classname MixpanelTool
 */
class MixpanelTool {
  constructor() {
    this.state = {
      requests: {},
      flags: {},
      selectedRequest: {},
      count: 0,
      omitMixpanelProperty: false,
      record: true,
    };
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


  filterFlags(filter){
    console.log(filter);
    if(this.state.flags) {
      const filteredFlags = Object.keys(this.state.flags).filter( flag => flag.toUpperCase().indexOf(filter.toUpperCase()) > -1  );
      this.renderFlags(filteredFlags);
    }


  }


  handleLaunchDarklyRequest(requestObject){
    if(this.state.record && this.isRequestLaunchDarkly(requestObject)){
      let properties = {};
      let base64EncodedData = '';
      let mixpanelRequest = {};
      let urlParams = '';

      try{
        if (requestObject.request.method === 'GET') {

          requestObject.getContent(c => {
            let flags = JSON.parse(c);
            if(flags){
              this.state.flags = flags;
              this.renderFlags(Object.keys(flags));
            }
          });


        }
      } catch (error) {
        console.error('error', error);
      }
    }
  }

  isRequestLaunchDarkly(requestObject){
    if (requestObject && requestObject.request && requestObject.request.url) {
      return requestObject.request.url.startsWith('https://app.launchdarkly.com/sdk/');
    }
    return false;
  }




  renderFlags(flagKeys){

    const nodes = flagKeys.map( (values) => {
      const val = this.state.flags[values].value;
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
    const values = this.state.flags[key];
    const nodes = Object.keys(values).map( key => {
      return `<div> ${key} : ${values[key]} </div>`;
    });

    $('#values').html(nodes);
  }



  scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  manageScrollToTop() {
    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        $('#scroll-up-btn').show();
      } else {
        $('#scroll-up-btn').hide();
      }
    }
  }
}

// ready function for jQuery
$(function () {
  // create mixpanel tool instance
  const mixpanelTool = new MixpanelTool();
  devToolsNetworkListener((request) =>
    mixpanelTool.handleLaunchDarklyRequest(request)
  );
});
