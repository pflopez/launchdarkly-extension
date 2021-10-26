let flagsBody;

// Create a tab in the devtools area
chrome.devtools.panels.create(
    'LD Flags',
    'logo.png',
    'panel.html',
    function (panel) {
        panel.onShown.addListener( extPanelWindow => {
            chrome.runtime.sendMessage({
                flags: flagsBody
            });

        })
    }
);


// esto anda, bien nosotro
chrome.devtools.network.onRequestFinished.addListener(request => {

    if (request?.request?.url?.startsWith('https://app.launchdarkly.com/sdk/')) {
        request.getContent((body) => {
            flagsBody = body;
            chrome.runtime.sendMessage({
                flags: flagsBody
            });
        });


    }
});
