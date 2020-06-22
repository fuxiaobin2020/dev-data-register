<template>
  <div class="tab-content">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      :show-message="false"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-container"
    >
      <h3 class="title">Change the password</h3>
      <p>{{errorMsg}}</p>

      <el-form-item prop="account">
        <img src="@/assets/image/orgpass.png" alt />
        <el-input
          type="password"
          v-model="ruleForm.account"
          auto-complete="off"
          placeholder="Original password"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <img src="@/assets/image/pass.png" alt />
        <el-input
          type="password"
          v-model="ruleForm.pass"
          auto-complete="off"
          placeholder="New password"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <img src="@/assets/image/pass.png" alt />
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          auto-complete="off"
          placeholder="Confirm password"
        ></el-input>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button
          type="primary"
          style="width:100%;"
          @click="submitForm('ruleForm')"
          :loading="logining"
        >Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import crypto from "crypto";
export default {
  data() {
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        this.errorMsg = "old password cannot be empty";
        return callback(new Error(this.errorMsg));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if(this.$common.validPassword(value)){
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }else{
        this.errorMsg = "Passwords must contain 6-10 characters and at least one uppercase letter, one lowercase letter and one digit!";
        callback(new Error(this.errorMsg));
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        this.errorMsg = "Please enter your password again!";
        callback(new Error(this.errorMsg));
      } else if (value !== this.ruleForm.pass) {
        this.errorMsg = "The two new passwords you typed do not match!";
        callback(new Error(this.errorMsg));
      } else {
        callback();
      }
    };
    return {
      errorMsg: "old password cannot be empty",
      logining: false,
      sysUserName: "",
      ruleForm: {
        pass: "",
        checkPass: "",
        account: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        account: [{ validator: checkAccount, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(ruleForm) {
      var _this = this;
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let http = this.$axios.create({
            // baseURL: "http://10.188.149.162:8089/",
            baseURL: window.location.protocol,
            timeout: 5000
          });
          let config = {
            headers: {
              "Content-Type": "application/json"
            }
          };
          if (localStorage.getItem("access_token")) {
            config.headers["Authorization"] =
              "Bearer " + localStorage.getItem("access_token");
          }
          _this.logining = true;
          var loginParams = {
            userName: _this.sysUserName.username,
            oldPassword: _this.ruleForm.account,
            newPassword: _this.ruleForm.pass
          };
          let userPass = loginParams.newPassword;
          // md5加密密码
          const md5 = crypto.createHash("md5");
          md5.update(loginParams.oldPassword);
          loginParams.oldPassword = md5.digest("hex");
          const md51 = crypto.createHash("md5");
          md51.update(loginParams.newPassword);
          loginParams.newPassword = md51.digest("hex");
          http
            .post(_this.$urls.updatePasswordUrl, loginParams, config)
            .then(res => {
              _this.logining = false;
              if (res.data.code == "1") {
                _this.sysUserName.password = userPass;
                sessionStorage.setItem(
                  "user",
                  JSON.stringify(_this.sysUserName)
                );
                _this.$router.push({ path: "/login" });
                _this.$common.messageBox(
                  "The passwords have been changed",
                  "",
                  "success",
                  true
                );
              } else {
                _this.$common.messageBox(res.data.data.msg, "", "error", true);
              }
            })
            .catch(err => {
              _this.logining = false;
              console.log(err);
              if (err) {
                _this.$common.messageBox(err.message, "", "error", true);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      this.sysUserName = JSON.parse(user);
    }
  }
};
</script>
<style lang="scss">
.tab-content {
  .login-container {
    height: 585px !important;
    .el-form-item {
      img {
        top: 28px !important;
      }
      .el-input__inner {
        margin-top: 6px;
      }
      .el-button {
        font-family: BMWTypeCondensedLight !important;
        margin-top: 20px;
        .el-icon-loading {
          font-size: 26px !important;
        }
        .el-loading-text {
          font-size: 26px !important;
          margin-top: 0;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../style/index";
.tab-content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>