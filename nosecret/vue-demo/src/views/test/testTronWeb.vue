<template>
  <div class="testTronWeb">
          <p style="font-size:0.35rem">工具方法</p>
          <input type="text" name="bigNumber" id="bigNumber" v-model="bigNumberResult"/>
          <input type="button" value="toBigNumber" @click="calkcBigNumber">
          &nbsp;&nbsp;{{bigNumberResult}}

          <div class="line_01">toHex、fromHex</div>

          <input type="text" name="toHex" id="toHex" ref="toHex" value="TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY" />
          <input type="button" value="toHex" @click="toHex">
          &nbsp;&nbsp;{{toHexStr}}
          <br>
          <input type="text" name="fromHex" id="fromHex" ref="fromHex" value="41BBC8C05F1B09839E72DB044A6AA57E2A5D414A10" />
          <input type="button" value="fromHex" @click="fromHex">
          &nbsp;&nbsp;{{fromHexStr}}
          <br><br>
          <input type="text" name="trxToSun" id="trxToSun" ref="trxToSun" value="1" />
          <input type="button" value="trxToSun" @click="trxToSun">
          &nbsp;&nbsp;{{trxToSunStr}}
          <br>
          <input type="text" name="sunToTrx" id="sunToTrx" ref="sunToTrx" value="1" />
          <input type="button" value="sunToTrx" @click="sunToTrx">
          &nbsp;&nbsp;{{sunToTrxStr}}<br>

          <br>
          <p style="font-size:0.35rem">账号管理</p>
          <input type="text" ref="getBalance" value="TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY" /><input type="button" value="getBalance" @click="getBalance">&nbsp;&nbsp;{{balance}}<br>
          <input type="button" value="generateAddressOnClient" @click="generateAddressOnClient">&nbsp;&nbsp;{{generateAddressOnClientRes}}<br>
          <input type="text" ref="validateAddress" value="1" /><input type="button" value="validateAddress" @click="validateAddress">&nbsp;&nbsp;{{validateAddressRes}}<br>
          <input type="passwordType" ref="createAddress" value="1111" /><input type="button" value="createAddress" @click="createAddress">&nbsp;&nbsp;{{createAddressRes}}<br>
          <input type="text" ref="name" value="zzh" /><input type="text" ref="address" value="TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY" /><input type="button" value="updateAccount" @click="updateAccount">&nbsp;&nbsp;{{updateAccountRes}}<br>
          <br>
          <p style="font-size:0.35rem">节点查询</p>
          <input type="button" value="listNodes" @click="listNodes">&nbsp;&nbsp;{{listNodesRes}}<br>

          <br>
          <p style="font-size:0.35rem">块查询</p>
          <input type="button" value="blockNumber" @click="blockNumber">&nbsp;&nbsp;{{blockNumberRes}}<br>
          <input type="text" ref="getBlockStr" value="2" /><input type="button" value="getBlock" @click="getBlockStr">&nbsp;&nbsp;{{getBlockStrRes}}<br>
          <input type="text" ref="getBlockTransactionCount" value="2" /><input type="button" value="getBlockTransactionCount" @click="getBlockTransactionCount">&nbsp;&nbsp;{{getBlockTransactionCountRes}}<br>
          <br>
          <p style="font-size:0.35rem">交易管理</p>
          <input type="text" ref="to" value="TLb4a7TCBUbLcqX9sQdCX9mdCDo7Br16Ng"/>&nbsp;&nbsp;<input type="text" ref="from" value="TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY"/>&nbsp;&nbsp;<input type="text" ref="value" value="2"/>&nbsp;&nbsp;<input type="button" value="createTransaction" @click="createTransaction">&nbsp;&nbsp;{{createTransactionRes}}<br>
          <input type="text" ref="transaction" v-model="createTransactionRes"/>&nbsp;&nbsp;<input type="text" ref="pk" value="da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0"/>&nbsp;&nbsp;<input type="text" ref="terminal" value="0"/>&nbsp;&nbsp;<input type="button" value="signTransaction" @click="signTransaction">&nbsp;&nbsp;{{signTransactionRes}}<br>
          <input type="button" value="sendRawTransaction" @click="sendRawTransaction">&nbsp;&nbsp;{{sendRawTransactionRes}}<br>
          <input type="text" ref="sendFrom" value="TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY"/>&nbsp;&nbsp;<input type="text" ref="sendTo" value="TLb4a7TCBUbLcqX9sQdCX9mdCDo7Br16Ng"/>&nbsp;&nbsp;<input type="text" ref="sendValue" value="2"/>&nbsp;&nbsp;<input type="text" ref="sendPK" value="da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0"/>&nbsp;&nbsp;<input type="button" value="sendTransaction" @click="sendTransaction">&nbsp;&nbsp;{{sendTransactionRes}}<br>
          <br>
          <p style="font-size:0.35rem">智能合约</p>
          <textarea name="" ref="contractNewAbi" style="width:100%;height:300px;"/><br>
          <p>私钥 <input type="text" ref="contractNewPK" value="da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0"/><br></p>
          <p> from-部署合约的账户地址 <input ref="newAbiFrom" type="text" value="TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY"></p>
          <p> data是compile出来的bytecode  <input ref="newAbiData" type="text" value="608060405234801561001057600080fd5b5033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061100c806100616000396000f3006080604052600436106100da576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168062ce8e3e146100df5780630900f010146101db57806311114af11461021e5780631ab06ee514610300578063223eb640146103375780632c841f5814610362578063365b98b2146103df578063445df0ac146104365780636b8ff574146104615780638da5cb5b146105075780639507d39a1461055e578063954ab4b21461059f578063a8293c281461062f578063b69ea68414610674578063fdacd576146106ce575b600080fd5b3480156100eb57600080fd5b506100f46106fb565b60405180806020018060200180602001848103845287818151815260200191508051906020019060200280838360005b8381101561013f578082015181840152602081019050610124565b50505050905001848103835286818151815260200191508051906020019060200280838360005b83811015610181578082015181840152602081019050610166565b50505050905001848103825285818151815260200191508051906020019060200280838360005b838110156101c35780820151818401526020810190506101a8565b50505050905001965050505050505060405180910390f35b3480156101e757600080fd5b5061021c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061089b565b005b34801561022a57600080fd5b50610285600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610984565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102c55780820151818401526020810190506102aa565b50505050905090810190601f1680156102f25780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561030c57600080fd5b50610335600480360381019080803590602001909291908035906020019092919050505061098e565b005b34801561034357600080fd5b5061034c6109e0565b6040518082815260200191505060405180910390f35b34801561036e57600080fd5b506103c9600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506109ea565b6040518082815260200191505060405180910390f35b3480156103eb57600080fd5b5061040a600480360381019080803590602001909291905050506109fc565b604051808481526020018360001916600019168152602001828152602001935050505060405180910390f35b34801561044257600080fd5b5061044b610a35565b6040518082815260200191505060405180910390f35b34801561046d57600080fd5b5061048c60048036038101908080359060200190929190505050610a3b565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104cc5780820151818401526020810190506104b1565b50505050905090810190601f1680156104f95780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561051357600080fd5b5061051c610a6d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561056a57600080fd5b5061058960048036038101908080359060200190929190505050610a93565b6040518082815260200191505060405180910390f35b3480156105ab57600080fd5b506105b4610ab0565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156105f45780820151818401526020810190506105d9565b50505050905090810190601f1680156106215780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561063b57600080fd5b5061065a60048036038101908080359060200190929190505050610aed565b604051808215151515815260200191505060405180910390f35b34801561068057600080fd5b506106ad600480360381019080803560001916906020019092919080359060200190929190505050610b40565b60405180838152602001821515151581526020019250505060405180910390f35b3480156106da57600080fd5b506106f960048036038101908080359060200190929190505050610bea565b005b6060806060600060608060606000610711610fbb565b6000805490509550856040519080825280602002602001820160405280156107485781602001602082028038833980820191505090505b5094508560405190808252806020026020018201604052801561077a5781602001602082028038833980820191505090505b509350856040519080825280602002602001820160405280156107ac5781602001602082028038833980820191505090505b509250600091505b85821015610887576000828154811015156107cb57fe5b9060005260206000209060030201606060405190810160405290816000820154815260200160018201546000191660001916815260200160028201548152505090508060000151858381518110151561082057fe5b90602001906020020181815250508060200151848381518110151561084157fe5b9060200190602002019060001916908160001916815250508060400151838381518110151561086c57fe5b906020019060200201818152505081806001019250506107b4565b848484985098509850505050505050909192565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610980578190508073ffffffffffffffffffffffffffffffffffffffff1663fdacd5766003546040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561096757600080fd5b505af115801561097b573d6000803e3d6000fd5b505050505b5050565b6060819050919050565b60405180807f7878730000000000000000000000000000000000000000000000000000000000815250600301905060405180910390a08060046000848152602001908152602001600020819055505050565b6000600354905090565b60006109f582610c4b565b9050919050565b600081815481101515610a0b57fe5b90600052602060002090600302016000915090508060000154908060010154908060020154905083565b60035481565b6060610a66600083815481101515610a4f57fe5b906000526020600020906003020160010154610dbf565b9050919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060046000838152602001908152602001600020549050919050565b60606040805190810160405280600e81526020017f68656c6c6f206d73686b2e746f70000000000000000000000000000000000000815250905090565b60006005600083815481101515610b0057fe5b90600052602060002090600302016002015401600083815481101515610b2257fe5b90600052602060002090600302016002018190555060019050919050565b600080610b4b610fbb565b60016000815480929190600101919050559250828160000181815250508481602001906000191690816000191681525050838160400181815250506000819080600181540180825580915050906001820390600052602060002090600302016000909192909190915060008201518160000155602082015181600101906000191690556040820151816002015550505082600192509250509250929050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610c4857806003819055505b50565b60008060008060009250600490505b8451811015610db4578481815181101515610c7157fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027f01000000000000000000000000000000000000000000000000000000000000009004915060308210158015610cf25750603a82105b15610d0b576030826004859060020a0201039250610da7565b60618210158015610d1c5750606782105b15610d3857600a6061836004869060020a020103019250610da6565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f6279746573546f55696e74206572726f7200000000000000000000000000000081525060200191505060405180910390fd5b5b8080600101915050610c5a565b829350505050919050565b6060806000806000606060206040519080825280601f01601f191660200182016040528015610dfd5781602001602082028038833980820191505090505b50945060009350600092505b6020831015610ec7578260080260020a876001900402600102915060007f010000000000000000000000000000000000000000000000000000000000000002827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916141515610eba57818585815181101515610e8157fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535083806001019450505b8280600101935050610e09565b836040519080825280601f01601f191660200182016040528015610efa5781602001602082028038833980820191505090505b509050600092505b83831015610fae578483815181101515610f1857fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000028184815181101515610f7157fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508280600101935050610f02565b8095505050505050919050565b60606040519081016040528060008152602001600080191681526020016000815250905600a165627a7a7230582019d49e3861189bdfe95b3c9397bf51e7bab8db9883aa7a6204816699af692fc40029"></p>
          <p> fee_limit 完成交易所消耗的最大fee  <input ref="newAbiFeeLimit" type="text" value="700000000000000"></p>
          <p> call_value 每次调用合约花费的fee  <input ref="newAbiCallValue" type="text" value="0"></p>
          <p> consume_user_resource_percent 指定的使用该合约用户的资源占比，是[0, 100]之间的整数。如果是0，则表示用户不会消耗资源。如果开发者资源消耗完了，才会完全使用用户的资源。<input ref="newAbiConsumeUserResourcePercent" type="text" value="0"></p>
          <input type="button" value="contractNew" @click="contractNew">&nbsp;&nbsp;{{contractNewRes}}<br>
          <br>------------------------------
          <p> address-合约地址 <input ref="getContractAddress" type="text" value="4155c0143b27cb6a3d3cf1502a2387a0669652e58e"></p>
          <input type="button" value="getContract" @click="getContract">&nbsp;&nbsp;{{getContractRes}}<br>
          <br>------------------------------
          <p> abiArray  <input ref="contractAtAbi" type="text" value=""></p>
          <p> contractAddress <input ref="contractAtContractAddress" type="text" value="4155c0143b27cb6a3d3cf1502a2387a0669652e58e"></p>
          <input type="button" value="contractAt" @click="contractAt">&nbsp;&nbsp;{{contractAtRes}}<br>
          <br>------------------------------
          <p> function name  <input ref="functionName" type="text" value="useUtil"> function args <input ref="functionArgs" type="text" value="68">  </p>
          <input type="button" value="callFunction" @click="callFunction">&nbsp;&nbsp;{{callFunctionRes}}<br>

  </div>
</template>

<script>
import TronWeb from "tronweb";
const address = "TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY";
const defaultPk =
  "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0";
const api_url = "http://52.44.75.99:8090";//"http://47.254.146.147:50051"//
const event_server = "http://52.44.75.99:18889";
const tronWeb = new TronWeb(api_url, event_server);
tronWeb.defaultAccount = address; //测试地址
tronWeb.defaultPk = defaultPk; //测试私钥
export default {
  data() {
    return {
      api_url: api_url, //请求的http服务地址
      event_server: event_server, //请求合约事件服务地址
      tronWeb: tronWeb,
      address: address,
      defaultPk: defaultPk,
      balance: "balance: ",
      bigNumberResult:
        "200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001200000000000000000000001",
      toHexStr: "",
      fromHexStr: "",
      trxToSunStr: "",
      sunToTrxStr: "",
      generateAddressOnClientRes: "",
      validateAddressRes: "",
      createAddressRes: "",
      updateAccountRes: "",
      listNodesRes: "",
      blockNumberRes: "",
      getBlockStrRes: "",
      getBlockTransactionCountRes: "",
      createTransactionRes: "",
      createTransactionRes: "",
      signTransactionRes: "",
      sendRawTransactionRes: "",
      sendTransactionRes: "",
      contractNewRes: "",
      getContractRes: "",
      contractAtRes: "",
      callFunctionRes: "",
    };
  },
  watch: {
    showFieldError() {
      console.log(this.showFieldError);
    },
    showPwdError() {
      console.log(this.showPwdError);
    }
  },
  methods: {
    getBalance() {
      this.tronWeb.getBalance(this.$refs.getBalance.value)
      .then(res => {
          this.balance = res;
      })
      .catch(err => {
          this.balance = err;
      });
    },
    calkcBigNumber() {
      console.log(parseInt(this.bigNumberResult));
      const t = tronWeb.toBigNumber(this.bigNumberResult);
      console.log(t.toString(10));
      this.bigNumberResult = t.toString(10);
    },
    toHex() {
      if (this.$refs.toHex) {
        this.toHexStr = tronWeb.toHex(this.$refs.toHex.value);
        return this.toHexStr;
      }
    },
    fromHex() {
      this.fromHexStr = tronWeb.fromHex(this.$refs.fromHex.value);
      return this.fromHexStr;
    },
    trxToSun() {
      this.trxToSunStr = tronWeb.trxToSun(this.$refs.trxToSun.value);
      return this.trxToSunStr;
    },
    sunToTrx() {
      this.sunToTrxStr = tronWeb.sunToTrx(this.$refs.sunToTrx.value);
      return this.sunToTrxStr;
    },
    async generateAddressOnClient() {
      this.generateAddressOnClientRes = await tronWeb.generateAddressOnClient();
      return this.generateAddressOnClientRes;
    },
    validateAddress() {
      tronWeb
        .validateAddress(this.$refs.validateAddress.value)
        .then(res => {
          this.validateAddressRes = res;
        })
        .catch(err => {
          this.validateAddressRes = err;
        });
    },
    async createAddress() {
      this.createAddressRes = await tronWeb.createAddress(this.$refs.createAddress.value);
    },
    async updateAccount() {
      this.updateAccountRes = await tronWeb.updateAccount(this.$refs.name.value, this.$refs.address.value);
    },
    listNodes() {
      this.tronWeb.listNodes()
      .then(res => {
          console.log('-------res-----', res)
          this.listNodesRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.listNodesRes = err
      });
    },
    blockNumber() {
      this.tronWeb.blockNumber()
      .then(res => {
          console.log('-------res-----', res)
          this.blockNumberRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.blockNumberRes = err
      });
    },
    getBlockStr() {
      this.tronWeb.getBlock(this.$refs.getBlockStr.value)
      .then(res => {
          console.log('-------res-----', res)
          this.getBlockStrRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.getBlockStrRes = err
      });
    },
    getBlockTransactionCount() {
      this.tronWeb.getBlockTransactionCount(this.$refs.getBlockTransactionCount.value)
      .then(res => {
          console.log('-------res-----', res)
          this.getBlockTransactionCountRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.getBlockTransactionCountRes = err
      });
    },
    createTransaction() {
      this.tronWeb.createTransaction(this.$refs.to.value, this.$refs.from.value, parseFloat(this.$refs.value.value))
      .then(res => {
          console.log('-------res-----', res)
          this.createTransactionRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.createTransactionRes = err
      });
    },
    signTransaction() {
      this.tronWeb.signTransaction(this.createTransactionRes, this.$refs.pk.value, this.$refs.terminal.value)
      .then(res => {
          console.log('-------res-----', res)
          this.signTransactionRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.signTransactionRes = err
      });
    },
    sendRawTransaction() {
      this.tronWeb.sendRawTransaction(this.signTransactionRes)
      .then(res => {
          console.log('-------res-----', res)
          this.sendRawTransactionRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.sendRawTransactionRes = err
      });
    },
    sendTransaction() {
      this.tronWeb.sendTransaction(this.$refs.sendFrom.value, this.$refs.sendTo.value, parseFloat(this.$refs.sendValue.value), this.$refs.sendPK.value)
      .then(res => {
          console.log('-------res-----', res)
          this.sendTransactionRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.sendTransactionRes = err
      });
    },
    contractNew() {
        var options = {
            from: this.$refs.newAbiFrom.value,
            data: this.$refs.newAbiData.value,
            fee_limit: this.$refs.newAbiFeeLimit.value,
            call_value: this.$refs.newAbiCallValue.value,
            consume_user_resource_percent: this.$refs.newAbiConsumeUserResourcePercent.value,
        }
        var array = JSON.parse(this.$refs.contractNewAbi.value)
        // console.log(Object.prototype.toString.apply(fs))
        // console.log(options)
      this.tronWeb.contract(array).new(options, this.$refs.contractNewPK.value)
      .then(res => {
          console.log('-------res-----', res)
          this.contractNewRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.contractNewRes = err
      });
    },
    getContract() {
      this.tronWeb.getContract(this.$refs.getContractAddress.value)
      .then(res => {
          console.log('-------res-----', res)
          this.getContractRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.getContractRes = err
      });
    },
    contractAt() {
      var array = JSON.parse(this.$refs.contractAtAbi.value)
      this.tronWeb.contract(array).at(this.$refs.contractAtContractAddress.value)
      .then(res => {
          console.log('-------res-----', res)
          this.contractAtRes = res
      })
      .catch(err => {
          console.log('------err------', err)
          this.contractAtRes = err
      });
    },
    async callFunction() {
      var funcName = (this.$refs.functionName.value)
      var funcArgs = parseInt(this.$refs.functionArgs.value)//tronWeb.utils.fromAscii
      var array = JSON.parse(this.$refs.contractAtAbi.value)
      var myContract = tronWeb.contract(array);
      var contractInstance = await myContract.at(this.$refs.contractAtContractAddress.value);
      var constant_result = await contractInstance.useUtil(funcArgs, {
            fee_limit:700000000000000,
            call_value:0
      })
      console.log('-----constant_result-----', constant_result)
    //   if(!constant_result){
    //         let res = await contractInstance.useUtil.sendTransaction(transaction, this.pk.value);
    //         //监听事件
    //         let myEvent = await contractInstance.Notify();//默认根据合约地址查询，可以输入{eventName:'',blockNum:'',transactionId:''}
    //          myEvent.watch(function(err,result){
    //              let eventResult = '';
    //              result.forEach((item)=>{
    //                  if(item.transaction_id ==transaction.txID){
    //                      eventResult = item.result;
    //                      myEvent.stopWatching();
    //                  }
    //              })
    //              console.log('eventResult:',eventResult);
    //          });
    //   }
    },
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
html,
body {
  overflow: scroll;
}
.testTronWeb {
  height: calc(~"107% - 1.5rem");
  overflow: scroll;
  width: 100%;
}
@button-color: #5fcbef;
.line_01 {
  padding: 0 20px 0;
  margin: 20px 0;
  line-height: 1px;
  border-left: 300px solid #ddd;
  border-right: 300px solid #ddd;
  text-align: center;
}
</style>
