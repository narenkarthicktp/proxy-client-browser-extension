const DEFAULT_SETTINGS = {
    type: '',
    host: '',
    port: 0,
    username: '',
    password: '',
    proxyDNS: false
};

let proxySettings = DEFAULT_SETTINGS;
let ignoreLocalhost = true;
let proxyOn = false;

function refreshIcon(message)
{
    console.log(proxyOn);
    console.log(message);
    if(message.context === 'proxyState')
    {
        proxyOn = message.proxyOn;
        if(proxyOn)
        {
            browser.browserAction.setIcon({path: "icons/on.svg"});
            browser.browserAction.setTitle({title: "Proxy Client [ON]"});
        }
        else
        {
            browser.browserAction.setIcon({path: "icons/off.svg"});
            browser.browserAction.setTitle({title: "Proxy Client [OFF]"});
        }
    }
}

function updateSettings(settings)
{
    if("proxySettings" in settings)
        proxySettings = settings.proxySettings.newValue;
    if("ignoreLocal" in settings)
        ignoreLocalhost = settings.ignoreLocal.newValue;
    console.log(proxySettings);
    console.log(ignoreLocalhost);
}

function handleProxyRequest(request)
{
    if(proxyOn)
    {
        if(ignoreLocalhost)
        {
            let url = new URL(request.url);
            if(url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1")
                return {type: "direct"};
        }
        console.log(proxySettings);
        return proxySettings;
    }
    return {type: "direct"};
}

browser.storage.onChanged.addListener(updateSettings);
browser.proxy.onRequest.addListener(handleProxyRequest, {urls: ["<all_urls>"]});
browser.runtime.onMessage.addListener(refreshIcon);
