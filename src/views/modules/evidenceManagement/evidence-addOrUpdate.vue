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
          v-model="dataForm.evidenceName"
          placeholder="证据名称"
          :readonly="readonly"
        ></el-input>
      </el-form-item>
      <el-form-item prop="evidenceRemark" label="证据描述：">
        <el-input
          type="textarea"
          v-model="dataForm.evidenceRemark"
          placeholder="证据描述"
          :autosize="{ minRows: 10, maxRows: 10 }"
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
          >
            <el-button size="small" type="primary" v-if="showBtn"
              >点击上传</el-button
            >
          </el-upload>
        </div>

        <el-table
          v-if="showFileTable"
          :data="multipartFiles"
          border
          v-loading="loading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
          >
          </el-table-column>
          <el-table-column
            prop="roleNumber"
            header-align="center"
            align="center"
            label="附件名称"
          >
          </el-table-column>
          <el-table-column
            prop="creatUserName"
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
              <el-button type="text" @click="deleteData(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="itemBtn"></div>
    <el-button type="primary" @click="submitForm('dataForm')" v-if="showBtn"
      >确定</el-button
    >
    <el-button @click="closeDialog('dataForm')" v-if="showBtn">取消</el-button>
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
        evidenceRemark: ""
      },
      //form校验
      rules: {
        evidenceName: [{ required: true, message: "请输入", trigger: "blur" }],
        evidenceRemark: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      loading: false,
      //单位选择页是否显示
      showDetailDialog: false,
      multipartFiles: [],
      fileList: []
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
      this.loading = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
      this.$http({
        url: this.$http.adornUrl(`/evidence/selectByUuid/${this.id}`),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          var role = data.result;
          this.dataForm.evidenceName = role.evidenceName;
          this.dataForm.evidenceRemark = role.evidenceRemark;
          this.loading = false;
        }
      });
    },
    //获取上传的附件
    uploadData(fileData) {
      this.multipartFiles.push(fileData.file);
    },
    // 表单提交
    submitForm(dataForm) {
      if (this.multipartFiles.length == 0) {
        this.$message({
          message: "请选择上传文件！",
          type: "error"
        });
        return;
      }
      // console.log(this.multipartFiles);
      let evidence = new FormData();
      evidence.append("evidenceId", this.id || undefined); //传文件
      evidence.append("evidenceName", this.dataForm.evidenceName); //传文件
      evidence.append("evidenceRemark", this.dataForm.evidenceRemark); //传文件
      evidence.append("multipartFiles", this.multipartFiles[0]); //传文件
      this.$http({
        url: this.$http.adornUrl(
          `/evidence/${!this.id ? "add" : "updateByUuId"}`
        ),
        headers: {
          "Content-Type": "multipart/form-data"
        },
        method: "post",
        data: evidence
        /* data: this.$http.adornData({
          evidenceId: this.id || undefined,
          evidenceName: this.dataForm.evidenceName,
          evidenceRemark: this.dataForm.evidenceRemark,
          multipartFiles: this.multipartFiles
        }) */
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
          this.$message.error("操作失败");
        }
      });

      /* this.$refs[dataForm].validate(valid => {
        if (valid) {
          this.$refs.ruleFileUpload.submit();
        }
      }); */
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {
      console.log(files, fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
      console.log(file, fileList);
    },
    handleChange(response, file, fileList) {},
    //删除附件
    deleteData() {}
  }
};
</script>
<style lang="scss" scoped>
.itemBtn {
  text-align: center;
  margin-top: 10px;
}
</style>
