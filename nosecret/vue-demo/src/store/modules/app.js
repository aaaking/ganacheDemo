const app = {
	state: {
		title: "大家的秘密-首页",
		email: "1059084407@qq.com",
		wechat: "epistasis",
		bannerInfo: {
			title: "大家的秘密",
			subTitle: "秘密不要憋在心中，一吐为快",
			bgImg: "http://eps.ink/img/post-bg-rwd.jpg",
			isShowBanner: true,
			size: 'normal'
		}
	},
	mutations: {
		TOGGLE_TITLE: (state, title) => {
			state.title = title
		},
		TOGGLE_BANNER: (state, bannerInfo) => {
			state.bannerInfo = bannerInfo
		}
	},
	actions: {
		ToggleTitle: ({ commit, title }) => {
			commit("TOGGLE_TITLE", title)
		},
		ToggleBanner: ({ commit, state }) => {
			commit("TOGGLE_BANNER", state)
		}
	}
}
export default app;