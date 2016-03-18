function setQR(url) {
    var foo = {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.H
    };
    var qrArea = document.getElementById('qrArea');
    qrArea.innerHTML = "";
    //foo.width = qrArea.innerWidth +"px";
    //foo.height = qrArea.innerWidth +"px";
    var qrcode = new QRCode(qrArea, foo);
}

var url = decodeURIComponent(window.location.hash.substring(1));
setQR(url);
var qrText = document.getElementById('qrText');
qrText.innerHTML = url;