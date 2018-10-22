var pay = function (txObj) {
    // var url = "openapp.NASnano://virtual?params=" + JSON.stringify(txObj);
    var url = "bipa://com.bipa.wallet/main?params=" + JSON.stringify(txObj);
    window.location.href = url// = "http://www.baidu.com";
}




export default { pay }
