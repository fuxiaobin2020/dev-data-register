<template>
  <div class="tab-content">
    <h1>Download File List</h1>
    <div class="tab-block" v-for="(contentArr,directory) in dataList" :key="directory">
      <template v-if="contentArr.length!=0">
        <!-- <h1 class="white">{{directory.replace('/home/vi018744/upload/','').replace(/\//g,' ')}}</h1> -->
        <h1 class="white">{{contentArr[0].subDirectory}}</h1>
        <div v-for="(item,index) in contentArr" :key="index">
          <!-- <template v-for="(size,name) in item"> -->
          <el-row>
            <el-col :span="20" class="grid item-left">
              <p>
                <span class="p-txt">{{item.fileName}}</span>
                <span class="p-txt1">
                  <span>{{item.fileSize}}</span>
                  <span>{{item.newDate}}</span>
                </span>
              </p>
            </el-col>
            <el-col :span="4" class="gridt item-right">
              <el-button
                type="primary"
                size="mini"
                round
                icon="el-icon-download"
                @click="downFile(item)"
              >Download</el-button>
            </el-col>
          </el-row>
          <!-- </template> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: {
        // "/home/vi018744/file_storage_new/upload/GPM/Daily_Report": [
        //   {
        //     fileName: "Daily_Report_Fleet-201904.xlsx",
        //     fileSize: "10KB",
        //     newDate: "2020-01-07 15:43:43",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Daily_Report"
        //   },
        //   {
        //     fileName: "Daily_Report_UC-201909.xlsx",
        //     fileSize: "19KB",
        //     newDate: "2020-01-07 15:43:20",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Daily_Report"
        //   },
        //   {
        //     fileName: "Daily_Report_TG-201902.xlsx",
        //     fileSize: "944KB",
        //     newDate: "2020-01-07 15:42:13",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Daily_Report"
        //   },
        //   {
        //     fileName: "Daily_Report_RQ-201901.xlsx",
        //     fileSize: "595KB",
        //     newDate: "2020-01-07 15:41:25",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Daily_Report"
        //   },
        //   {
        //     fileName: "Daily_Report_BG-2019.xlsx",
        //     fileSize: "6KB",
        //     newDate: "2020-01-07 15:40:44",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Daily_Report"
        //   },
        //   {
        //     fileName: "Daily_Report_FC-201908.xlsx",
        //     fileSize: "6KB",
        //     newDate: "2020-01-07 15:40:07",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Daily_Report"
        //   },
        //   {
        //     fileName: "Daily_Report_Index-201801.xlsx",
        //     fileSize: "595KB",
        //     newDate: "2020-01-07 15:34:53",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Daily_Report"
        //   }
        // ],
        // "/home/vi018744/file_storage_new/upload/GPM/Market_Share": [
        //   {
        //     fileName: "Market_Share_Mapping-202001.xlsx",
        //     fileSize: "595KB",
        //     newDate: "2020-01-07 15:45:46",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Market_Share"
        //   },
        //   {
        //     fileName: "Market_Share_Insurance-201903.xlsx",
        //     fileSize: "595KB",
        //     newDate: "2020-01-07 15:44:47",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Market_Share"
        //   },
        //   {
        //     fileName: "Market_Share_Official-201909.xlsx",
        //     fileSize: "595KB",
        //     newDate: "2020-01-07 15:44:14",
        //     subDirectory:
        //       "/home/vi018744/file_storage_new/upload/GPM/Market_Share"
        //   }
        // ],
        // "/home/vi018744/file_storage_new/upload/GPM/TP": [
        //   {
        //     fileName: "TP_Model_Mapping-201912.xlsx",
        //     fileSize: "10KB",
        //     newDate: "2020-01-07 15:45:25",
        //     subDirectory: "/home/vi018744/file_storage_new/upload/GPM/TP"
        //   },
        //   {
        //     fileName: "TP_Non_SF-201905.xlsx",
        //     fileSize: "19KB",
        //     newDate: "2020-01-07 15:45:03",
        //     subDirectory: "/home/vi018744/file_storage_new/upload/GPM/TP"
        //   }
        // ]
      }
    };
  },
  methods: {
    downFile(item) {
      var _this = this;

      this.$confirm("Are you sure to download this file?", "Reminder", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel"
      })
        .then(() => {
          let params = {
            directory: item.subDirectory,
            fileName: item.fileName
          };
          console.log(params);
          // this.$message.info("开始下载文件");
          this.$get(this.$urls.downloadUrl, params, {})
            .then(res => {
              if (res.status == 200) {
                let blob = new Blob([res.data], {
                  type: `application/octet-stream` //word文档为msword,pdf文档为pdf
                });
                let cs = res.headers["content-disposition"]
                  .split(";")[1]
                  .split("filename=")[1];
                cs = cs.replace(/\"/g, ""); //去掉双引号
                if (window.navigator.msSaveOrOpenBlob) {
                  //兼容ie
                  window.navigator.msSaveBlob(blob, cs);
                } else {
                  let objectUrl = window.URL.createObjectURL(blob);
                  let link = document.createElement("a");

                  link.href = objectUrl;
                  link.setAttribute("download", cs);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(aLink); //下载完成移除元素
                  window.URL.revokeObjectURL(url); //释放掉blob对象
                  // this.$message.success("接口调用成功");
                }
              } else {
                // this.$message.error(res.message);
                // this.$common.messageBox(res.data.message, "", "error",true);
              }
            })
            .catch(err => {
              console.log(err);
              // this.$message.error(err.message);
              // this.$common.messageBox(err.message, "", "error",true);
            });
        })
        .catch(() => {});
    },
    getDataList() {
      this.$emit("getMessage", true);
      this.$post(this.$urls.seachUrl, {}, {})
        .then(res => {
          this.$emit("getMessage", false);
          if (res.data.code == 200 && res.data.success) {
            this.dataList = res.data.data;
            // for (let k in this.dataList) {
            //   let arr = k.split("/");
            //   let length = arr.length;
            //   let str = arr[length - 2] + " " + arr[length - 1];
            //   this.dataList[k][0].subDirectory = str;
            // }
            // this.$message.success(res.data.message);
            for (let k in this.dataList) {
              if(Array.isArray(this.dataList[k]) && this.dataList[k].length!=0){
                let arr = k.split("/");
                let length = arr.length;
                let str = arr[length - 2] + " " + arr[length - 1];
                this.dataList[k][0].directoryTitle = str;
              }
            }
          } else {
            this.$common.messageBox(res.data.message, "", "error", false);
          }
        })
        .catch(err => {
          this.$emit("getMessage", false);
          
          console.log(err);
          this.$common.messageBox(err.message, "", "error", false);
        });
    }
  },
  mounted() {
    this.getDataList();
  }
};
</script>

<style lang="scss">
@import "../style/index";
.tab-content {
  width: 100%;
  h1 {
    color: #6e9cda;
    font-family: BMWTypeCondensedLight !important;
    font-size: 26px;
    text-align: left;
    margin-bottom: 24px;
    margin-top: 15px;
  }
  .tab-block {
    margin-top: 50px;
    div:last-child .el-row {
      border-bottom: 2px solid #525e6f;
    }
  }
  .white {
    font-size: 24px;
    color: #fff;
  }
  .el-row {
    height: 70px;
    color: #fff;
    border: 2px solid #525e6f; /*no*/
    border-bottom: 0;
    // background-color: #525e6f;
    border-radius: 4px;
    display: flex;
    .item-right.el-col {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 30px;
      .el-button {
        font-size: 16px;
        width: 120px;
        height: 40px;
        float: right;
        background: #6e9cda;
        border-radius: 19px;
        font-family: BMWTypeCondensedLight !important;
        padding: 5px !important;
        span {
          margin-left: 0 !important;
        }
        .el-icon-upload2,
        .el-icon-download {
          font-weight: 600;
        }
      }
      .dialog-footer {
        .el-button {
          float: none;
          font-family: BMWTypeCondensedLight !important;
        }
      }
    }
    .item-left.el-col {
      padding: 7px;
      padding-left: 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .p-txt {
        font-size: 20px;
        margin-right: 25px;
      }
      .p-txt1 {
        font-size: 16px;
        color: #b1b1b1;
        span:nth-child(1) {
          margin-right: 25px;
        }
      }
    }
  }
}
</style>
