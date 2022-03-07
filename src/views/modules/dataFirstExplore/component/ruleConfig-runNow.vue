<template>
  <div>
    <el-form
      label-width="160px"
      :model="dataForm"
      ref="dataForm"
      :rules="rules"
    >
      <el-form-item
        v-if="info"
        label="选择开始执行时间"
        prop="expectedBeginTime"
      >
        <el-date-picker
          v-model="dataForm.expectedBeginTime"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择医院" prop="hospitalName">
        <el-input
          disabled
          v-model="dataForm.hospitalName"
          style="width:400px"
          placeholder="请选择"
        ></el-input>
        <el-button type="primary" @click="chooseHospital">选择</el-button>
      </el-form-item>
      <el-form-item label="批次名称" prop="batchName">
        <el-input
          v-model="dataForm.batchName"
          style="width:400px"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="batchRemark">
        <el-input
          type="textarea"
          v-model="dataForm.batchRemark"
          style="width:400px"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submitForm('dataForm')">确定</el-button>
    <el-button @click="close">取消</el-button>
    <!--查看详细弹窗 -->
    <el-dialog
      :visible.sync="showHospitalDialog"
      title="选择医院"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="60%"
      append-to-body
      :close-on-press-escape="false"
    >
      <choose
        @close="close"
        @ok="succeed"
        :info="info"
        v-if="showHospitalDialog"
      ></choose>
    </el-dialog>
    <!--新增/修改页面 -->
  </div>
</template>
<script>
import choose from "./ruleConfig-chooseHospital.vue";
export default {
  props: {
    info: { type: Boolean },
    runIds: { type: String }
  },
  components: {
    choose
  },
  data() {
    return {
      dataForm: {
        expectedBeginTime: "",
        hospitalName: "",
        batchName: "",
        batchRemark: ""
      },
      //   form校验
      rules: {
        // hospitalName: [{ required: true, message: "请选择", trigger: "blur" }],
        batchName: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      showHospitalDialog: false
    };
  },
  methods: {
    //确定
    submitForm(dataForm) {
      if ((this.info = false)) {
        //立即运行
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/rule/timeRunning`),
              method: "post",
              data: this.$http.adornData({
                batchName: this.dataForm.batchName,
                batchRemark: this.dataForm.batchRemark,
                // hospitalCode: this.dataForm.hospitalCode,
                // hospitalName: this.dataForm.hospitalName,
                rule: {
                  ruleId: this.runIds
                }
              })
            }).then(({ data }) => {
              if (data && data.code === 200) {
                this.$alert(
                  `操作成功！请在初探规则监控中查看运行详情`,
                  "提示",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                  }
                );
                this.$emit("close");
              } else {
                this.$message.error("操作失败");
                this.$emit("close");
              }
            });
          }
        });
      } else {
        //定时运行
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/rule/timeRan`),
              method: "post",
              data: this.$http.adornData({
                uuid: this.runIds,
                batch: {
                  expectedBeginTime: this.dataForm.expectedBeginTime,
                  batchName: this.dataForm.batchName,
                  batchRemark: this.dataForm.batchRemark
                  // hospitalCode: this.dataForm.hospitalCode,
                  // hospitalName: this.dataForm.hospitalName,
                }
              })
            }).then(({ data }) => {
              if (data && data.code === 200) {
                this.$alert(
                  `操作成功！请在初探规则监控中查看运行详情`,
                  "提示",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                  }
                );
                this.$emit("close");
              } else {
                this.$message.error("操作失败");
                this.$emit("close");
              }
            });
          }
        });
      }
    },
    //取消
    close() {
      this.showHospitalDialog = false;
      this.$emit("close");
    },
    succeed() {
      this.showHospitalDialog = false;
    },
    //选择医院弹窗
    chooseHospital() {
      this.showHospitalDialog = true;
    }
  }
};
</script>
