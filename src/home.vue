<template lang="html">

  <div class="home-container home-loading">
    <div>
      <el-row class="container1" type='flex' justify=space-between>
      <el-col :span="24" class="header">
        <!-- <el-button :span="2" type="primary" size="mini" @click="fn()">Download</el-button> -->
        <el-col :span="8" class="logo">
          <img src="@/assets/image/logo.png" alt="" class='logo-img'>
          <p class='txt' @click="router('upload')">DATA REGISTRY</p>
        </el-col>
        <el-col :span="10">
        </el-col>
        <el-col :span="6" class="userinfo">
          <el-dropdown trigger="click">
            <div class="el-dropdown-link userinfo-inner">
            <span class="el-dropdown-link userinfo-inner">HELLO, {{sysUserName}}</span>
            <img src="@/assets/image/headshot.png" alt="" class='header-img'>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="router('upload')">
                <img src="@/assets/image/upload.png" alt />
                My Upload</el-dropdown-item>
              <el-dropdown-item @click.native="router('download')">
                <img src="@/assets/image/download.png" alt />
                My Download</el-dropdown-item>
              <el-dropdown-item @click.native="router('changePassword')">
                <img src="@/assets/image/item.png" alt />
                Change Password</el-dropdown-item>
              <el-dropdown-item @click.native="logoutFun">
                <img src="@/assets/image/exit.png" alt />
                Logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class='title-txt'>{{timeNow}}</span>
        </el-col>
      </el-col>
    </el-row>
    <el-row class="container" type='flex' justify=space-between>
      <el-col :span="24" class="main" v-loading="loadingBody"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
        <section class="content-container">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">
                <router-view @getMessage="showMsg"></router-view>
              </transition>
            </el-col>
          </div>
        </section>
      </el-col>
    </el-row>
      </div> 
    
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      sysName: "DNT系统",
      sysUserName: "",
      timeNow: "",
      loadingBody: false
    };
  },
  methods: {
    showMsg(val) {
      // methods方法  val即为子组件传过来的值
      this.loadingBody = val;
    },
    router(url) {
      this.$router.push("/" + url);
    },
    //退出登录
    logoutFun: function() {
      var _this = this;
      // this.$confirm("Confirm exit?", "hint", {
      //   //type: 'warning'
      // })
      //   .then(() => {
      this.$post(this.$urls.logoutUrl, {}, {})
        .then(res => {
          if (res.data.code == 200 && res.data.success) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("dataRegister_token");
            localStorage.removeItem("user");
            _this.$router.push("/login");
            // this.$message.success("Exit the success");
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("dataRegister_token");
            localStorage.removeItem("user");
            _this.$router.push("/login");
            this.$common.messageBox(res.data.message, "", "error", true);
          }
        })
        .catch(err => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("dataRegister_token");
          localStorage.removeItem("user");
          _this.$router.push("/login");
          console.log(err);
          this.$common.messageBox(err.message, "", "error", true);
        });
      // })
      // .catch(() => {});
    },
    // 获取时间
    getTime() {
      let dateTime = new Date().toDateString();
      let timeArr = dateTime.split(" ");
      this.timeNow = timeArr[1] + " " + timeArr[2] + ", " + timeArr[3];
    }
  },

  mounted() {
    this.getTime();
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.username || "";
    }
  }
};
</script>

<style scoped lang="scss">
@import "./style/index";
.home-container.home-loading .container1 {
  .header {
    height: 65px;
    line-height: 65px;
    background-image: linear-gradient(-180deg, #616b79 0%, #323944 100%);
    box-shadow: 0 2px 14px 0 rgba(99, 119, 154, 0.5);
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 36px;
      float: right;
      .el-dropdown {
        float: right;
      }
      .title-txt {
        float: right;
        font-size: 20px;
        margin-right: 58px;
      }

      .header-img {
        width: 28px;
        height: 28px;
        display: block;
        float: right;
        margin-top: 18px;
        margin-right: 11px;
      }
      .userinfo-inner {
        font-size: 18px;
        cursor: pointer;
        color: #fff;
        display: block;
        float: right;
      }
    }
    .logo {
      height: 65px;
      padding-left: 30px;
      padding-right: 30px;
      .logo-img {
        display: block;
        height: 32px;
        margin-right: 46px;
        margin-top: 16px;
        float: left;
      }
      .txt {
        display: block;
        color: #fff;
        height: 65px;
        font-size: 28px;
        line-height: 65px;
        font-weight: 600;
        margin: 0;
        float: left;
        cursor: pointer;
      }
    }
    .tools {
      padding: 0 23px;
      width: 14px;
      height: 65px;
      line-height: 65px;
      cursor: pointer;
    }
  }
}
.container {
  position: absolute;
  top: 65px;
  bottom: 0;
  left: 0;
  width: 100%;

  .main {
    display: flex;
    overflow: hidden;
    .content-container {
      background-image: url("assets/image/banner.png");
      background-size: 100% 100%;
      background-attachment: fixed;
      background-position: center;

      flex: 1;
      overflow-y: scroll;
      padding: 30px;
      //   white-space: nowrap;
      // -webkit-overflow-scrolling: touch;
      // overflow-x: hidden;
      // padding: 0 0.1rem;
      // margin-bottom: -.2rem;
      // overflow: -moz-scrollbars-none;
      // overflow: -moz-scrollbars-none;
    }
    //     .content-container::-webkit-scrollbar{
    //     display: none;
    // }
  }
}
</style>

