<template>
  <div class="home-container login-content">
    <el-row class="container" type="flex" justify="space-between">
      <el-col :span="24" class="header">
        <el-col :span="8" class="logo">
          <img src="@/assets/image/logo.png" alt class="logo-img" />
          <p class="txt">Data Registry</p>
        </el-col>
        <el-col :span="10"></el-col>
      </el-col>
      <!-- <el-col :span="24" class="main">
        <section class="content-container">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">
                <el-form
                  :model="ruleForm2"
                  :rules="rules2"
                  ref="ruleForm2"
                  label-position="left"
                  label-width="0px"
                  class="demo-ruleForm login-container"
                >
                  <h3 class="title">Welcome to Login</h3>
                  <p>Please input 6-10 characters password!</p>
                  <el-form-item prop="account">
                    <img src="@/assets/image/account.png" alt />
                    <el-input
                      type="text"
                      v-model="ruleForm2.account"
                      auto-complete="off"
                      placeholder=""
                    ></el-input>
                  </el-form-item>
                  <el-form-item prop="checkPass">
                    <img src="@/assets/image/pass.png" alt />
                    <el-input
                      type="password"
                      v-model="ruleForm2.checkPass"
                      auto-complete="off"
                      placeholder=""
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="width:100%;">
                    <el-button
                      type="primary"
                      style="width:100%;"
                      @click="handleSubmit2"
                      :loading="logining"
                    >login</el-button>
                  </el-form-item>
                </el-form>
              </transition>
            </el-col>
          </div>
        </section>
      </el-col>-->
    </el-row>
    <el-row class="container" type="flex" justify="space-between">
      <el-col :span="24" class="main">
        <section class="content-container">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">

                <el-form
                  :model="ruleForm2"
                  :rules="rules2"
                  ref="ruleForm2"
                  :show-message="false"
                  label-position="left"
                  label-width="0px"
                  class="demo-ruleForm login-container"
                >
                  <h3 class="title">Welcome to Login</h3>
                  <p>{{errorMsg}}</p>
                  <el-form-item prop="account">
                    <img src="@/assets/image/account.png" alt />
                    <el-input
                      type="text"
                      v-model="ruleForm2.account"
                      auto-complete="off"
                      placeholder
                      @keyup.native="ruleForm2.account = ruleForm2.account.toLowerCase()"
                    ></el-input>
                  </el-form-item>
                  <el-form-item prop="checkPass" class="checkPass-item">
                    <img src="@/assets/image/pass.png" alt />
                    <el-input
                      class="checkPass"
                      type="password"
                      v-model="ruleForm2.checkPass"
                      auto-complete="off"
                      placeholder
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="width:100%;">
                    <el-button
                      type="primary"
                      style="width:100%;"
                      @click="submitForm('ruleForm2')"
                      :loading="logining"
                    >Login</el-button>
                  </el-form-item>
                </el-form>
              </transition>
            </el-col>
          </div>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crypto from "crypto";
export default {
  name: "login",
  props: {},
  data() {
    var checkAccount = (rule, value, callback) => {
      
      if (!value) {
        this.errorMsg = "Please enter account!";
        return callback(new Error("Please enter account!"));
      }
      callback();
    };
    var validatecheckPass = (rule, value, callback) => {
      if (value === "") {
        this.errorMsg = "Please input 6-10 characters password!";
        callback(new Error("Please input 6-10 characters password!"));
      } else if (value.length < 6 || value.length > 10) {
        this.errorMsg = "Please input 6-10 characters password!";
        callback(new Error("Please input 6-10 characters password!"));
      } else {
        callback();
      }
    };
    return {
      errorMsg: "Please input 6-10 characters password!",
      logining: false,
      sysUserName: "",
      ruleForm2: {
        account: "",
        checkPass: ""
      },
      rules2: {
        checkPass: [{ validator: validatecheckPass, trigger: "blur" }],
        account: [{ validator: checkAccount, trigger: "blur" }]
      }
    };
    
  },
  methods: {
    submitForm(ruleForm) {
      var _this = this;
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          _this.logining = true;
          var loginParams = {
            username: this.ruleForm2.account,
            password: this.ruleForm2.checkPass,
            scope: "read_info"
          };
          // md5加密密码
          const md5 = crypto.createHash("md5");
          md5.update(loginParams.password);
          loginParams.password = md5.digest("hex");
          // console.log(this.$urls.loginUrl);
          let headerData = {
            headers: {
              Authorization: "Basic Y2xpZW50YXBwOjExMjIzMw=="
            }
          };

          this.$post(this.$urls.loginUrl, loginParams, headerData)
            .then(res => {
              _this.logining = false;
              if (res.data.code == 200 && res.data.success) {
                let base = res.data.data;
                localStorage.setItem("access_token", base.access_token);
                localStorage.setItem(
                  "dataRegister_token",
                  base.dataRegister_token
                );
                sessionStorage.setItem("user", JSON.stringify(loginParams));
                _this.$router.push({ path: "/upload" });
              } else {
                this.$common.messageBox('Login failure', res.data.message, "error", true);
              }
            })
            .catch(err => {
              // sessionStorage.setItem("user", JSON.stringify(loginParams));
              //   _this.$router.push({ path: "/upload" });
                _this.logining = false;
              console.log(err);
              if (err) {
                this.$common.messageBox(err.message, "", "error", true);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped  lang="scss">
@import "./style/index";
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  .header {
    height: 65px;
    line-height: 65px;
    background-image: linear-gradient(-180deg, #616b79 0%, #323944 100%);
    box-shadow: 0 2px 14px 0 rgba(99, 119, 154, 0.5);
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
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
        font-size: 30px;
        line-height: 65px;
        font-weight: 600;
        margin: 0;
        float: left;
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
  .main {
    display: flex;
    position: absolute;
    top: 65px;
    bottom: 0;
    overflow: hidden;

    .content-container {
      background-image: url("assets/image/banner.png");
      background-size: 100% 100%;
      background-attachment: fixed;
      background-position: center;

      flex: 1;
      // overflow-y: scroll;
      padding: 30px;
    }
  }
}

label.el-checkbox.remember {
  margin: 0px 0px 35px 0px;
}
</style>
<style lang="scss">
.login-content {
  .content-container {
    display: flex;
    align-items: center;
    justify-content: center;
    // .login-container {
    //   margin-top: -65px;
    //   background-clip: padding-box;
    //   padding: 60px !important;
    //   // border: 1px solid #eaeaea;
    //   width: 650px;
    //   height: 450px;
    //   background: #323944;
    //   border-radius: 18px;
    .el-button {
      font-family: BMWTypeCondensedLight !important;
    }
    //   .title {
    //     text-align: center;
    //     font-size: 32px;
    //     color: #fff;
    //   }
    //   p {
    //     font-size: 16px;
    //     color: #fff;
    //     font-family: BMWTypeCondensedLight;
    //     margin-top: 20px;
    //     margin-bottom: 24px;
    //   }
    //   .el-input__inner {
    //     height: 60px !important;
    //     background: #ffffff;
    //     border-radius: 8px;
    //   }
    // }
  }
}
</style>