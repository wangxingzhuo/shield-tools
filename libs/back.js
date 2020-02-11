function tt(info, tab) {
  var url = "/qrcode.html#" + encodeURIComponent(info.pageUrl);
  chrome.tabs.create({
    "url": url,
    "active": true
  });
  return true;
}

chrome.contextMenus.create({
  id: 'qr',
  type: 'normal',
  title: '生成二维码',
  contexts: ['page', 'link', 'selection'],
  onclick: tt
});

var address = {};

chrome.webRequest.onCompleted.addListener(function(details) {
  if (details.type !== 'main_frame') return;
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
