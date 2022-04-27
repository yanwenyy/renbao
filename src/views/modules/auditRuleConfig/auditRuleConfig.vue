<template>
  <div>
    <div class="left">
      <el-card :style="{ height: tableHeight + 100 + 'px' }">
        <rule-tree
          ref="ruleTree"
          :isShowSearch="true"
          :isShowCheckBox="false"
          :isShowEdit="true"
          @getTreeId="getTreeId"
          :isParent="false"
          :folderSorts="folderSorts"
          :projectId="projectId"
        ></rule-tree>
      </el-card>
    </div>
    <div style="width:100%">
      <el-card :style="{ height: tableHeight + 100 + 'px' }">
        <el-form
          ref="searchForm"
          :model="searchForm"
          :inline="true"
          class="search-form-new"
        >
          <el-form-item label="审核规则名称：">
            <el-input
              v-model="searchForm.ruleName"
              clearable
              placeholder="审核规则名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="审核规则类别：">
            <el-select
              v-model="searchForm.ruleCategory"
              placeholder="请选择"
              clearable
            >
              <el-option label="门诊规则" value="1"></el-option>
              <el-option label="住院规则" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryClick">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="addFun">新增</el-button>
            <el-button
              type="primary"
              class="search-right-btn"
              @click="submitgxhgz"
              :disabled="
                this.multipleTable.length == 0 || this.multipleTable.length > 1
              "
            >提交至地区个性化规则</el-button
            >

            <!--<el-button-->
            <!--type="primary"-->
            <!--@click="editorFun(0)"-->
            <!--:disabled="this.multipleTable <= 0"-->
            <!--&gt;编辑</el-button-->
            <!--&gt;-->
            <el-button
              type="danger"
              @click="deleteFn(0)"
              :disabled="this.multipleTable.length <= 0"
            >
              删除</el-button
            >
          </el-form-item>
        </el-form>
        <div>
          <el-table
            v-loading="tableLoading"
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            :height="tableHeight - 150"
          >
            <el-table-column
              type="selection"
              width="55"
              :reserve-selection="true"
            ></el-table-column>
            <el-table-column
              type="index"
              header-align="center"
              align="center"
              width="80"
              label="序号"
              :index="indexMethod"
            >
            </el-table-column>
            <el-table-column
              prop="ruleName"
              label="审核规则名称"
              align="center"
              min-width="120px"
            >
              <template slot-scope="scope">
                <el-button
                  :title="scope.row.ruleName"
                  class="show-ellipsis"
                  type="text"
                  @click="editorFun(scope.row.ruleId, 'look')"
                  >{{ scope.row.ruleName }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="avgRunTime"
              header-align="center"
              align="center"
              label="平均运行时间"
              min-width="160"
            >
            </el-table-column>
            <el-table-column
              prop="createTime"
              header-align="center"
              align="center"
              label="创建时间"
              min-width="160"
            >
            </el-table-column>
            <el-table-column
              prop="createUserName"
              header-align="center"
              align="center"
              label="创建人"
            >
            </el-table-column>
            <el-table-column
              prop="ruleCategory"
              header-align="center"
              align="center"
              label="规则类别"
            >
              <!--   <template slot-scope="scope">
                {{
                  scope.row.ruleCategory == "1"
                    ? "门诊规则"
                    : scope.row.ruleCategory == "2"
                    ? "住院规则"
                    : ""
                }}
              </template> -->
            </el-table-column>
            <el-table-column prop="mobile" label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="editorFun(scope.row.ruleId)"
                  >修改
                </el-button>
                <!--  <el-button
                  type="text"
                  @click="editorFun(scope.row.ruleId, 'look')"
                  >查看
                </el-button> -->
                <el-button type="text" @click="deleteFn(scope.row.ruleId)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <div style="float:left;margin-top:10px">
              <el-button-group>
                <el-button
                  >当前选择规则数量：{{ multipleTable.length }}</el-button
                >
                <el-button
                  :disabled="this.multipleTable.length <= 0"
                  @click="executeImmediatelyClick"
                  >立即运行</el-button
                >
                <el-button
                  :disabled="this.multipleTable.length <= 0"
                  @click="timedExecutionClick"
                  >定时运行</el-button
                >
                <el-popover
                  placement="top"
                  width="400"
                  v-if="multipleTable.length > 0"
                  trigger="click"
                >
                  <div style="max-height:300px;overflow-y:auto">
                    <p v-for="(i, k) in multipleTable" :key="k">
                      {{ i.ruleName }}
                    </p>
                  </div>
                  <el-button slot="reference">当前所选规则</el-button>
                </el-popover>
                <el-button v-else>当前所选规则</el-button>
              </el-button-group>
            </div>
          </el-row>

          <el-row>
            <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="Pager.pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="Pager.pageSize"
              :total="Pager.total"
              layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
          </el-row>
        </div>
      </el-card>
    </div>

    <submit-personality-rule
      ref="submitPersonalityRule"
    ></submit-personality-rule>
    <rule-operation ref="ruleOperation"></rule-operation>
    <rule-config-option-dialog
      ref="ruleConfigDialog"
    ></rule-config-option-dialog>
    <add-or-update
      ref="addOrUpdate"
      @refreshDataList="getSelectPage"
      :ruleData="treeData"
    ></add-or-update>
  </div>
</template>
<script>
import submitPersonalityRule from "./submit-personality-rule.vue"; // 提交至地区个性化规则弹框
import ruleOperation from "./rule-operation.vue"; // 规则运行弹框
import ruleTree from "../../common/rule-tree.vue";
import ruleConfigOptionDialog from "./rule-config-option-dialog.vue";
import AddOrUpdate from "../../modules/data/rule-add-or-update.vue";
export default {
  data() {
    return {
      treeLoading: false,
      tableLoading: false,
      searchForm: {
        ruleName: "",
        ruleCategory: "",
        folderPath: "",
        folderId: ""
      },
      tableData: [],
      Pager: {
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      multipleTable: [],
      // copyTableData: [],
      getRowKeys(row) {
        return row.ruleId;
      },
      treeData: [],
      folderSorts: '',
      ruleCheckData: {}
    };
  },
  activated() {
    // this.getSelectPage();
    // this.getRuleFolder();
    // this.getRuleFolder();
  },
  created() {
    // this.getRuleFolder();
  },
  mounted() {
    // this.$bus.$on("updateRuleData", () => {
    //   this.getRuleFolder();
    // });
  },
  methods: {
    // 序号翻页递增
    indexMethod(index) {
      // console.log("索引数下标", index);
      let nowPage = this.Pager.pageIndex; //当前第几页，根据组件取值即可
      let nowLimit = this.Pager.pageSize; //当前每页显示几条，根据组件取值即可
      return index + 1 + (nowPage - 1) * nowLimit; // 这里可以理解成一个公式
    },
    getSelectPage() {
      this.treeData=this.$refs.ruleTree.treeData;
      // 判断不选左侧规则节点列表为空
      if (!this.ruleCheckData.folderId) {
        this.$message({ message: "请选择对应的规则分类", type: "warning" });
        return;
      }
      this.tableLoading = true;
      // 如何改规则节点有子节点的话folderId为空
      if (this.ruleCheckData.children) {
        this.searchForm.folderId = "";
      }
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl(
          `/rule/selectPage?pageNo=${this.Pager.pageIndex}&pageSize=${this.Pager.pageSize}`
        ),
        method: "get",
        params: this.$http.adornParams(this.searchForm, false)
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code == 200) {
            data.result.records.map(i => {
              i.createTime = i.createTime;
              i.ruleCategory =
                i.ruleCategory == 1
                  ? "门诊规则"
                  : i.ruleCategory == 2
                  ? "住院规则"
                  : "";
            });
            this.tableData = data.result.records;
            this.Pager.pageSize = data.result.size;
            this.Pager.pageIndex = data.result.current;
            this.Pager.total = data.result.total;
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 获取规则树
    getRuleFolder() {
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/ruleFolder/getRuleFolder"),
        method: "get",
        params: this.$http.adornParams(
          { folderSorts: this.folderSorts, projectId: this.projectId },
          false
        )
        // params:  this.$http.adornParams({}, false)
      })
        .then(({ data }) => {
          if (data.code == 200) {
            this.treeData = data.result;
          }
        })
        .catch(() => {});
    },
    getTreeId(data) {
      if (data && data.folderId) {
        this.ruleCheckData = data;
        this.$refs.multipleTable.clearSelection(this.multipleTable);
        this.multipleTable = [];
        this.searchForm.folderPath = (data.folderPath && data.folderPath) || "";
        this.searchForm.folderId = (data.folderId && data.folderId) || "";
        this.getSelectPage();
      } else {
        this.ruleCheckData = {};
        this.$refs.multipleTable.clearSelection(this.multipleTable);
        this.multipleTable = [];
        this.searchForm.folderPath = "";
        this.searchForm.folderId = "";
        // this.getSelectPage();
      }
    },
    queryClick() {
      this.Pager.pageIndex = 1;
      this.getSelectPage();
    },
    onReset() {
      this.searchForm.ruleName = "";
      this.searchForm.ruleCategory = "";
      this.Pager.pageIndex = 1;
      this.getSelectPage();
      // 调用规则树的重置方法
      // this.searchForm.folderPath = '';
      // this.searchForm.folderId = '';
    },
    //新增
    addFun() {
      if(this.projectId==''||this.projectId==null||this.projectId==undefined){
        this.$message.error("请先在右上角选择项目!");
        return false;
      }
      // this.$refs.ruleConfigDialog.showDialog([], this.treeData, 'add');
      this.$refs.addOrUpdate.init("", this.ruleCheckData);
    },
    //修改
    editorFun(data, type) {
      if (data == 0) {
        // this.$refs.ruleConfigDialog.showDialog(this.multipleTable, this.treeData, 'edit');
        this.$refs.addOrUpdate.init(
          this.multipleTable[0].ruleId,
          this.ruleCheckData
        );
      } else {
        this.$refs.addOrUpdate.init(data, this.ruleCheckData, type);
      }
    },
    //删除
    deleteFn(data) {
      var deleteList = [];
      if (data == 0) {
        this.multipleTable.forEach(item => {
          deleteList.push(item.ruleId);
        });
      } else {
        deleteList.push(data);
      }
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            isLoading: false,
            url: this.$http.adornUrl("/rule/deleteByIds"),
            method: "DELETE",
            data: this.$http.adornData(deleteList, false)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({ message: "删除成功", type: "success" });
              this.Pager.pageIndex = 1;
              this.Pager.pageSize = 10;
              this.getSelectPage();
              this.setTableChecked();
              // this.multipleTable = []
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    handleSelectionChange(rows) {
      this.multipleTable = rows;
    },
    setTableChecked() {
      this.multipleTable = [];
      this.$refs.multipleTable.clearSelection(this.multipleTable);
    },
    sizeChangeHandle(val) {
      this.Pager.pageSize = val;
      this.getSelectPage();
    },

    currentChangeHandle(val) {
      this.Pager.pageIndex = val;
      this.getSelectPage();
    },
    // 提交个性化规则
    submitgxhgz() {
      /*  if (this.multipleTable.length != 1)
        return this.$message({
          message: "请选择一条数据进行操作",
          type: "warning"
        }); */
      this.$refs.submitPersonalityRule.showDialog(this.multipleTable);
    },
    // 立即执行
    executeImmediatelyClick() {
      if(this.projectId==''||this.projectId==null||this.projectId==undefined){
        this.$message.error("请先在右上角选择项目!");
        return false;
      }
      if (this.multipleTable.length === 0)
        return this.$message({
          message: "请选择至少一条数据",
          type: "warning"
        });

      var ruleSql = [];
      for (var i = 0; i < this.multipleTable.length; i++) {
        if (this.multipleTable[i].ruleSqlValue != null) {
          ruleSql.push({
            sql: this.multipleTable[i].ruleSqlValue,
            ruleId: this.multipleTable[i].ruleId
          });
        }
      }
      if (ruleSql.length === 0) {
        this.$message.error("选择的规则下没有sql，无法运行");
      } else {
        this.$refs.ruleOperation.showDialog(ruleSql, "immediately");
      }
    },
    // 定时执行
    timedExecutionClick() {
      if(this.projectId==''||this.projectId==null||this.projectId==undefined){
        this.$message.error("请先在右上角选择项目!");
        return false;
      }
      if (this.multipleTable.length === 0)
        return this.$message({
          message: "请选择至少一条数据",
          type: "warning"
        });

      var ruleSql = [];
      for (var i = 0; i < this.multipleTable.length; i++) {
        if (this.multipleTable[i].ruleSqlValue != null) {
          ruleSql.push({
            sql: this.multipleTable[i].ruleSqlValue,
            ruleId: this.multipleTable[i].ruleId
          });
        }
      }
      if (ruleSql.length === 0) {
        this.$message.error("选择的规则下没有sql，无法运行");
      } else {
        this.$refs.ruleOperation.showDialog(ruleSql, "timing");
      }
    }
  },
  computed: {
    projectId: {
      get() {
        if (this.$store.state.common.projectId) {
          return this.$store.state.common.projectId;
        } else {
          this.$http({
            url: this.$http.adornUrl("/xmProject/selectProjectByUserId"),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 200) {
              return data.result && data.result.projectId && data.result.projectId || '';
            }
          });
        }
      }
    },
    tableHeight: {
      get() {
        return this.$store.state.common.tableHeight;
      }
    }
  },
  components: {
    submitPersonalityRule,
    ruleOperation,
    ruleTree,
    ruleConfigOptionDialog,
    AddOrUpdate
  },
  watch: {
    projectId(nval, oval) {
      if (nval) {
        this.getRuleFolder();
        this.getTreeData();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.box {
  width: 100%;
  display: flex;
  min-width: 800px;
  // overflow-x: auto;
  .auditRuleConfig-left {
    width: 300px;
    // min-height: 100vh;
    // min-height: calc(100vh - 165px);
    // margin-right: 20px;
    height: 75vh;
    border: 1px solid #ddd;
    overflow: auto;
    min-width: 300px;
    padding: 10px 0 0 10px;
    /deep/ .el-tree {
      min-height: 60vh;
    }
  }
  .auditRuleConfig-right {
    flex: 1;
    border: none;
    height: 75vh;
    overflow: auto;
    //
    .search-box {
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
      padding-left: 20px;
      // padding-right: 109px;
    }
    .search-right-btn {
      // display: flex;
      width: 183px;
      // align-self: flex-end;
    }
    .rule-table {
      padding: 20px 20px 0 20px;
    }
    .content {
      margin-top: 10px;
    }
  }
}
.left {
  width: 300px;
  float: left;
  margin-right: 10px;
  .el-card {
    overflow: auto;
  }
}
</style>
