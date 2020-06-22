<template>
  <div class="tab-content">
    <h1>Welcome to data registry center! Please upload your data file.</h1>
    <el-table :data="dataList" style="width: 100%" :header-row-class-name="tabHeaderClassName">
      <el-table-column prop="dataArea" label="Data Area"></el-table-column>
      <el-table-column prop="fileName" label="File Name"></el-table-column>
      <el-table-column prop="fileType" label="File Type"></el-table-column>
      <el-table-column prop="subDirectory" label="Sub Directory"></el-table-column>
      <el-table-column prop="newDate" label="Latest Upload Date"></el-table-column>
      <el-table-column label="Template" width="160">
        <template slot-scope="scope">
          <el-button
            class="down-button"
            type="primary"
            size="mini"
            round
            :disabled="!scope.row.isExist"
            icon="el-icon-download"
            @click="downFile(scope.row)"
          >Download</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Data Upload" width="160">
        <template slot-scope="scope">
          <!-- <el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-change="handleChange"
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>-->
          <el-button
            @click="uploadbut(scope.row)"
            type="primary"
            size="mini"
            round
            icon="el-icon-upload2"
          >Upload</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="uploadDialog" :before-close="closeFile" class="eldialog">
      <p slot="title" class="dialog-title">
        <span>Upload File</span>
      </p>
      <el-form
        ref="addForm"
        class="eldialogForm"
        id="addForm"
        v-loading="uploading"
        element-loading-text="Are uploading..."
        element-loading-spinner="el-icon-upload"
      >
        <!-- :limit="10"
        :on-exceed="handleExceed"-->
        <el-form-item label>
          <el-upload
            class="upload-demo"
            drag
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="uploadFile"
            ref="upload"
            action
          >
            <!-- :action="$urls.uploadUrl"
                    multiple
                    :data='fileParams'
            :headers='headerData'-->
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              Drag the file here, or
              <em>Click on the upload</em>
            </div>
            <div class="el-upload__tip" slot="tip">Only Excel files can be uploaded</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeFile" :disabled="uploading">取 消</el-button>
                <el-button type="primary" @click="postFile(scope.row)" :disabled="uploading">确 定</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //上传excel表格
      uploadDialog: false,
      uploading: false,
      file: [],
      fileParams: {},
      dataList: [
        {
          uploadFrequency: "aaaaaaaaaa",
          fileName: "www.jd.com",
          systemName: "管理员bbbbbbbbbbb",
          subSystemId: 3,
          id: 3,
          dataArea: "bmw",
          fileType: "excel",
          subDirectory: "/wcel/bbbbb/cccc/bbbbb",
          newDate: "111",
          directory: "111",
          templateName: "111",
          isExist: false
        }
      ]
    };
  },

  methods: {
    // 表格样式
    tabHeaderClassName() {
      return "header-row";
    },
    downFile(row) {
      var _this = this;
      this.$confirm("Are you sure to download this file?", "Reminder", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel"
      })
        .then(() => {
          let params = {
            directory: row.directory,
            fileName: row.templateName
          };
          console.log(params);
          // this.$message.info("开始下载文件");
          this.$get(this.$urls.downloadUrl, params, {})
            .then(res => {
              if (res.status == 200) {
                if (res.data.size == 12 && res.data.type == "text/html") {
                  this.$common.messageBox("NO Such File", "", "error", false);
                } else {
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
                }
              } else {
                this.$message.error(res.message);
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
    // 点击上传按钮
    uploadbut(item) {
      this.uploadDialog = true;
      this.fileParams = {
        file: item.fileName,
        fileType: item.fileType,
        directory: item.subDirectory,
        dataArea: item.dataArea,
        isContinueUpload: "N"
      };
    },
    //上传excel表格校验
    beforeUpload(file) {
      // 校验文件大小
      if (file.size / (1024 * 1024) > 5) {
        let messagetitle = "File upload failed";
        let messageContent = "Files must not be larger than 5MB";
        this.$common.messageBox(messagetitle, messageContent, "error", false);
        return false;
      }
      // 校验文件类型
      // application/pdf
      const isText = file.type === "application/vnd.ms-excel";
      const isTextComputer =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isPdf = file.type === "application/pdf";
      if (!isText && !isTextComputer && !isPdf) {
        let messagetitle = "File upload failed";
        let messageContent = "Upload files must be in Excel format";
        this.$common.messageBox(messagetitle, messageContent, "error", false);
        return isText || isTextComputer || isPdf;
      }
      // 校验excl文件类型
      let isName = false;
      let isFileNameFront = false;
      let fileNameArr = this.fileParams.file.split("-");
      if (file.name.indexOf(".") != -1 && this.fileParams.fileType) {
        let nameArr = file.name.split(".");
        // this.fileParams.fileType
        // if (
        //   nameArr[nameArr.length - 1].toLowerCase() == "xlsx" ||
        //   nameArr[nameArr.length - 1].toLowerCase() == "pdf"
        // ) {
        //   isName = true;
        // } else {
        //   isName = false;
        // }
        if (nameArr[nameArr.length - 1].toLowerCase() == "xlsx") {
          isName = true;
          if (file.name.indexOf("-")) {
            if (file.name.indexOf(fileNameArr[0]) != -1) {
              isFileNameFront = true;
            } else {
              isFileNameFront = false;
            }
          }
        } else if (nameArr[nameArr.length - 1].toLowerCase() == "pdf") {
          isName = true;
          if (file.name.indexOf("-")) {
            if (file.name.indexOf("AG_Report_") != -1) {
              isFileNameFront = true;
            } else {
              isFileNameFront = false;
            }
          }
        } else {
          isName = false;
        }
      }
      if (!isName) {
        let messagetitle = "File upload failed";
        let messageContent = "File Type is not as expected";
        this.$common.messageBox(messagetitle, messageContent, "error", false);
        return isName;
      }
      if (!isFileNameFront) {
        let messagetitle = "File upload failed";
        let messageContent =
          "File Name does not follow naming convention, please correct it and upload again.";
        this.$common.messageBox(messagetitle, messageContent, "error", false);
        return isFileNameFront;
      }

      // 校验 文件名格式
      let nameArr1 = file.name.split(".")[0];
      let isFileListRear = false;
      let fileListRear = nameArr1.split("-")[1];
      if (isText || isTextComputer) {
        // var file = {}
        // file.name = 'zhangsan-2016120m.excel'
        // this.fileParams.file = 'zhangsan-YYYYMMDD'

        // let fileNameArr = this.fileParams.file.split("-");
        let fileListReartrue = fileNameArr[1];
        if (fileListRear && fileListRear.length == fileListReartrue.length) {
          let fileNum = fileListRear.length;
          switch (fileNum) {
            // let fileListRearNum = parseInt(fileNameArr[1]);
            case 4:
              if (
                parseInt(fileListRear) < 2051 &&
                parseInt(fileListRear) > 2015
              ) {
                isFileListRear = true;
              }

              break;
            case 6:
              let fileNameSubStr1 = false;
              let fileNameSubStr2 = false;
              if (
                parseInt(fileListRear.substring(0, 4)) < 2051 &&
                parseInt(fileListRear.substring(0, 4)) > 2015
              ) {
                fileNameSubStr1 = true;
              } else {
                fileNameSubStr1 = false;
              }
              if (
                parseInt(fileListRear.substring(4)) < 13 &&
                parseInt(fileListRear.substring(4)) > 0
              ) {
                fileNameSubStr2 = true;
              } else {
                fileNameSubStr2 = false;
              }
              isFileListRear = fileNameSubStr1 && fileNameSubStr2;
              break;
            case 8:
              let fileNameSubStr81 = false;
              let fileNameSubStr82 = false;
              let fileNameSubStr83 = false;
              if (
                parseInt(fileListRear.substring(0, 4)) < 2051 &&
                parseInt(fileListRear.substring(0, 4)) > 2015
              ) {
                fileNameSubStr81 = true;
              } else {
                fileNameSubStr81 = false;
              }
              if (
                parseInt(fileListRear.substring(4, 6)) < 13 &&
                parseInt(fileListRear.substring(4, 6)) > 0
              ) {
                fileNameSubStr82 = true;
              } else {
                fileNameSubStr82 = false;
              }
              if (
                parseInt(fileListRear.substring(6)) < 32 &&
                parseInt(fileListRear.substring(6)) > 0
              ) {
                fileNameSubStr83 = true;
              } else {
                fileNameSubStr83 = false;
              }
              isFileListRear =
                fileNameSubStr81 && fileNameSubStr82 && fileNameSubStr83;
              break;
            default:
              isFileListRear = false;
          }
        }
      } else if (isPdf) {
        this.fileParams.fileType = 'pdf'
        let fileListReartrue = "YYYYMM";
        if (fileListRear && fileListRear.length == fileListReartrue.length) {
          let fileNum = fileListRear.length;
          switch (fileNum) {
            // let fileListRearNum = parseInt(fileNameArr[1]);
            case 4:
              if (
                parseInt(fileListRear) < 2051 &&
                parseInt(fileListRear) > 2015
              ) {
                isFileListRear = true;
              }

              break;
            case 6:
              let fileNameSubStr1 = false;
              let fileNameSubStr2 = false;
              if (
                parseInt(fileListRear.substring(0, 4)) < 2051 &&
                parseInt(fileListRear.substring(0, 4)) > 2015
              ) {
                fileNameSubStr1 = true;
              } else {
                fileNameSubStr1 = false;
              }
              if (
                parseInt(fileListRear.substring(4)) < 13 &&
                parseInt(fileListRear.substring(4)) > 0
              ) {
                fileNameSubStr2 = true;
              } else {
                fileNameSubStr2 = false;
              }
              isFileListRear = fileNameSubStr1 && fileNameSubStr2;
              break;
            case 8:
              let fileNameSubStr81 = false;
              let fileNameSubStr82 = false;
              let fileNameSubStr83 = false;
              if (
                parseInt(fileListRear.substring(0, 4)) < 2051 &&
                parseInt(fileListRear.substring(0, 4)) > 2015
              ) {
                fileNameSubStr81 = true;
              } else {
                fileNameSubStr81 = false;
              }
              if (
                parseInt(fileListRear.substring(4, 6)) < 13 &&
                parseInt(fileListRear.substring(4, 6)) > 0
              ) {
                fileNameSubStr82 = true;
              } else {
                fileNameSubStr82 = false;
              }
              if (
                parseInt(fileListRear.substring(6)) < 32 &&
                parseInt(fileListRear.substring(6)) > 0
              ) {
                fileNameSubStr83 = true;
              } else {
                fileNameSubStr83 = false;
              }
              isFileListRear =
                fileNameSubStr81 && fileNameSubStr82 && fileNameSubStr83;
              break;
            default:
              isFileListRear = false;
          }
        }
      }
      if (!isFileListRear) {
        let messagetitle = "File upload failed";
        let messageContent =
          "File Name does not follow naming convention, please correct it and upload again.";
        this.$common.messageBox(messagetitle, messageContent, "error", false);
        return isFileListRear;
      }
    },
    // 上传文件个数超过定义的数量
    // handleExceed(files, fileList) {
    //   // this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    //   let messagetitle = "more than 10 files have been uploaded";
    //   this.$common.messageBox(messagetitle, "", "error", false);
    // },
    uploadFile(param) {
      let fileObj = param.file;
      let headerData = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.uploading = true;
      let form = new FormData();
      // 文件对象
      form.append("file", fileObj, fileObj.name);
      // 其他参数
      // form.append("file", this.fileParams.file);
      form.append("fileType", this.fileParams.fileType);
      form.append("directory", this.fileParams.directory);
      form.append("dataArea", this.fileParams.dataArea);
      form.append("template", this.fileParams.file);
      form.append("isContinueUpload", this.fileParams.isContinueUpload);
      this.$post(this.$urls.uploadUrl, form, headerData)
        .then(res => {
          this.uploading = false;
          this.uploadDialog = false;
          let messageErr = res.data.message;
          if (res.data.code == 200 && res.data.success) {
            this.getDataList();
            // this.$message.success(res.data.msg);
            this.$common.messageBox(
              "File uploaded successfully",
              "",
              "success",
              false
            );
          } else if (res.data.code == 500) {
            let messageData = `<p style="font-family: PingFangSC-Semibold;
    font-size: 24px;color: #333333;letter-spacing: 0;">File upload interrupt</p>
    <p style="font-family: BMWTypeCondensedLight!important;font-size: 16px;color: #333333;letter-spacing: 0;">
    ${messageErr}</p>`;
            this.$confirm(messageData, "", {
              confirmButtonText: "Yes",
              cancelButtonText: "No",
              type: "warning",
              center: true,
              showCancelButton: true,
              showConfirmButton: true,
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                this.fileParams.isContinueUpload = "Y";
                this.uploadFile(param);
              })
              .catch(() => {
                return false;
              });
          } else {
            // this.$message.error(res.message);
            this.$common.messageBox(
              "File upload failed",
              messageErr,
              "error",
              false
            );
          }
        })
        .catch(err => {
          this.uploading = false;
          this.uploadDialog = false;
          console.log(err);
          this.$common.messageBox(
            "File upload failed",
            err.message,
            "error",
            false
          );
        });
    },
    closeFile() {
      setTimeout(() => {
        this.uploadDialog = false;
        this.$refs.upload.clearFiles();
      });
    },

    getDataList() {
      this.$emit("getMessage", true);
      this.$post(this.$urls.getResourcesUrl, {}, {})
        .then(res => {
          this.$emit("getMessage", false);
          if (res.data.code == 200 && res.data.success) {
            let arr = [];
            for (let i = 0; i < res.data.data.length; i++) {
              let fileUploadListArr = res.data.data[i].fileUploadList;
              if (fileUploadListArr && Array.isArray(fileUploadListArr))
                arr = arr.concat(fileUploadListArr);
            }
            // 数组去重
            let result = [];
            let obj = {};
            for (let i = 0; i < arr.length; i++) {
              let idItem = arr[i].id;
              if (!obj[idItem]) {
                result.push(arr[i]);
                obj[idItem] = 1;
              }
            }
            this.dataList = result;
            // this.$message.success(res.data.message);
          } else {
            this.$common.messageBox(res.data.message, "", "error", true);
          }
        })
        .catch(err => {
          this.$emit("getMessage", false);
          console.log(err);
          this.$common.messageBox(err.message, "", "error", true);
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
  .dialog-title {
    span {
      font-size: 24px;
      font-weight: 600;
    }
  }
  .el-button {
    font-size: 18px;
    width: 120px;
    height: 40px;
    font-weight: 600;
    background: #6e9cda;
    border-radius: 19px;
    font-family: BMWTypeCondensedLight !important;
    .el-icon-upload2 {
      margin-left: 0;
      font-weight: 600;
    }
  }
  .el-button.down-button {
    font-size: 16px;
    width: 120px;
    height: 40px;
    // float: right;
    background: #6e9cda;
    border-radius: 19px;
    font-family: BMWTypeCondensedLight !important;
    padding: 5px !important;
    span {
      margin-left: 0 !important;
    }
    .el-icon-download {
      font-weight: 600;
    }
  }
  .el-button.down-button.is-disabled {
    background: #666 !important;
    border: 1px solid #666 !important;
  }
  .el-table,
  .el-table__expanded-cell {
    background-color: transparent;
    border: 2px solid #525e6f; /*no*/
    // border-bottom: 0;
    border-radius: 4px;
  }
  .el-table th,
  .el-table tr {
    font-size: 24px;
    color: #fff;
    // border-bottom: 2px solid #525e6f; /*no*/
    height: 70px;
    background-color: transparent;
    th.is-leaf {
      border-bottom: none; /*no*/
    }
  }
  .el-table tr:last-child {
    border-bottom: none;
  }
  .header-row {
    font-size: 24px;
    background-color: #323944 !important;
    .cell {
      overflow: visible !important;
    }
  }
  // 文件上传弹框
  .el-dialog__wrapper.eldialog {
    display: flex;
    align-items: center;
    margin-top: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-loading-spinner {
    top: 102px;
  }
  //
  .el-dialog {
    width: 790px;
    height: 295px;
    margin-top: 0 !important;
    z-index: 9999;
    .el-loading-text {
      margin: 22px 0;
      font-size: 18px;
    }
    .upload-demo {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
    }
    .el-dialog__header {
      text-align: center;
    }

    // 文件上传loading
    .el-loading-mask {
      height: 295px;
      margin-top: -54px;
      background-color: #fff;
      .el-icon-upload {
        font-size: 70px !important;
      }
      .el-loading-spinner i,
      .el-loading-text {
        color: #fa8c16;
      }
    }
  }

  .el-table td,
  .el-table th.is-leaf {
    height: 68px;
    background-color: transparent !important;
  }
  .el-table td {
    border-bottom: 2px solid #525e6f; /*no*/
    .cell {
      overflow: visible !important;
    }
  }
  .el-table .el-table__row:last-child td {
    border-bottom: none !important;
  }
  .el-table::before {
    width: 0;
  }
}
</style>
