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
          placeholder="底稿名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="manuscriptCode" label="底稿编号：">
        <el-input
          v-model="dataForm.manuscriptCode"
          placeholder="底稿编号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="evidenceName" label="证据：">
        <el-input
          style="width:80%"
          v-model="dataForm.evidenceName"
          placeholder="证据"
        ></el-input>
        <el-button type="primary">选择</el-button>
      </el-form-item>
      <el-form-item prop="hospitalName" label="医院：">
        <el-input
          style="width:80%"
          v-model="dataForm.hospitalName"
          placeholder="选择医院"
        ></el-input>
        <el-button type="primary" @click="chooseHospital">选择</el-button>
      </el-form-item>
      <el-form-item prop="manuscriptRemark" label="违规信息描述：">
        <el-input
          v-model="dataForm.manuscriptRemark"
          type="textarea"
          :autosize="{ minRows: 7, maxRows: 7 }"
          placeholder="违规信息描述"
        ></el-input>
      </el-form-item>
      <el-form-item prop="ruleId" label="关联规则编号：">
        <el-input
          v-model="dataForm.ruleId"
          placeholder="关联规则编号"
          disabled
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submit">确定</el-button>
    <el-button @click="close">取消</el-button>
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
      <el-button type="primary" @click="getHospitalData">确定</el-button>
      <el-button @click="closeHospital">取消</el-button>
    </el-dialog>
  </div>
</template>
<script>
import basicInformation from "@/views/modules/dataAcquisition/basicInformation.vue"; //选择医院弹窗
export default {
  props: {
    id: { type: String }
  },
  components: {
    basicInformation
  },
  data() {
    return {
      dataForm: {
        manuscriptName: "",
        manuscriptCode: "",
        evidenceIde: "",
        evidenceName: "",
        manuscriptRemark: "",
        ruleId: "",
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
        // hospital: [{ required: true, message: "请选择", trigger: "blur" }],
        manuscriptRemark: [
          { required: true, message: "请输入", trigger: "blur" }
        ],
        ruleId: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      loading: false,
      showHospitalDialog: false
    };
  },
  created() {
    this.dataForm.ruleId = this.id;
  },
  methods: {
    //确定
    submit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/manuscript/add`),
            method: "post",
            data: this.$http.adornData({
              ruleId: this.id,
              evidenceId: "",//逗号拼接字符串
              evidenceName: "",
              manuscriptName: this.dataForm.manuscriptName,
              manuscriptCode: this.dataForm.manuscriptCode,
              manuscriptRemark: this.dataForm.manuscriptRemark,
              // hospitalCode: "",
              hospitalName: ""//逗号拼接字符串
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
    },
    //关闭选择医院弹窗
    closeHospital() {
      this.showHospitalDialog = false;
    }
  }
};
</script>
<style scoped lang="scss"></style>
