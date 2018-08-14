<template>
  <main-section>
    <left-section>
      <blog-nav title="最新文章" :tags="tagList"></blog-nav>
      <blog-panel :blogs="blogList"></blog-panel>
    </left-section>
    <right-section :width="240">
      <blog-nav title="热门标签" size="small" :has-more="true" to="/tags/index"></blog-nav>
      <tag-list :tags="tagList"></tag-list>
    </right-section>
  </main-section>
</template>

<script>
import {
  LeftSection,
  RightSection,
  MainSection
} from "@/components/section/index";
import { BlogNav, BlogPanel } from "@/components/blog/index";
import { TagList } from "@/components/tag/index";
import request from "@/api/app";
export default {
  components: {
    LeftSection,
    RightSection,
    MainSection,
    BlogNav,
    BlogPanel,
    TagList
  },
  data() {
    console.log("-------data");
    return {
      bannerInfo: {
        title: "区块链博客",
        subTitle: "基于Nebulas的区块链dapp，发布的文章将会永久保存到链上",
        bgImg: "https://cdn-images-1.medium.com/max/2000/0*m2L1KHdVgUBnrwOe",
        isShowBanner: true,
        size: "normal"
      },
      tagList: [
        { id: "1001", title: "推荐" },
        { id: "1002", title: "javascript" },
        { id: "1003", title: "webpack" },
        { id: "1004", title: "css" }
      ],
      blogList: [
        // {
        //   id: "201807241638",
        //   title: "喜大普奔，Ant Design of Vue 1.0版本发布🎉🎉🎉",
        //   time: "2018-07-24 16:38:00",
        //   tag: "vue",
        //   author: "zzh"
        // }
      ]
    };
  },
  created() {
    this.$store.commit("TOGGLE_BANNER", this.bannerInfo);
    console.log("-------created");
  },
  mounted() {
    request
      .list()
      .then(res => {
        console.log('------res-----res', res)
      })
      .catch(err => {
        console.log('------err-----0--', err)
      });
  }
};
</script>

<style lang="scss" scoped>
.blog-panel {
  margin: 0 0 40px 0;
}
</style>
