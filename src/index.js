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
                    this.filterFlags($('.prompt').val());
                });
        });
    }

    setFlags(flags) {
        this.flags = flags;
        this.renderFlags(Object.keys(flags));
    }

    start() {
        this.isReady = true;
        if (this.flags) {
            this.renderFlags(Object.keys(this.flags));
        }
    }


    filterFlags(filter) {
        if (this.flags) {
            const filteredFlags = Object.keys(this.flags).filter(flag => flag.toUpperCase().indexOf(filter.toUpperCase()) > -1);
            this.renderFlags(filteredFlags);
        }
    }

    renderFlags(flagKeys) {
        const nodes = flagKeys.map((key) => {
            const val = this.flags[key].value;
            const valueHtml = this.valuesHtml(key);
            const node = $(`
            <div class="item">
                <i class="small middle aligned icon ${val === true ? 'circle green' : val === false ? 'circle red' : 'flag blue'}"></i>
                <div class="content">
                    <div class="header">${key}</div>
                    <div class="description code">${val}</div>
                </div>
                <div class="details">${valueHtml}</div>
            </div>`);
            node.find('.content').on('click', function (event) {
                const thisDetails = $(this).parent().find('.details');
                const isVisible = thisDetails.hasClass('visible');
                $('.details').removeClass('visible');
                if(!isVisible){
                    $(this).parent().find('.details').addClass('visible');
                }

            });

            return node;
        })
        $("#flags").html(nodes);
    }

    valuesHtml(key) {
        const values = this.flags[key];

       // return `<pre class="ui code json">${JSON.stringify(values, null, 2)}</pre>`;
        const rows = Object.keys(values).map(key => {
            return `<tr>
                        <td>${key}</td>
                        <td><pre>${JSON.stringify(values[key], null, 2)}</pre></td>
                    </tr>`;
        }).join('');
        return `<table class="ui very small table unstackable compact striped flag-data"><tbody>
                   ${rows}
                </tbody></table>`;
    }
}


const mixpanelTool = new LaunchDarklyTool();


//Handler request from background page
chrome.extension.onMessage.addListener(function (message, sender) {
    if (message.flags) {
        mixpanelTool.setFlags(JSON.parse(message.flags));
        if (mixpanelTool.isReady) {
            mixpanelTool.start();
        }
    }
    chrome.extension.sendMessage('cool');
    return true;
});


$(function () {
    mixpanelTool.start();
});
