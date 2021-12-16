<template>
  <div class="main">
<!--    <a-card title="Please select the service you need" style="width: 800px">-->
      <div style="display: flex;flex-direction: row;justify-content: space-around;">
        <div v-for="(item,index) in serviceArr" :key="index"
             style="display: flex;flex-direction: column;align-items: center;margin-left: 10px">

              <img class="card box-shadow"  :src="getPic(index)" @click="choiceService(item)">
<!--          <img width="150" height="150" src="~@/assets/pdf4.jpg" >-->
          <div style="margin-top: 20px;font-size: 18px;font-weight: bold">
            {{item.name}}
          </div>
        </div>
      </div>
<!--    </a-card>-->

    <a-modal
      :title="service.name + 'Queueing'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      okText="Refresh"
      cancelText="Exit Queue"
      @cancel="exit"
      @ok="handleOk"
    >
      <div style="font-size: 25px;font-weight: bold;margin-bottom: 80px;text-align: center">Please wait a moment. {{queue.beforeNum}} customer(s) ahead of you.</div>

    </a-modal>
    <a-modal
      title="Begin Service"
      :visible="startVisible"
      :confirm-loading="confirmLoading"
    >
      <div style="font-size: 25px;font-weight: bold;margin-bottom: 80px;text-align: center">Your service begin</div>
      <div style="font-size: 25px;font-weight: bold;margin-bottom: 80px;text-align: center">This is the Zoom Chatting Link: https://uofglasgow.zoom.us/j/7230317935?pwd=NFdUam9mN0RMbjFBR29oMkxFZ0lyUT09</div>
      <template slot="footer">

        <a-button key="submit" type="primary"  @click="startVisible= false">
          End Service
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import { axiosGetAction, axiosPatchAction } from '@/api/manage'
  import store from '@/store/'
  export default {
    name: 'ServiceWindows',
    data() {
      return {
        pic:[
          {id:1,src:require('../../assets/service01.jpg')},
          {id:2,src:require('../../assets/service02.jpg')},
          {id:3,src:require('../../assets/service03.jpg')}
        ],
        visible: false,
        startVisible: false,
        confirmLoading: false,
        url: {
          windows: '/api/v1/window/windows',
          push: '/api/v1/queue/push',
          realTimeQuery: "/api/v1/queue/realTimeQuery",
          exit: '/api/v1/queue/exit'
        },
        serviceArr: [],
        service: {},
        userInfo: JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value,
        queue:{}
      }
    },
    mounted() {
      //初始化websocket
      this.initWebSocket()
    },
    created() {
      this.refresh()
    },
    destroyed: function () { // Leave the page life cycle function 离开页面生命周期函数
      this.websocketclose();
    },
    methods: {
      getPic(index) {
        if (index >= this.pic.length) {
          return this.pic[1].src
        }
        return this.pic[index].src;
      },
      initWebSocket: function () {
        // The protocol used by WebSocket is different from that used by normal requests. Ws is equivalent to HTTP, and WSS is equivalent to HTTPS. WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        var userId = store.getters.userInfo.userId;
        var url = window._CONFIG['domianURL'].replace("https://","ws://").replace("http://","ws://")+"/websocket/"+userId;
        this.websock = new WebSocket(url);
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen: function () {
        console.log("WebSocket connect succeed");
      },
      websocketonerror: function (e) {
        console.log("WebSocket connect failed ");
      },
      websocketonmessage: function (e) {
        var data = eval("(" + e.data + ")");
        this.visible = false
        this.startVisible = true
      },
      websocketclose: function (e) {
        console.log("connection closed (" + e.code + ")");
      },
      exit() {
        debugger

        let data=new FormData();
        data.append("storeId",this.service.id)
        data.append("userId",this.userInfo.userId)
        axiosPatchAction(this.url.exit, data).then(res => {
          this.$message.success('Exit Succeed');
          this.visible = false
        })
      },
      refresh() {
        axiosGetAction(this.url.windows).then(res => {
          this.serviceArr = res
        })
      },
      choiceService(service) {
        this.service = service
        let data=new FormData();
        data.append("storeId",service.id)
        data.append("userId",this.userInfo.userId)

        let that = this
        axiosPatchAction(this.url.push, data).then(res => {
          console.log(res,'res')
          if (res.msg) {
            this.$message.error('You can not re-queue!');
            this.getQueue()
          } else {
            that.queue = res
          }
          this.visible = true
        })

      },
      getQueue() {
        let params = {
          storeId:this.service.id,
          userId:this.userInfo.userId
        }
        axiosGetAction(this.url.realTimeQuery, params).then(res => {
          this.queue = res
        })
      },
      handleOk() {
        // this.visible = false
        this.getQueue()
        this.$message.success('Refresh Succeed!');
      },

      checked(type) {
        this.$router.push({ name: 'login', params: { type } })
      }
    }
  }
</script>

<style lang="less" scoped>

  .card {
    padding: 10px;
    width: 200px;
    height: 150px;
    background-color: #FFF;
    border: none;
    border-radius: 6px;
    -webkit-transition: all 250ms cubic-bezier(0.02, 0.01, 0.47, 1);
    transition: all 250ms cubic-bezier(.02, .01, .47, 1);
  }

  .card:hover {
    box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15);
    transform: translate(0, -5px);
    transition-delay: 0s !important;
  }

  /*.box-shadow {*/
  /*  -webkit-box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.15);*/
  /*  box-shadow: 0 4px 16px rgba(48, 55, 66, 0.15);*/
  /*}*/

  /* 非核心样式 */
  .card-header {
    text-align: center;
  }

  #index.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
      background-size: 100%;
      padding: 110px 0 144px;
      position: relative;

      a {
        text-decoration: none;
      }

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }

        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 900px;
        margin: 0 auto;
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;

          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;

            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }

        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
</style>