/**
* name 
Browser.window.open("https://github.com/ChengOrangeJu/WebExtensionWallet");
*/
module net {
	export class SocketIO {
		private static _instance: SocketIO;
		public ioSocket: any;
		public first:boolean =true;
		constructor() {
			this.ioSocket = Browser.window.io(App.GCConfig.ServerIp, { "reconnect": false, "auto connect": false, "transports": ['websocket'] });
			this.onInit();
		}

		public static get instance(): SocketIO {
			if (!SocketIO._instance)
				SocketIO._instance = new SocketIO();
			return SocketIO._instance;
		}

		private onInit(): void {
			this.ioSocket.once('connect', () => {
				console.log("connect success:");
				if (Browser.onPC) {
					this.onPcLogin();
					console.log('onPc');
				}
				else if (Browser.onMobile) {
					this.OnMobileLogin();
				}
			});

			this.ioSocket.on('error', (msg) => {
				console.log('socket error:' + msg);
			});


			//断开连接，关闭游戏lose connect
			this.ioSocket.once('not login', (msg) => {
				if (msg.code == 1) {
					this.ioSocket.emit('login', App.GCConfig.neb_Account, App.GCConfig.neb_nickname, App.GCConfig.neb_email);	//登录
					this.ioSocket.once('login', function (result) {
						if (result.msg == "success")//登录成功
						{
							PlayInfor.instance.data = JSON.parse(result.info);
						}
						else {
							console.log("登录失败");
						}
					})
				}
			})

		}

		public ToListenAccount(e) {
			let address: string = Laya.LocalStorage.getItem("neb_address");
			if (address && address != null&&this.first) {
				App.GCConfig.neb_Account = address;
				this.first =false;
				this.onToLogin();
			}
			else {
				if (e && e.data && e.data.data && e.data.data.account) {
					if (App.GCConfig.neb_Account != e.data.data.account) {
						if (!App.GCConfig.neb_Account) {
							// Notify to login
							App.GCConfig.neb_Account = e.data.data.account;
							this.onToLogin();
						} else if(!Laya.LocalStorage.getItem("neb_address")) {
							// refresh page
							Browser.window.location.reload();
						}
					}
				}
			}

		}

		private onPcLogin() {
			try {
				if (!Browser.window.webExtensionWallet) {
					console.log("WebWallet not installed");
					// ModuleManager.Instance.show(ModuleLogin, ModuleManager.MODULE_Login);
					App.showPage(SceneData.LoginView);
				}
				else {
					console.log("installed");
					Browser.window.addEventListener('message', this.ToListenAccount.bind(this));
					Browser.window.postMessage({
						"target": "contentscript",
						"data": {
						},
						"method": "getAccount"
					},
						"*");
				}
			} catch (e) {
				alert("Extension wallet is not installed, please install it first.")
			}
		}

		private OnMobileLogin() {
			console.log('onMobile');
			if (Browser.onWeiXin) {
				// ModuleManager.Instance.show(ModulePairingFail, ModuleManager.MODULE_PairingFail, "weixin");
			}

			let address: string = Laya.LocalStorage.getItem("neb_address");
			if (address) {
				App.GCConfig.neb_Account = address;
				this.onToLogin();
			}
			else {
				App.showPage(SceneData.RegisterView);
			}
		}

		/**环境检测完 */
		private onToLogin() {
			if (App.GCConfig.neb_Account != '') {
				this.ioSocket.emit('query nickname', App.GCConfig.neb_Account);
				this.ioSocket.once('query nickname', (msg) => {
					console.log("查询用户名ToLogin");

					if (msg.msg == "success") {
						let nickname = LocalStorage.getItem("neb_nickname");
						let email = LocalStorage.getItem("neb_email");

						Browser.window.removeEventListener('message', this.ToListenAccount.bind(this));

						// Laya.timer.clearAll(TimerObj);

						if (!nickname || !email) {
							App.showPage(SceneData.RegisterView);
							return;
						}

						this.connect(App.GCConfig.neb_Account, nickname, email);
						Laya.timer.loop(5000, this, this.connect, [App.GCConfig.neb_Account, nickname, email]);
						this.ioSocket.once('login', (result) => {
							console.log('收到登录回报');
							if (result.msg == "success")//登录成功
							{
								console.log("login success");
								console.log(JSON.parse(result.info));
								PlayInfor.instance.data = JSON.parse(result.info);

								App.GCConfig.neb_email = LocalStorage.getItem("neb_email");
								App.GCConfig.neb_nickname = LocalStorage.getItem("neb_nickname");
								Dispatcher.dispatch(EventName.GO_MAIN);
								Laya.timer.clear(this, this.connect);
							}
							else {
								console.log("登录失败");

							}
						});
					}
					else if (msg.msg == "fail") {
						console.log("用户名不存在");
						App.showPage(SceneData.RegisterView);
					}
					else if (msg.msg == "not save") {
						console.log("存在地址，不存在邮箱和昵称");
						App.showPage(SceneData.RegisterView, "special");
					}
				})
			}
			else //钱包账号不存在
			{
				// ModuleManager.Instance.show(ModuleLock, ModuleManager.MODULE_LOCK, null);
				Laya.timer.clearAll(this);
			}
		}

		private connect(count, nickname, email) {
			console.log('发送登录请求:nebAccount' + App.GCConfig.neb_Account + '....nickname:' + nickname + '....' + email);
			this.ioSocket.emit('login', count, nickname, email);	//登录
			// this.send(['login', count, nickname, email]);
		}

		// public send(param:Array<any>)
		// {
		// 	//发送服务器请求
		// 	let str = '';
		// 	for (var key in param) {
		// 		if (param.hasOwnProperty(key)) {
		// 			var element = param[key];
		// 			str+=element;
		// 			str+='..';
		// 		}
		// 	}
		// 	console.log("服务器请求:"+str);
		// 	this.ioSocket.emit.apply(param);
		// }


		private ceshi() {
		}

	}
}