<template>
  <footer class="footer-wrapper">
    <div class="footer-link">
      <ul class="link-list">
        <!-- <li @click="switchToSite(item.link)" v-for="item in lxsLink" :key="item.site" class="link-item">
          <i :class="`iconfont icon-${item.site}`"></i>
        </li> -->
        <li v-for="value in lxsLink" :key="value.site" class="link-li-item">
          <a :href="value.link" target="view_frame" class="link-a">{{value.site}}</a>
        </li>
      </ul>
      <div class="link-title">© 2018 · epistasis · ALL RIGHT RESERVED · 中国-浙江省-杭州市</div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      lxsLink: [
        {
          site: "weibo",
          link: "https://www.weibo.com/1985270673/profile?topnav=1&wvr=6"
        },
        { site: "github", link: "https://github.com/aaaking" },
        {
          site: "facebook",
          link: "https://www.facebook.com/profile.php?id=100012803167715"
        },
        {
          site: "twitter",
          link: "https://twitter.com/wise_Zhou"
        }
      ]
    };
  },
  methods: {
    switchToSite(link) {
      window.open(link, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("./iconfont/iconfont.scss");
.link-a {
  margin: auto 20px;
}
.footer {
  &-wrapper {
    bottom: 0;
    height: 80px;
    // position: absolute;
    width: 100%;
    margin-top: 10px;
    border-top: 1px solid #eaecef;
    display: flex;
    flex-direction: column;
    background-color: #97ffff;
  }
  &-link {
    width: 100%;
    top: 50%;
    bottom: 50%;
    transform: translateY(-50%);
    position: relative;
    padding: auto 0;
    .link {
      &-list {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-item {
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background-color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s;
        cursor: pointer;
        &:not(:first-child) {
          margin-left: 15px;
        }
        &:hover {
          background-color: #999;
        }
        .iconfont {
          color: #fff;
          font-size: 24px;
        }
      }
      &-title {
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
