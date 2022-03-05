<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="80px">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="dataForm.ruleName" placeholder="规则名称"></el-input>
      </el-form-item>
      <el-form-item label="规则类别" prop="ruleCategory">
        <el-select
          v-model="dataForm.ruleCategory"
          filterable
          clearable
          placeholder="规则类别"
          size="small"
        >
          <el-option
            v-for="(item, index) in ruleCategory"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建人" prop="createUserName">
        <el-input
          v-model="dataForm.createUserName"
          placeholder="创建人"
        ></el-input>
      </el-form-item>
      <el-form-item label="sql语句" prop="ruleSqlValue">
        <el-input v-model="dataForm.ruleSqlValue"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input
          v-model="dataForm.createTime"
          placeholder="创建时间"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="close">关闭</el-button>
  </div>
</template>
<script>
export default {
  props: { ruleId: { type: String } },
  name: "detail",
  data() {
    return {
      dataForm: {
        ruleName: "",
        ruleCategory: "",
        createUserName: "",
        ruleSqlValue: "",
        createTime: ""
      },
      ruleCategory: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 获取数据
    init() {
      this.$http({
        url: this.$http.adornUrl(`/rule/selectByUuid/${this.ruleId}`),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          batchType: 1
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          var rule = data.result;
          this.dataForm.ruleName = rule.ruleName;
          this.dataForm.ruleCategory = rule.ruleCategory;
          this.dataForm.createUserName = rule.createUserName;
          this.dataForm.ruleSqlValue = rule.ruleSqlValue;
          this.dataForm.createTime = new Date(rule.createTime);
          this.loading = false;
        }
      });
    },
    //关闭弹窗
    close() {
      this.$emit("close");
    }
  }
};
</script>
