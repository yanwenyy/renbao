<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="80px">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input
          readonly
          v-model="dataForm.ruleName"
          placeholder="规则名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="actualBeginTime">
        <el-input
          readonly
          v-model="dataForm.actualBeginTime"
          placeholder="开始时间"
        ></el-input>
      </el-form-item>
      <el-form-item label="结束时间" prop="actualEndTime">
        <el-input
          readonly
          v-model="dataForm.actualEndTime"
          placeholder="结束时间"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="runStatus">
        <el-input
          readonly
          v-model="dataForm.runStatus"
          placeholder="状态"
        ></el-input>
      </el-form-item>
      <el-form-item label="错误描述" prop="resultMessage">
        <el-input
          readonly
          type="textarea"
          v-model="dataForm.resultMessage"
          placeholder="错误描述"
        ></el-input>
      </el-form-item>
    </el-form>
    <div align="center">
      <el-button @click="close">关闭</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "detail",
  props: {
    id: String,
    name: String
  },
  data() {
    return {
      dataForm: {
        ruleName: "",
        actualBeginTime: "",
        actualEndTime: "",
        runStatus: "",
        resultMessage: ""
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 获取数据列表
    init() {
      var uuid = this.id;
      this.$http({
        url: this.$http.adornUrl(`/ruleResult/selectByUuid/${uuid}`),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataForm.ruleName = this.name;
          this.dataForm.actualBeginTime = data.result.actualBeginTime;
          this.dataForm.actualEndTime = data.result.actualEndTime;
          var runStatus = data.result.runStatus;
          if (runStatus == 1) {
            this.dataForm.runStatus = "待执行";
          } else if (runStatus == 2) {
            this.dataForm.runStatus = "执行中";
          } else if (runStatus == 3) {
            this.dataForm.runStatus = "执行失败";
          } else {
            this.dataForm.runStatus = "已完成";
          }
          this.dataForm.resultMessage = data.result.resultMessage;
        }
      });
    },
    //关闭弹窗
    close() {
      this.$emit("close");
    }
  }
};
</script>
