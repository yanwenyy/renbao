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
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
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
    <el-button @click="closeRun">取消</el-button>
    <!--选择医院弹窗 -->
    <el-dialog
      :visible.sync="showHospitalDialog"
      title="选择医院"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="90%"
      :close-on-press-escape="false"
      append-to-body
    >
      <basicInformation
        ref="hospital"
        v-if="showHospitalDialog"
      ></basicInformation>
      <el-button type="primary" @click="getData">确定</el-button>
      <el-button @click="close">取消</el-button>
    </el-dialog>
    <!--新增/修改页面 -->
  </div>
</template>
<script>
import { transSql } from "@/utils/publicFun.js";
import choose from "./ruleConfig-chooseHospital.vue";
import basicInformation from "@/views/modules/dataAcquisition/basicInformation.vue";
export default {
  props: {
    info: { type: Boolean },
    runIds: { type: String },
    sql: { type: Array }
  },
  components: {
    choose,
    basicInformation
  },
  data() {
    return {
      dataForm: {
        expectedBeginTime: "",
        hospitalName: "",
        hospitalCode: "",
        batchName: "",
        batchRemark: ""
      },
      //   form校验
      rules: {
        hospitalName: [{ required: true, message: "请选择", trigger: "blur" }],
        batchName: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      showHospitalDialog: false,
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
      },
      showHospitalDialog: false,
      resultSqlValue: []
    };
  },
  methods: {
    //运行确定
    submitForm(dataForm) {
      if (this.info == false) {
        //立即运行
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`rule/ruleRun`),
              method: "post",
              data: this.$http.adornData(
                {
                  batchName: this.dataForm.batchName,
                  batchRemark: this.dataForm.batchRemark,
                  batchType: 1,
                  expectedBeginTime: "",
                  hospital: this.dataForm.hospitalName,
                  hospitalCode: this.dataForm.hospitalCode,
                  hospitalName: this.dataForm.hospitalName,
                  ruleId: this.runIds,
                  runType: 1,
                  resultSqlValue: this.resultSqlValue
                },
                false
              )
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
                this.$emit("ok");
              } else {
                this.$message.error(data.message);
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
              url: this.$http.adornUrl(`/rule/ruleRun`),
              method: "post",
              data: this.$http.adornData(
                {
                  batchName: this.dataForm.batchName,
                  batchRemark: this.dataForm.batchRemark,
                  batchType: 1,
                  expectedBeginTime: this.dataForm.expectedBeginTime,
                  hospital: this.dataForm.hospitalName,
                  hospitalCode: this.dataForm.hospitalCode,
                  hospitalName: this.dataForm.hospitalName,
                  ruleId: this.runIds,
                  runType: 2,
                  resultSqlValue: this.resultSqlValue
                },
                false
              )
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
                this.$message.error(data.message);
                this.$emit("close");
              }
            });
          }
        });
      }
    },
    //关闭运行弹窗
    closeRun() {
      this.$emit("close");
    },
    //关闭医院弹窗
    close() {
      this.showHospitalDialog = false;
    },
    //选择医院弹窗
    chooseHospital() {
      this.showHospitalDialog = true;
      this.$nextTick(() => {
        if (this.$refs.hospital) {
          this.$refs.hospital.reSetHospital();
        }
      });
    },
    //选择医院确定
    getData() {
      //获取已选医院数据
      let data = this.$refs.hospital.multipleSelection;
      //转换sql处理
      for (var i = 0; i < this.sql.length; i++) {
        this.resultSqlValue.push(transSql(this.sql[i], data));
      }
      //处理医院数据并反显
      var hospitalCodes = "";
      var hospitalNames = "";
      for (var i = 0; i < data.length; i++) {
        hospitalCodes += data[i].医疗机构编码 + ",";
        hospitalNames += data[i].医疗机构名称 + ",";
      }
      if (hospitalCodes.length > 0 && hospitalNames.length > 0) {
        hospitalCodes = hospitalCodes.substr(0, hospitalCodes.length - 1);
        hospitalNames = hospitalNames.substr(0, hospitalNames.length - 1);
      }
      this.dataForm.hospitalName = hospitalNames;
      this.dataForm.hospitalCode = hospitalCodes;
      this.showHospitalDialog = false;
    }
  }
};
</script>
