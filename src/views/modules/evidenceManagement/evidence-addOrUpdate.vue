<!--证据新增、修改弹窗-->
<template>
  <div>
    <el-form
      :model="dataForm"
      :rules="rules"
      ref="dataForm"
      label-width="120px"
      v-loading="loading"
    >
      <el-form-item prop="evidenceName" label="证据名称：">
        <el-input
          maxlength="255"
          v-model="dataForm.evidenceName"
          placeholder="证据名称"
          :readonly="readonly"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="readonly" prop="manuscriptName" label="底稿名称：">
        <el-input
          v-model="dataForm.manuscriptName"
          placeholder="底稿名称"
          :readonly="readonly"
        ></el-input>
      </el-form-item>
      <el-form-item prop="evidenceRemark" label="证据描述：">
        <el-input
          type="textarea"
          v-model="dataForm.evidenceRemark"
          placeholder="证据描述"
          :autosize="{ minRows: 6, maxRows: 6 }"
          :readonly="readonly"
        ></el-input>
      </el-form-item>
      <el-form-item prop="evidenceAccessory" label="附件：">
        <div style="float:left;margin-bottom:10px">
          <el-upload
            ref="ruleFileUpload"
            action="#"
            class="upload-demo"
            multiple
            :on-remove="handleRemove"
            :file-list="fileList"
            :http-request="uploadData"
            :before-remove="beforeRemove"
            :on-progress="handleProgress"
            :on-change="fileChange"
          >
            <el-button size="small" type="primary" v-if="showBtn"
              >点击上传</el-button
            >
            <!--  <el-progress
              style="width: 200px;margin-top: 8px"
              :text-inside="true"
              :stroke-width="20"
              :percentage="progressPercent"
            /> -->
          </el-upload>
        </div>
        <el-table
          v-if="showFileTable"
          :data="fileData"
          border
          v-loading="loading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;"
          height="300px"
        >
          <el-table-column
            type="index"
            header-align="center"
            align="center"
            width="50"
          >
          </el-table-column>
          <el-table-column
            prop="fileName"
            header-align="center"
            align="center"
            label="附件名称"
          >
          </el-table-column>
          <el-table-column
            prop="uploaderName"
            header-align="center"
            align="center"
            label="上传人"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="deleteData(scope.$index, fileData, scope.row)"
                v-if="!readonly"
                >删除</el-button
              >
              <el-button
                type="text"
                @click="downLoad(scope.row)"
                v-if="readonly"
                >下载</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div align="center">
      <el-button type="primary" @click="submitForm('dataForm')" v-if="showBtn"
        >确定</el-button
      >
      <el-button @click="closeDialog('dataForm')" v-if="showBtn"
        >取消</el-button
      >
      <el-button @click="closeDialog('dataForm')" v-if="readonly"
        >关闭</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "addOrUpdate",
  props: {
    id: { type: String },
    showFileTable: { type: Boolean },
    showBtn: { type: Boolean },
    readonly: { type: Boolean }
  },
  data() {
    return {
      // form对象
      dataForm: {
        evidenceName: "",
        evidenceRemark: "",
        manuscriptName: ""
      },
      //form校验
      rules: {
        evidenceName: [{ required: true, message: "请输入", trigger: "blur" }],
        evidenceRemark: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      loading: false,
      //单位选择页是否显示
      showDetailDialog: false,
      //附件集合
      multipartFiles: [],
      //上传的附件
      fileList: [],
      //附件列表数据
      fileData: [],
      //移除的附件id
      removeFileIdList: [],
      //上传时移除的附件
      removeFileList: []
    };
  },
  created() {
    if (this.id != null && this.id != "" && this.id != undefined) {
      this.init();
    }
  },
  methods: {
    //初始化表单
    init() {
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
      this.$http({
        url: this.$http.adornUrl(`/evidence/selectByUuid/${this.id}`),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          var data = data.result;
          this.dataForm.evidenceName = data.evidenceName;
          this.dataForm.evidenceRemark = data.evidenceRemark;
          this.dataForm.manuscriptName = data.manuscriptName;
          this.fileData = data.fileInfos;
        }
      });
    },
    //获取上传的文件
    uploadData(fileData) {
      this.multipartFiles.push(fileData.file);
    },
    // 表单提交
    submitForm(dataForm) {
      this.$refs[dataForm].validate(valid => {
        if (valid) {
          //过滤在上传时移除的文件
          if (this.removeFileList.length > 0) {
            this.multipartFiles.forEach(item => {
              this.removeFileList.forEach(it => {
                if (item.uid == it.uid) {
                  this.multipartFiles.remove(item);
                }
              });
            });
          }
          //是否上传了重复文件
          let ishave = false;
          //处理重复上传
          if (this.multipartFiles.length > 0 && this.fileData.length > 0) {
            this.multipartFiles.forEach(item => {
              this.fileData.forEach(it => {
                if (item.name == it.fileName) {
                  this.$message.error(item.name + "已存在");
                  ishave = true;
                }
              });
            });
          }
          //附件去重
          this.multipartFiles = this.distinct(this.multipartFiles);
          //上传附件必要校验
          /* if (this.multipartFiles.length == 0) {
            this.$message({
              message: "请选择上传文件！",
              type: "error"
            });
            return;
          } */
          if (ishave == false) {
            let evidence = new FormData();
            evidence.append("evidenceId", this.id || undefined);
            evidence.append("evidenceName", this.dataForm.evidenceName);
            evidence.append("evidenceRemark", this.dataForm.evidenceRemark);
            for (var i = 0; i < this.multipartFiles.length; i++) {
              evidence.append("multipartFiles", this.multipartFiles[i]);
            }
            if (this.removeFileIdList.length > 0) {
              evidence.append("fileInfoIds", this.removeFileIdList);
            }
            this.$http({
              url: this.$http.adornUrl(
                `/evidence/${!this.id ? "add" : "updateByUuId"}`
              ),
              headers: {
                "Content-Type": "multipart/form-data"
              },
              method: "post",
              data: evidence
            }).then(({ data }) => {
              if (data && data.code === 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.$emit("ok");
                  }
                });
              } else {
                this.$message.error(data.message);
              }
            });
          }
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.dataForm = {
        evidenceName: "",
        evidenceRemark: "",
        evidenceAccessory: ""
      };
      this.$refs[formName].resetFields();
    },
    // 关闭
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.$emit("close");
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    //移除附件提示
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //移除已上传的附件
    handleRemove(file, fileList) {
      this.removeFileList.push(file);
    },
    //文件上传时
    handleProgress(event, file, fileList) {
      // console.log(file,fileList)
    },
    //文件状态改变时
    fileChange(file, fileList) {
      // 该上传文件是否已经存在上传列表中
      let isTrue = "";
      for (var i = 0; i < fileList.length - 1; i++) {
        for (var j = i + 1; j < fileList.length; j++) {
          if (fileList[i].name == fileList[j].name) {
            isTrue = true;
            fileList.remove(fileList[i]);
            //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
            j--;
          }
        }
      }
      if (isTrue == true) {
        this.$message.warning("请勿重复上传文件！");
        return;
      }
      this.fileList = fileList;
    },
    //删除附件
    deleteData(index, data, row) {
      this.$confirm(`确定删除${row.fileName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        data.splice(index, 1);
        this.removeFileIdList.push(row.fileInfoId);
      });
    },
    //下载附件
    downLoad(data) {
      /*  var fileInfoIds = "";
      for (var i = 0; i < this.length; i++) {
        fileInfoIds += this.removeFileIdList[i] + ",";
      }
      if (fileInfoIds.length > 0) {
        fileInfoIds = fileInfoIds.substr(0, fileInfoIds.length - 1);
      } */
      let url =
        this.$http.adornUrl(
          "/evidence/downloadAttachments?fileInfoIds=" +
            data.fileInfoId +
            "&token="
        ) + this.$cookie.get("token");
      window.open(url);
    },
    //附件去重
    distinct(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].name == arr[j].name) {
            arr.splice(j, 1);
            //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
            j--;
          }
        }
      }
      return arr;
    }
  }
};
</script>
<style lang="scss" scoped>
.itemBtn {
  text-align: center;
  margin-left: 40px;
  margin-top: 10px;
}
</style>
