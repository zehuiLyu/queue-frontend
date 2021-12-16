<template>
  <div id="index" :class="['user-layout-wrapper']">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <span class="title">Queueing System for Customer Service</span>
          </a>
        </div>
        <div class="desc">
<!-- ============================-->
        </div>
      </div>

      <div class="main" >

        <a-row style="margin-top: 80px" >
          <a-col :span="8" style="text-align: center;">
            <div class="card box-shadow" @click="checked(1)">
              <div class="card-header">
                <img style=" width: 280px;height: 160px;border-radius: 6px;" src="~@/assets/custom.jpg">
              </div>
            </div>
            <div style="font-size: 18px;font-weight: bold;margin-top: 20px">Customer</div>
          </a-col>
          <a-col :span="8" :offset="8"  style="text-align: center">
            <div class="card box-shadow"  @click="checked(2)">
              <img style=" width: 280px;height: 160px;border-radius: 6px;" src="~@/assets/service.jpg">
            </div>
            <div style="font-size: 18px;font-weight: bold;margin-top: 20px">Service Provider</div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Index",
  data () {
    return {
    }
  },
  methods: {
    checked(type) {
      this.$router.push({name: 'login', params: {type}})
    },
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
  transform: translate(0,-5px);
  transition-delay: 0s !important;
}

.box-shadow {
  -webkit-box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.15);
  box-shadow: 0 4px 16px rgba(48, 55, 66, 0.15);
}

/* Non-core */
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