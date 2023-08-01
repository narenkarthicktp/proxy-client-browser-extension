let proxyOn = false;

function loadSettings()
{
    function fillInputs(item)
    {
        document.getElementById("host").value = item.proxySettings.host;
        document.getElementById("port").value = item.proxySettings.port;
        document.querySelector('#type [value="' + item.proxySettings.type + '"]').selected = true;
        document.getElementById("username").value = item.proxySettings.username;
        document.getElementById("password").value = item.proxySettings.password;
        document.getElementById("proxyDNS").checked = item.proxySettings.proxyDNS;
        document.getElementById("ignoreLocal").checked = item.ignoreLocal;
    }
    let promise = browser.storage.local.get({
        ignoreLocal: true,
        proxySettings: {
          type: 'direct',
          host: '',
          port: 0,
          username: '',
          password: '',
          proxyDNS: false
        }
      });
    promise.then(fillInputs, (error)=>console.log(`error: ${error}`));
}
function saveSettings()
{
    browser.storage.local.set({
        proxySettings: {
            type: document.getElementById("type").value,
            host: document.getElementById("host").value,
            port: document.getElementById("port").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            proxyDNS: document.getElementById("proxyDNS").checked
        },
        ignoreLocal: document.getElementById("ignoreLocal").checked
    });
}
function toggleProxy(proxyOn)
{
    browser.runtime.sendMessage({context: "proxyState", proxyOn: proxyOn});
    saveSettings();
}

document.addEventListener("DOMContentLoaded", loadSettings);
document.getElementById("connect").onclick = () => toggleProxy(true);
document.getElementById("disconnect").onclick = () => toggleProxy(false);