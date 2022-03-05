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
      <el-form-item label="选择分类" prop="folderId">
        <el-select
          v-model="dataForm.folderId"
          filterable
          clearable
          placeholder="选择分类"
          size="small"
        >
          <el-option
            v-for="(item, index) in folderId"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建人" prop="createUserName">
        <el-input disabled
          v-model="dataForm.createUserName"
          placeholder="创建人"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="sql语句" prop="sql">
        <el-input v-model="dataForm.sql" placeholder="备注"></el-input>
      </el-form-item> -->
      <el-form-item label="创建时间" prop="createTime">
        <el-input disabled v-model="dataForm.createTime" placeholder="创建时间"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submit('dataForm')">保存</el-button>
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
        folderId: "",
        createUserName: "",
        // sql: "",
        createTime: ""
      },
      ruleCategory: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ],
      folderId: [
        { id: 1, name: "医保" },
        { id: 2, name: "医院" }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 获取数据
    init() {
      if (
        this.ruleId != null &&
        this.ruleId != "" &&
        this.ruleId != undefined
      ) {
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
            console.log(data)
            var rule = data.result;
            this.dataForm.ruleName = rule.ruleName;
            this.dataForm.ruleCategory = rule.ruleCategory;
            this.dataForm.createUserName = rule.createUserName;
            this.dataForm.sql = rule.sql;
            this.dataForm.createTime = rule.createTime;
          }
        });
      }
    },
    //保存
    submit(data) {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/rule/${!this.id ? "add" : "updateByUuId"}`
            ),
            method: "post",
            data: this.$http.adornData({
              ruleId: this.ruleId || undefined,
              ruleName: this.dataForm.ruleName,
              ruleCategory: this.dataForm.ruleCategory,
              folderId: this.dataForm.folderId,
              createUserName: this.dataForm.createUserName,
              //   sql: this.dataForm.sql,
              createTime: this.dataForm.createTime
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
              this.$message.error("操作失败");
            }
          });
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
