<template>
  <div>
    <el-form v-model="dataForm" ref="dataForm">
      <el-form-item label="报告名称" prop="reportName">
        <el-input
          placeholder="报告名称"
          v-model="dataForm.reportMould"
          style="width:300px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="报告模板" prop="reportMould">
        <el-upload
          class="upload-demo"
          action=""
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="submit" type="primary">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: String
  },
  data() {
    return {
      dataForm: {
        reportName: ""
      },
      fileList: []
    };
  },
  created() {
    if (this.info != "") {
      this.init();
    }
  },
  methods: {
    //确定
    submit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/ruleReport/${!this.id ? "add" : "updateByUuId"}`
            ),
            method: "post",
            data: this.$http.adornData({
              reportId: this.reportId || undefined,
              reportName: this.dataForm.reportName
              // reportMould: this.dataForm.reportMould
            })
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
        }
      });
    },
    //获取数据
    init() {
      var uuid = this.info;
      this.$http({
        url: this.$http.adornUrl(`/ruleReport/selectByUuid/${uuid}`),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 200) {
          var rule = data.result;
          this.dataForm.reportName = rule.reportName;
        }
      });
    },
    //取消
    close() {
      this.$emit("close");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>
