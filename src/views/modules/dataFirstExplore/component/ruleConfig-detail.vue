<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="80px">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="dataForm.ruleName" placeholder="规则名称"></el-input>
      </el-form-item>
      <el-form-item label="规则类别" prop="ruleType">
        <el-select
          v-model="dataForm.ruleType"
          filterable
          clearable
          placeholder="规则类别"
          size="small"
          @change="getProjectId"
        >
          <el-option
            v-for="(item, index) in ruleType"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建人" prop="createPerson">
        <el-input v-model="dataForm.createPerson" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="sql语句" prop="sql">
        <el-input v-model="dataForm.sql" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="备注"></el-input>
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
