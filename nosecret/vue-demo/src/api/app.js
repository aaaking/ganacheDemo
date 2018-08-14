import fetch from '@/utils/fetch';
import nebConfig from '@/utils/nebConfig'
// export default {
//   list: () => fetch({
//     url: '/dollars/testzzh',
//     methods: 'get'
//   }),
// list: () => fetch.get('/dollars/testzzh')
// }

var NebPay = window.NebPay;
var nebPay = new NebPay();
var nebulas = window.nebulas;
var HttpRequest = nebulas.HttpRequest;
var Neb = nebulas.Neb;
var neb = new Neb();
neb.setRequest(new HttpRequest("https://testnet.nebulas.io"));

export default {
  list: () => new Promise((resolve, reject) => {
    var callFunction = "get";
    var callArgs = "[\"title\"]";
    var contract = {
      "function": callFunction,
      "args": callArgs
    }
    neb.api.call(nebConfig.account.address, nebConfig.dappContactAddress, 0, 0, "1000000", "2000000", contract)
      .then(function (resp) {
        var result = JSON.parse(resp.result)
        if (result) {
          if (!result.execute_err) {
            resolve(result)
          } else {
            reject(result.execute_err)
          }
        } else {
          reject('resp.result is null')
        }
      })
      .catch(err => reject(err))
  })
}
