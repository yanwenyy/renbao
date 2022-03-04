<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="80px">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="dataForm.ruleName" placeholder="规则名称"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="createPerson">
        <el-input v-model="dataForm.createPerson" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="结束时间" prop="sql">
        <el-input v-model="dataForm.sql" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="错误描述" prop="createTime">
        <el-input type="textarea" v-model="dataForm.createTime" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="close">关闭</el-button>
  </div>
</template>
<script>
export default {
  name: "detail",
  data() {
    return {
      dataForm: {
        ruleName: "",
        ruleType: "",
        createPerson: "",
        sql: "",
        createTime: ""
      },
      ruleType: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ]
    };
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/user/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          username: this.dataForm.userName
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    //关闭弹窗
    close() {
      this.$emit("close");
    }
  }
};
</script>
