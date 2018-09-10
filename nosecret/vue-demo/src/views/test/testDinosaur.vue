<template>
  <div class="testDinosaur">
          <input type="button" value="getBalance" @click="getBalance">&nbsp;&nbsp;{{balanceRes}}<br>

          <p> abiArray  <input ref="contractAtAbi" type="text" value=""></p>
          <p> contractAddress <input ref="contractAtContractAddress" type="text" value="0xbaeff0d37668df9c7b1dabffc2782b9d7ada2fa4"></p>
          <input type="button" value="contractAt" @click="contractAt">&nbsp;&nbsp;{{contractAtRes}}<br>

          <input type="button" value="getEgg" @click="getEgg">&nbsp;&nbsp;{{getEggRes}}<br>
          <input type="button" value="getDNSRToken" @click="getDNSRToken">&nbsp;&nbsp;{{getDNSRTokenRes}}<br>
          <input type="button" value="startHatchingEgg" @click="startHatchingEgg">&nbsp;&nbsp;{{startHatchingEggRes}}<br>
  </div>
</template>

<script>
var Web3 = require("web3");
// import Web3 from "Web3";
const PROVIDER =
  "https://rinkeby.infura.io/v3/1ef6eda7b4cb4444b3b6907f2086ba89"; //"http://47.52.224.7:8545";
var web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
export default {
  data() {
    return {
      account: "0xc7B5F6d0245339674ae4264E44173bC606881651",
      balanceRes: "",
      contractAtRes: "",
      contract: "",
      getEggRes: "",
      getDNSRTokenRes: "",
      startHatchingEggRes: "",
    };
  },
  watch: {},
  methods: {
    async getBalance() {
      this.balanceRes = await web3.eth.getBalance(this.account);
    },
    async contractAt() {
      var abiArray = JSON.parse(this.$refs.contractAtAbi.value);
      var contractAddress = this.$refs.contractAtContractAddress.value;
      this.contract = new web3.eth.Contract(abiArray, contractAddress);
      this.contractAtRes = "OK";
    },
    async getEgg() {
      this.getEggRes = await this.contract.methods.getEgg(0).call()
      console.log('-----egg-------', this.getEggRes)
    },
    async getDNSRToken() {
      this.getDNSRTokenRes = await this.contract.methods.getDNSRToken(0).call()
      console.log('-----getDNSRTokenRes-------', this.getDNSRTokenRes)
    },
    async startHatchingEgg() {
      await this.contract.methods.startHatchingEgg(0).call()
      this.startHatchingEggRes = "OK";
      console.log('-----startHatchingEgg-------', this.startHatchingEggRes)
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
.testDinosaur {
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
