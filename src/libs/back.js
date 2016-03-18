function tt(info, tab) {
    var url = "/qrcode.html#" + encodeURIComponent(info.pageUrl);
    chrome.tabs.create({
        "url": url,
        "active": true
    });
    return true;
}

chrome.contextMenus.create({
    type: 'normal',
    title: 'Tools',
    id: 'tools',
    contexts: ['page', 'link', 'selection']
});

chrome.contextMenus.create({
    type: 'normal',
    title: '生成二维码',
    id: 'qr',
    parentId: 'tools',
    onclick: tt,
    contexts: ['page', 'link', 'selection']
});

chrome.webRequest.onCompleted.addListener(function(details) {
    if (details.type !== 'main_frame')
        return;
    if ('undefined' === typeof(address)) {
        address = [];
    }
    address[details.tabId] = details.ip;
    chrome.tabs.executeScript(details.tabId, {
        code: 'document.onreadystatechange = function() { if (\'complete\' !== document.readyState) { return; } var body = document.getElementsByTagName(\'body\')[0]; var ip = document.createElement(\'a\'); ip.href = \'javascript:;\'; ip.style.display = \'block\'; ip.style.textDecoration = \'none\'; ip.style.backgroundColor = \'#333\'; ip.style.lineHeight = \'1.2em\'; ip.style.position = \'fixed\'; ip.style.bottom = \'15px\'; ip.style.left = \'5px\'; ip.style.zIndex = \'2147483647\'; ip.style.color = \'#fff\'; ip.style.padding = \'0 1em\'; ip.style.borderRadius = \'10px\'; ip.style.fontWeight = \'bold\'; ip.style.opacity = \'0.6\'; ip.style.fontSize = \'20px\'; ip.innerHTML = \'' + address[details.tabId] + '\'; ip.id = \'shield-ip\'; ip.onclick = function() { ip.style.display = \'none\'; }; body.appendChild(ip);}',
        runAt: 'document_end'
    }, function() {
        delete address[details.tabId];
    });
}, {
    'urls': ['*://*/*']
}, ['responseHeaders']);

function createNotification(msg) {
    chrome.notifications.create('shiled-tools', {
        type: 'basic',
        title: 'shiled-tools',
        iconUrl: 'Images/48.png',
        message: msg
    }, function() {});
}

chrome.omnibox.onInputEntered.addListener(function(text, disposition) {
    $.ajax({
        url: 'http://127.0.0.1:3000/deploy',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {
            command: text,
        },
        success: function(data) {
            var msg = '部署' + text + '服务器成功';
            if (!data.flag) {
                msg = '部署' + text + '服务器失败';
            }
            createNotification(msg);
        },
        error: function() {
            createNotification('链接服务器失败');
        }
    });
});

var source = new EventSource("http://127.0.0.1:3000/localmessage");
source.onmessage = function(event) {
    var data = JSON.parse(event.data);
    var msg = '部署' + data.msg + '服务器成功';
    if (!data.flag) {
        msg = '部署' + data.msg + '服务器失败';
    }
    createNotification(msg);
};
source.onerror = function(event) {
    console.log(event);
};