<!--编辑底稿弹窗-->
<template>
  <div>
    <el-form
      :model="dataForm"
      :rules="rules"
      ref="dataForm"
      label-width="120px"
      v-loading="loading"
    >
      <el-form-item prop="manuscriptName" label="底稿名称：">
        <el-input
          v-model="dataForm.manuscriptName"
          placeholder="请输入"
          :readonly="readonly"
        ></el-input>
      </el-form-item>
      <el-form-item prop="manuscriptCode" label="底稿编号：">
        <el-input
          v-model="dataForm.manuscriptCode"
          placeholder="请输入"
          :readonly="readonly"
        ></el-input>
      </el-form-item>
      <el-form-item prop="evidenceName" label="证据：">
        <el-input
          style="width:80%"
          v-model="dataForm.evidenceName"
          placeholder="请选择"
          disabled
        ></el-input>
        <el-button v-if="!readonly" type="primary" @click="chooseEvidence"
          >选择</el-button
        >
      </el-form-item>
      <el-form-item prop="hospitalName" label="医院：">
        <el-input
          style="width:80%"
          v-model="dataForm.hospitalName"
          placeholder="请选择"
          disabled
        ></el-input>
        <el-button v-if="!readonly" type="primary" @click="chooseHospital"
          >选择</el-button
        >
      </el-form-item>
      <el-form-item prop="manuscriptRemark" label="违规信息描述：">
        <el-input
          v-model="dataForm.manuscriptRemark"
          type="textarea"
          :autosize="{ minRows: 7, maxRows: 7 }"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item prop="ruleName" label="关联规则名称：">
        <el-input
          v-model="dataForm.ruleName"
          placeholder="请输入"
          disabled
        ></el-input>
      </el-form-item>
    </el-form>
    <div align="center">
      <el-button v-if="!readonly" type="primary" @click="submit"
        >确定</el-button
      >
      <el-button v-if="!readonly" @click="close">取消</el-button>
      <el-button v-if="readonly" @click="close">关闭</el-button>
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
      <div>
        <el-button type="primary" @click="getHospitalData">确定</el-button>
        <el-button @click="closeHospital">取消</el-button>
      </div>
    </el-dialog>
    <!--选择证据弹窗 -->
    <el-dialog
      :visible.sync="showEvidenceDialog"
      title="选择证据"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="80%"
      height="200px"
      :close-on-press-escape="false"
      append-to-body
    >
      <evidence ref="evidence" v-if="showEvidenceDialog"></evidence>
      <div>
        <el-button type="primary" @click="getEvidenceData">确定</el-button>
        <el-button @click="closeEvidence">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import basicInformation from "@/views/modules/dataAcquisition/basicInformation.vue"; //选择医院弹窗
import evidence from "@/views/modules/evidenceManagement/evidence.vue"; //选择医院弹窗
export default {
  props: {
    data: { type: Object },
    readonly: { type: Boolean }
  },
  components: {
    basicInformation,
    evidence
  },
  data() {
    return {
      dataForm: {
        ruleId: "",
        ruleName: "",
        manuscriptId: "",
        manuscriptName: "",
        manuscriptCode: "",
        manuscriptRemark: "",
        evidenceId: "",
        evidenceName: "",
        hospitalCode: "",
        hospitalName: ""
      },
      rules: {
        manuscriptName: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        manuscriptCode: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        hospitalName: [{ required: true, message: "请选择", trigger: "blur" }],
        manuscriptRemark: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        ruleId: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      loading: false,
      showHospitalDialog: false,
      showEvidenceDialog: false
    };
  },
  created() {
    this.init();
    this.dataForm.ruleName = this.data.ruleName;
  },
  methods: {
    init() {
      this.$http({
        url: this.$http.adornUrl(`/manuscript/editManuscript`),
        method: "get",
        params: this.$http.adornParams({
          ruleId: this.data.ruleId
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          if (data.result != null) {
            this.dataForm.ruleId = this.data.ruleId;
            this.dataForm.ruleName = this.data.ruleName;
            this.dataForm.manuscriptId = data.result.manuscriptId;
            this.dataForm.manuscriptName = data.result.manuscriptName;
            this.dataForm.manuscriptCode = data.result.manuscriptCode;
            this.dataForm.manuscriptRemark = data.result.manuscriptRemark;
            this.dataForm.evidenceName = data.result.evidenceName;
            this.dataForm.hospitalName = data.result.hospitalName;
          } else {
            this.dataForm.ruleId = this.id;
          }
        } else {
          this.$message.error("查询失败");
        }
      });
    },
    //确定
    submit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/manuscript/add`),
            method: "post",
            data: this.$http.adornData({
              ruleId: this.data.ruleId,
              manuscriptId: this.dataForm.manuscriptId,
              manuscriptName: this.dataForm.manuscriptName,
              manuscriptCode: this.dataForm.manuscriptCode,
              manuscriptRemark: this.dataForm.manuscriptRemark,
              evidenceId: this.dataForm.evidenceId,
              evidenceName: this.dataForm.evidenceName,
              hospitalCode: this.dataForm.hospitalCode,
              hospitalName: this.dataForm.hospitalName
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
              this.$message.error(data.message);
            }
          });
        }
      });
    },
    //关闭编辑底稿弹窗
    close() {
      this.$emit("close");
    },
    //打开选择医院弹窗
    chooseHospital() {
      this.showHospitalDialog = true;
    },
    //获取选择医院数据
    getHospitalData() {
      //获取已选医院数据
      let data = this.$refs.hospital.multipleSelection;
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
    },
    //关闭选择医院弹窗
    closeHospital() {
      this.showHospitalDialog = false;
    },
    //选择证据弹窗
    chooseEvidence() {
      this.showEvidenceDialog = true;
    },
    //获取已选证据数据
    getEvidenceData() {
      //获取已选医院数据
      let data = this.$refs.evidence.multipleSelection;
      //处理医院数据并反显
      var evidenceIds = "";
      var evidenceNames = "";
      for (var i = 0; i < data.length; i++) {
        evidenceIds += data[i].evidenceId + ",";
        evidenceNames += data[i].evidenceName + ",";
      }
      if (evidenceIds.length > 0 && evidenceNames.length > 0) {
        evidenceIds = evidenceIds.substr(0, evidenceIds.length - 1);
        evidenceNames = evidenceNames.substr(0, evidenceNames.length - 1);
      }
      this.dataForm.evidenceName = evidenceNames;
      this.dataForm.evidenceId = evidenceIds;
      this.showEvidenceDialog = false;
    },
    //关闭选择证据弹窗
    closeEvidence() {
      this.showEvidenceDialog = false;
    }
  }
};
</script>
<style scoped lang="scss"></style>
