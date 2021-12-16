<template>
  <div class="main">
    <a-card style="width: 800px">
      <div style="font-size: 25px;font-weight: bold;margin-bottom: 80px;text-align: center">You have {{num}} customer(s) waiting for your service</div>
      <div style="display: flex;flex-direction: row;justify-content: center">
        <div style="width:500px;display: flex;flex-direction: row;justify-content: space-around;">
          <a-button size="large" @click="refresh">Refresh</a-button>
          <a-button size="large" type="primary" @click="next">Next Customer</a-button>
          <a-button size="large" type="danger" @click="clear">End Service</a-button>
        </div>
      </div>


    </a-card>

    <a-modal
      title="Notice"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :closable="false"
    >
      <div style="font-size: 25px;font-weight: bold;margin-bottom: 80px;text-align: center">You are serving with ID {{serviceUser.queryUserId}} Customer</div>
      <div style="font-size: 25px;font-weight: bold;margin-bottom: 80px;text-align: center">This is the Zoom Chatting Link: https://uofglasgow.zoom.us/j/7230317935?pwd=NFdUam9mN0RMbjFBR29oMkxFZ0lyUT09</div>
       <template slot="footer">
          <a-button key="submit" type="primary" @click="visible= false">
           End Service
          </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import { axiosGetAction,axiosPatchAction,axiosDeleteAction} from '@/api/manage'
  import store from '@/store/'
  export default {
    name: 'ServiceWindows',
    data() {
      return {
        visible: false,
        confirmLoading: false,
        url:{
          curQueryNum:"/api/v1/queue/curQueryNum",
          pop:"/api/v1/queue/pop",
          clear :"/api/v1/queue/clear",
        },
        num: 0,
        serviceUser:{}
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      clear() {
        var userId = store.getters.userInfo.userId;

        let data=new FormData();
        data.append("storeId",userId)
        axiosDeleteAction(this.url.clear,data).then(res=>{
          console.log(res,'res')
          this.$message.success('Close Successful!');
        })

      },
      refresh() {
        var userId = store.getters.userInfo.userId;
        axiosGetAction(this.url.curQueryNum,{storeId:userId}).then(res => {
          this.num = res.num
        })
      },
      next() {
        var userId = store.getters.userInfo.userId;

        let data=new FormData();
        data.append("storeId",userId)
        axiosPatchAction(this.url.pop,data).then(res=>{
          if (res.msg) {
            this.$message.error('There is no customer waiting!');
            return
          }
          console.log(res,"res")
          this.serviceUser = res
          this.visible = true

        })
      },
      handleOk() {
        this.visible = false
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
    width: 300px;
    height: 180px;
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

  .box-shadow {
    -webkit-box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.15);
    box-shadow: 0 4px 16px rgba(48, 55, 66, 0.15);
  }

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