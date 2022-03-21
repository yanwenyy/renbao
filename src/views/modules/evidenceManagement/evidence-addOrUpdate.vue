<!--证据新增、修改弹窗-->
<template>
  <div>
    <el-form
      :model="dataForm"
      :rules="rules"
      ref="dataForm"
      label-width="120px"
      v-loading="loading"
    >
      <el-form-item prop="" label="证据名称：">
        <el-input v-model="dataForm.paramKey" placeholder="证据名称"></el-input>
      </el-form-item>
      <el-form-item prop="" label="证据描述：">
        <el-input
          type="textarea"
          v-model="dataForm.paramKey"
          placeholder="证据描述"
        ></el-input>
      </el-form-item>
      <el-form-item prop="" label="附件列表：">
        <el-table
          :data="fileTableList"
          border
          v-loading="tableLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
          >
          </el-table-column>
          <el-table-column
            prop="roleNumber"
            header-align="center"
            align="center"
            label="附件名称"
          >
          </el-table-column>
        </el-table>
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
      },
      fileTableList:[]
    };
  }
};
</script>
