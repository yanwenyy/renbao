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
      <el-form-item prop="" label="底稿名称：">
        <el-input v-model="dataForm.paramKey" placeholder="底稿名称"></el-input>
      </el-form-item>
      <el-form-item prop="" label="底稿编号：">
        <el-input v-model="dataForm.paramKey" placeholder="底稿编号"></el-input>
      </el-form-item>
      <el-form-item prop="" label="证据：">
        <el-input v-model="dataForm.paramKey" placeholder="证据"></el-input>
      </el-form-item>
      <el-form-item prop="" label="医院：">
        <el-input v-model="dataForm.paramKey" placeholder="选择医院"></el-input>
      </el-form-item>
      <el-form-item prop="" label="违规信息描述：">
        <el-input v-model="dataForm.paramKey" placeholder="违规信息描述"></el-input>
      </el-form-item>
      <el-form-item prop="" label="关联规则编号：">
        <el-input v-model="dataForm.paramKey" placeholder="关联规则编号"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataForm: {
        paramKey: ""
      }
    };
  }
};
</script>
