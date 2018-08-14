<template>
  <div class="about-wrapper">
    <h1>关于</h1>
    <div class="about-message">
      <pre class="msg-pre">
        作者：epistasis
        Email: 1059084407@qq.com
        合约地址：---
        网络：https://testnet.nebulas.io
        详情：<a href="https://explorer.nebulas.io/#/testnet/address/n1ZNBpKGq6ffBjbUZR22terqWvenXzcdzZq" target="view_frame">链接</a>
      </pre>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      bannerInfo: {
        title: "",
        subTitle: "",
        bgImg: "https://cdn-images-1.medium.com/max/2000/1*3FVOI0HJNamEVvcnmRPqSg.jpeg",
        isShowBanner: true,
        size: "normal"
      }
    };
  },
  created() {
    this.$store.commit("TOGGLE_BANNER", this.bannerInfo);
  }
};
</script>
<style lang="scss">
.about {
  &-wrapper {
    max-width: 1110px;
    text-align: center;
    margin: 0 auto;
    margin-top: 10px;
    background-color: #fff;
    h1 {
      padding-top: 10px;
    }
  }
  &-message {
    text-align: left;
  }
}
.msg-pre {
  font-size: 140%
}
</style>
