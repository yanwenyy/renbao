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
          style="width:80%"
          placeholder="请选择"
        ></el-input>
        <el-button type="primary" @click="chooseHospital">选择</el-button>
      </el-form-item>
      <el-form-item label="批次名称" prop="batchName">
        <el-input
          v-model="dataForm.batchName"
          style="width:80%"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="batchRemark">
        <el-input
          type="textarea"
          v-model="dataForm.batchRemark"
          style="width:80%"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <div align="center">
      <el-button type="primary" @click="submitForm('dataForm')">确定</el-button>
      <el-button @click="closeRun">取消</el-button>
    </div>
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
      <div align="center" style="margin-top:10px">
        <el-button type="primary" @click="getData">确定</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
    <!--新增/修改页面 -->
  </div>
</template>
<script>
import { transSql } from "@/utils/publicFun.js";
import basicInformation from "@/views/modules/dataAcquisition/basicInformation.vue";
export default {
  props: {
    info: { type: Boolean },
    runIds: { type: String },
    sql: { type: Array },
    ruleSql: { 
      type: Array, 
      default: () => []
    }
  },
  components: {
    basicInformation
  },
  computed: {
    projectId: {
      get () { return this.$store.state.common.projectId}
    },
  },
  data() {
    var validExpectedBeginTime = (rule, value, callback) => {
      let date1 = new Date();
      let date2 = new Date(value);
      let s1 = date1.getTime();
      let s2 = date2.getTime();
      let total = (s2 - s1) / 1000;
      let day = parseInt(total / (24 * 60 * 60)); //计算整bai数天du数
      let afterDay = total - day * 24 * 60 * 60; //取得值算出天数后dao剩余的转秒数shu
      let hour = parseInt(afterDay/(60 * 60)); //计算整数小时数
      let afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
      let min = parseInt(afterHour / 60); //计算整数分
      console.log(min);
      if (min <= 2) {
        callback(new Error('开始执行时间需要大于当前时间2分钟'));
      } else {
        callback();
      }
    }
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
        expectedBeginTime: [{ validator: validExpectedBeginTime, trigger: "blur" }],
        hospitalName: [{ required: true, message: "请选择", trigger: "blur" }],
        batchName: [{ required: true, message: "请输入", trigger: "blur" }]
      },
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
      showHospitalDialog: false
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
              url: this.$http.adornUrl(`/rule/ruleRun`),
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
                  runType: 1,
                  projectId: this.projectId,
                  ruleSql: this.ruleSql
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
                // this.$emit("close");
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
                  runType: 2,
                  projectId: this.projectId,
                  ruleSql: this.ruleSql
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
                // this.$emit("close");
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
          this.$refs.hospital.toggleAllSelection();
        }
      });
    },
    //选择医院确定
    getData() {
      //获取已选医院数据
      let data = this.$refs.hospital.multipleSelection;
      //转换sql处理
      this.ruleSql.forEach(item => {
        item.sql = transSql(item.sql, data);
      });
      console.log("ruleSql:", this.ruleSql);
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
