<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="80px">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input
          v-model="dataForm.ruleName"
          disabled
          placeholder="规则名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="规则类别" prop="ruleCategory">
        <el-select
          v-model="dataForm.ruleCategory"
          filterable
          clearable
          placeholder="规则类别"
          size="small"
          disabled
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
          disabled
          v-model="dataForm.createUserName"
          placeholder="创建人"
        ></el-input>
      </el-form-item>
      <el-form-item prop="ruleSqlValue">
        <el-button
          type="text"
          @click="sqlEditor"
          style="position: absolute;left: -60px;"
          >sql编辑</el-button
        >
        <el-input
          type="textarea"
          disabled
          :autosize="{ minRows: 10, maxRows: 10 }"
          v-model="dataForm.ruleSqlValue"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input
          disabled
          v-model="dataForm.createTime"
          placeholder="创建时间"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="close">取消</el-button>
    <!-- sql编辑弹窗 -->
    <el-dialog
      title="sql编辑"
      :visible.sync="showSqlEditorDialog"
      width="50%"
      append-to-body
    >
      <el-form :model="submitForm" class="export">
        <el-form-item>
          <el-input
            v-model="submitForm.sql"
            type="textarea"
            :autosize="{ minRows: 20, maxRows: 20 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSql">确定</el-button>
        <el-button @click="showSqlEditorDialog = false">取消</el-button>
      </div>
    </el-dialog>
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
      submitForm: {
        sql: ""
      },
      ruleCategory: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ],
      showSqlEditorDialog: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 获取数据
    init() {
      this.$http({
        url: this.$http.adornUrl(`/rule/selectByUuid/${this.ruleId}`),
        method: "get",
        params: this.$http.adornParams(
          {
            page: this.pageIndex,
            limit: this.pageSize,
            batchType: 1
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 200) {
          var rule = data.result;
          this.dataForm.ruleName = rule.ruleName;
          this.dataForm.ruleCategory = rule.ruleCategory;
          this.dataForm.createUserName = rule.createUserName;
          this.dataForm.ruleSqlValue = rule.ruleSqlValue;
          this.dataForm.createTime = rule.createTime;
          this.loading = false;
        }
      });
    },
    //关闭弹窗
    close() {
      this.$emit("close");
    },
    //sql编辑弹窗
    sqlEditor() {
      this.showSqlEditorDialog = true;
    },
    //sql编辑弹窗确认
    submitSql() {
      this.showSqlEditorDialog = false;
      this.dataForm.ruleSqlValue = this.submitForm.sql;
    }
  }
};
</script>
