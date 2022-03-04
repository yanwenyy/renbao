<template>
  <div>
    <el-form label-width="160px">
      <el-form-item v-if="info" label="选择开始执行时间" prop="ruleName">
        <el-date-picker
          v-model="dataForm.datetime"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择医院" prop="ruleName">
        <el-input
          v-model="dataForm.ruleName"
          style="width:400px"
          placeholder="请选择"
        ></el-input>
        <el-button type="primary" @click="chooseHospital">选择</el-button>
      </el-form-item>
      <el-form-item label="批次名称" prop="ruleName">
        <el-input
          v-model="dataForm.ruleName"
          style="width:400px"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="ruleName">
        <el-input
          type="textarea"
          v-model="dataForm.ruleName"
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
    info: Boolean
  },
  components: {
    choose
  },
  data() {
    return {
      dataForm: {
        ruleName: ""
      },
      showHospitalDialog: false
    };
  },
  methods: {
    //确定
    submitForm(dataForm) {
      this.$alert(`操作成功！请在初探规则监控中查看运行详情`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      });
    },
    //取消
    close() {
      this.$emit("close");
    },
    //选择医院弹窗
    chooseHospital() {
      this.showHospitalDialog = true;
    }
  }
};
</script>
