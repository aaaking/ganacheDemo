var serialNumber; //交易号 -- call返回
var txhash; //交易hash  -- option返回

var lastReturnPayInfo = false;

function CallOption(_listener = undefined, _name = "", _desc = "", _orderId = "", _ext = "",
    _showQRCode = false, _container = undefined, _callback = undefined, _nrc20 = undefined) {
    if (_listener) {
           var defaultOptions = {
            goods: {    	        	 //Dapp端对当前交易商品的描述信息，app暂时不展示
                name: _name,      		 //商品名称
                desc: _desc,      		 //描述信息
                orderId: _orderId,   	 //订单ID
                ext: _ext         		 //扩展字段
            },
            qrcode: {
                showQRCode: _showQRCode, //是否显示二维码信息
                container: _container    //指定显示二维码的canvas容器，不指定则生成一个默认canvas
            },
            // callback 是记录交易返回信息的交易查询服务器地址，不指定则使用默认地址
            //callback:  Web3.nebpay.config.mainnetUrl,
            // listener: 指定一个listener函数来处理交易返回信息（仅用于浏览器插件，App钱包不支持listener）
            listener: _listener,

            nrc20: _nrc20
        }

         return defaultOptions;
   }
    else {

        defaultOptions = {
            goods: {    	        	 //Dapp端对当前交易商品的描述信息，app暂时不展示
                name: _name,      		 //商品名称
                desc: _desc,      		 //描述信息
                orderId: _orderId,   	 //订单ID
                ext: _ext         		 //扩展字段
            },
            qrcode: {
                showQRCode: _showQRCode, //是否显示二维码信息
                container: _container    //指定显示二维码的canvas容器，不指定则生成一个默认canvas
            },
            // callback 是记录交易返回信息的交易查询服务器地址，不指定则使用默认地址
            //callback: Web3.nebpay.config.mainnetUrl,
            // listener: 指定一个listener函数来处理交易返回信息（仅用于浏览器插件，App钱包不支持listener）
            listener: function (_serialNumber) {
                txhash = _serialNumber.txhash;
                var obj = { "hash": txhash };

                GetTransactionReceipt(obj);
            },

            nrc20: _nrc20
        }

        return defaultOptions;
    }
}

var IsMobile = false;
var oneNonce = false;
function NebPayCall(funcName, args, options, price = 0, isHatch = 0)//调用NebPay--Call
{
    if (isHatch == 0) {
        price = Math.ceil(price * 100) / 100;
    }

    var serialNumber1 = nebPay.call("n1nTG2pKy1356u8TtBKjP4vgMQkBWmukGp1", price, funcName, JSON.stringify(args), options);
    serialNumber = serialNumber1;

    if (IsMobile) {
        options.listener();
    }
}

export {
  CallOption,NebPayCall
}
