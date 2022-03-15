<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="80px">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input
          v-model="dataForm.ruleName"
          readonly
          placeholder="规则名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="规则类别" prop="ruleCategory">
        <el-input
          readonly
          v-model="dataForm.ruleCategory"
          placeholder="规则类别"
        ></el-input>
      </el-form-item>
      <el-form-item label="规则分类" prop="folderId">
        <el-tree
          v-show="false"
          class="rule-tree"
          :data="ruleData"
          :props="menuListTreeProps"
          node-key="folderId"
          ref="menuListTree"
          @current-change="menuListTreeCurrentChangeHandle"
          :default-expand-all="false"
          :highlight-current="true"
          :expand-on-click-node="false"
        >
        </el-tree>
        <el-input
          v-popover:menuListPopover
          v-model="dataForm.parentName"
          :readonly="true"
          placeholder="点击选择上级菜单"
          class="menu-list__input"
        ></el-input>
      </el-form-item>
      <el-form-item label="sql编辑" prop="ruleSqlValue">
        <el-input
          type="textarea"
          readonly
          :autosize="{ minRows: 10, maxRows: 10 }"
          v-model="dataForm.ruleSqlValue"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="createUserName">
        <el-input
          readonly
          v-model="dataForm.createUserName"
          placeholder="创建人"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input
          readonly
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
  props: {
    ruleId: { type: String }
  },
  name: "detail",
  data() {
    return {
      dataForm: {
        ruleName: "",
        ruleCategory: "",
        createUserName: "",
        ruleSqlValue: "",
        createTime: "",
        parentName: "",
        folderId: "",
        folderPath: ""
      },
      ruleData: [],
      menuListTreeProps: {
        label: "folderName",
        children: "children"
      },
      treeVisible: false,
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
    this.initTree();
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
          // this.dataForm.ruleCategory = rule.ruleCategory;
          if (rule.ruleCategory == 1) {
            this.dataForm.ruleCategory = "门诊规则";
          } else {
            this.dataForm.ruleCategory = "住院规则";
          }
          this.dataForm.createUserName = rule.createUserName;
          this.dataForm.ruleSqlValue = rule.ruleSqlValue;
          this.dataForm.createTime = rule.createTime;
          this.dataForm.folderId = rule.folderId;
          this.dataForm.folderPath = rule.folderPath;
          this.loading = false;
          this.menuListTreeSetCurrentNode();
        }
      });
    },
    initTree() {
      this.$http({
        url: this.$http.adornUrl("/ruleFolder/getRuleFolder"),
        method: "get",
        params: this.$http.adornParams({ folderSorts: "1,2" })
      }).then(({ data }) => {
        this.ruleData = data.result;
      });
    },
    //关闭弹窗
    close() {
      this.$emit("close");
    },
    //sql编辑弹窗
    sqlEditor() {
      // this.showSqlEditorDialog = true;
    },
    //sql编辑弹窗确认
    submitSql() {
      this.showSqlEditorDialog = false;
      this.dataForm.ruleSqlValue = this.submitForm.sql;
    },
    // 规则树选中
    menuListTreeCurrentChangeHandle(data, node) {
      /*   console.log(data.folderId);
      this.dataForm.folderId = data.folderId;
      this.dataForm.parentName = data.folderName;
      this.dataForm.folderPath = this.getParentByNode(node);
      this.treeVisible = false; */
    },
    /* getParentByNode(node) {
      const checkedNodes = [];
      const traverse = function(node) {
        if (node.parent.data.folderId) {
          checkedNodes.push(node.parent.data.folderId);
          traverse(node.parent);
        }
      };
      traverse(node);
      return checkedNodes.join("/");
    }, */
    // 规则树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.folderId);
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})["folderName"];
    }
  }
};
</script>
