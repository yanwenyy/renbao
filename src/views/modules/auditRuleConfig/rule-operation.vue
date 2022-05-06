<template>
  <div class="detail-box">
    <el-dialog
      ref="ruleOperation"
      title="规则运行"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      width="40%"
    >
      <div class="rule-operation">
        <el-form
          ref="ruleOperationForm"
          :model="ruleOperationForm"
          :rules="ruleOperationFormRules"
          label-width="160px"
          style="text-align: left"
        >
          <el-form-item
            label="选择开始执行时间"
            prop="startTime"
            v-if="type == 'timing'"
          >
            <el-date-picker
              v-model="ruleOperationForm.expectedBeginTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择医院" prop="hospital">
            <el-input
              :title="ruleOperationForm.hospital"
              class="size"
              :disabled="true"
              placeholder="请选择医院"
              style="width:80%"
              v-model="ruleOperationForm.hospital"
              autocomplete="off"
            ></el-input>
            <el-button type="primary" @click="changeHospital">选择</el-button>
          </el-form-item>
          <el-form-item label="批次名称" prop="batchName">
            <el-input
              class="size"
              style="width:80%"
              v-model="ruleOperationForm.batchName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="batchRemark">
            <el-input
              class="size"
              style="width:80%"
              v-model="ruleOperationForm.batchRemark"
              autocomplete="off"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div align="right">
         <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit('ruleOperationForm')"
          :loading="loading"
        >确 定</el-button
        >
        <el-button @click="handleClose">取 消</el-button>
      </span>
      </div>

    </el-dialog>
    <hospital-selection ref="hospitalSelection"></hospital-selection>
  </div>
</template>
<script>
import hospitalSelection from "./hospital-selection.vue"; // 选择医院弹框
export default {
  props: ["getData"],
  data() {
    let validExpectedBeginTime = (rule, value, callback) => {
      let date1 = new Date();
      let date2 = new Date(value);
      let s1 = date1.getTime();
      let s2 = date2.getTime();
      let total = (s2 - s1) / 1000;
      let day = parseInt(total / (24 * 60 * 60)); //计算整bai数天du数
      let afterDay = total - day * 24 * 60 * 60; //取得值算出天数后dao剩余的转秒数shu
      let hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
      let afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
      let min = parseInt(afterHour / 60); //计算整数分
      if (min <= 2) {
        callback(new Error('开始执行时间需要大于当前时间2分钟'));
      } else {
        callback();
      }
    }
    return {
      loading: false,
      dialogVisible: false,
      ruleOperationForm: {
        expectedBeginTime: "",
        hospital: "",
        batchName: "",
        batchRemark: "",
        hospitalCode: "",
        hospitalName: "",
        runType: "",
        resultSqlValue: [],
        ruleSql: []
      },
      ruleOperationFormRules: {
        expectedBeginTime: [{ validator: validExpectedBeginTime, trigger: "blur" }],
        batchName: [{ required: true, message: "请输入批次名称" }],
        hospital: [{ required: true, message: "请选择医院" }]
      },
      type: "",
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          const oneday = date.getTime();
          return time.getTime() < new Date().getTime() - 86400000;
        },
        selectableRange: (() => {
          let data = new Date();
          let hour = data.getHours();
          let minute = data.getMinutes();
          let second = data.getSeconds();
          return [`${hour}:${minute}:${second} - 23:59:59`];
        })()
      }
    };
  },
  methods: {
    //默认打开页面
    showDialog(checkRuleData, type) {
      this.reset();
      this.dialogVisible = true;
      this.type = type;
      this.ruleOperationForm.ruleSql = JSON.parse(JSON.stringify(checkRuleData));
      this.ruleOperationForm.runType = this.type == "timing" ? 2 : 1; // runtype 1是立即运行 2是定时运行
    },
    changeHospital() {
      this.$refs.hospitalSelection.showDialog(this.ruleOperationForm.ruleSql, this.type);
    },
    reset() {
      this.ruleOperationForm = {
        expectedBeginTime: "",
        hospital: "",
        batchName: "",
        batchRemark: "",
        hospitalCode: "",
        hospitalName: "",
        ruleSql: []
      };
    },
    handleClose() {
      this.dialogVisible = false;
      this.resetForm();
      this.reset();
    },
    onSubmit(formName) {
      this.ruleOperationForm.batchType = 2;
      this.ruleOperationForm.projectId = this.projectId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$http({
            isLoading: false,
            url: this.$http.adornUrl("/rule/ruleRun"),
            method: "post",
            data: this.$http.adornData(this.ruleOperationForm, false)
          })
            .then(({ data }) => {
              // this.btnLoading = false;
              if (data.code == 200) {
                this.loading = false;
                this.$alert("请在审核执行监控中查看运行详情", "执行成功", {
                  confirmButtonText: "关闭",
                  callback: action => {
                    this.dialogVisible = false;
                    this.$parent.setTableChecked();
                  }
                });
              } else {
                this.$message({
                  message: data.message,
                  type: "error",
                  duration: 1500
                });
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    setHospital(checkHospitalList, checkRuleData) {
      let hospitalName = [];
      let hospitalCode = [];
      checkHospitalList.map(i => {
        hospitalName.push(i["医疗机构名称"]);
        hospitalCode.push(i["医疗机构编码"]);
      });
      this.ruleOperationForm.hospital = hospitalName.join(",");
      this.ruleOperationForm.hospitalName = hospitalName.join(",");
      this.ruleOperationForm.hospitalCode = hospitalCode.join(",");
      //sql
      this.ruleOperationForm.ruleSql = checkRuleData;
    },
    resetForm() {
      if (this.$refs["ruleOperationForm"]) {
        this.$refs["ruleOperationForm"].resetFields();
      }
    }
  },
  components: {
    hospitalSelection
  },
  computed: {
    projectId: {
      get() {
        if (this.$store.state.common.projectId) {
          return this.$store.state.common.projectId;
        } else {
          this.$http({
            url: this.$http.adornUrl("/xmProject/selectProjectByUserId"),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 200) {
              return data.result && data.result.projectId && data.result.projectId || '';

            }
          });
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.detail-box {
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  /deep/ .el-dialog__footer {
    text-align: center;
  }
  .rule-tree-box {
    display: flex;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}
</style>
