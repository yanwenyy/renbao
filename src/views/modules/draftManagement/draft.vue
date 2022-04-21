<!--底稿管理-->
<template>
  <div class="box">
    <div class="auditRuleConfig-left" :style="{height:(tableHeight+100)+'px'}">
      <rule-tree
        ref="ruleTree"
        :isShowSearch="true"
        :isShowCheckBox="false"
        :isShowEdit="true"
        :folderSorts="folderSorts"
        @getTreeId="getTreeId"
        :isParent="false"
      ></rule-tree>
    </div>
    <div class="auditRuleConfig-right" :style="{height:(tableHeight+100)+'px'}">
      <div class="search-box">
        <el-form ref="searchForm" :model="searchForm" :inline="true" class="search-form-new">
          <el-form-item label="规则名称：">
            <el-input
              v-model="searchForm.ruleName"
              placeholder="规则名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人：">
            <el-input
              v-model="searchForm.createUserName"
              clearable
              placeholder="创建人"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryClick">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
          <el-button
            style="float:right"
            type="primary"
            :disabled="
              this.multipleTable.length <= 0 || this.multipleTable.length > 1
            "
            @click="editData"
            >编写底稿</el-button
          >
        </el-form>
      </div>
      <div class="rule-table">
        <div class="table-box">
          <el-table
            :data="tableData"
            border
            v-loading="tableLoading"
            @selection-change="handleSelectionChange"
            style="width: 100%;"
            ref="multipleTable"
            :height="tableHeight - 80"
          >
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50"
            >
            </el-table-column>
            <el-table-column
              prop="ruleName"
              header-align="center"
              align="center"
              label="规则名称"
              min-width="130"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="detail(scope.row)" class="show-ellipsis" :title="scope.row.ruleName">{{
                  scope.row.ruleName
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="manuscriptCode"
              header-align="center"
              align="center"
              label="底稿编号"
            >
            </el-table-column>
            <el-table-column
              prop="manuscriptName"
              header-align="center"
              align="center"
              label="底稿名称"
            >
            </el-table-column>
            <el-table-column
              prop="createTime"
              header-align="center"
              align="center"
              label="创建时间"
              min-width="130"
            >
            </el-table-column>
            <el-table-column
              prop="createUserName"
              header-align="center"
              align="center"
              label="创建人"
            >
            </el-table-column>
            <!--<el-table-column-->
              <!--prop="ruleType"-->
              <!--header-align="center"-->
              <!--align="center"-->
              <!--label="规则类型"-->
            <!--&gt;-->
              <!--<template slot-scope="scope">-->
                <!--{{-->
                  <!--scope.row.ruleType == "1"-->
                    <!--? "sql编辑器"-->
                    <!--: scope.row.ruleType == "2"-->
                    <!--? "图形化"-->
                    <!--: ""-->
                <!--}}-->
              <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>
        <div class="auditRuleConfig-right-bottom">
          <el-pagination
            v-if="Pager.total >= 1"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="Pager.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="Pager.pageSize"
            :total="Pager.total"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
          <!-- 编写底稿弹窗 -->
          <el-dialog
            :visible.sync="showEditDialog"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="40%"
            :close-on-press-escape="false"
            :title="title"
          >
            <editDraft
              @close="closeAddDrawer"
              @ok="addSucceed"
              v-if="showEditDialog"
              :data="data"
              :readonly="readonly"
            ></editDraft>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import editDraft from "./editDraft.vue"; // 编写底稿弹框
import ruleTree from "../../common/rule-tree.vue"; //左侧规则树
export default {
  components: {
    editDraft,
    ruleTree
  },
  data() {
    return {
      tableLoading: false,
      searchForm: {
        ruleName: "",
        createUserName: "",
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
      treeData: [],
      folderSorts: "3",
      ruleCheckData: {},
      showEditDialog: false,
      dataListLoading: false,
      title: "",
      readonly: false,
      data: ""
    };
  },
  activated() {
    this.getRuleFolder();
  },
  mounted() {
    this.$bus.$on("updateRuleData", () => {
      this.getRuleFolder();
    });
  },
  methods: {
    getSelectPage() {
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
          `/manuscript/selectPageByManuscript?pageNo=${this.Pager.pageIndex}&pageSize=${this.Pager.pageSize}`
          // `/rule/selectPage?pageNo=${this.Pager.pageIndex}&pageSize=${this.Pager.pageSize}`
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
    //查询
    queryClick() {
      this.Pager.pageIndex = 1;
      this.getSelectPage();
    },
    //重置
    onReset() {
      this.searchForm.ruleName='';
      this.searchForm.createUserName='';
      this.Pager.pageIndex = 1;
      this.getSelectPage();
      // 调用规则树的重置方法
      // this.$refs.ruleTree.clearCheckedKeys();
      // this.searchForm.folderPath = '';
      // this.searchForm.folderId = '';
    },
    //编写底稿弹窗
    editData() {
      this.title = "编写底稿";
      this.showEditDialog = true;
      this.data = this.multipleTable[0];
      this.readonly = false;
    },
    //查看底稿弹窗
    detail(data) {
      this.title = "查看底稿";
      this.showEditDialog = true;
      this.data = data;
      this.readonly = true;
    },
    deleteFn() {
      if (this.multipleTable.length === 0)
        return this.$message({
          message: "请选择至少一条数据",
          type: "warning"
        });
      var deleteList = [];
      this.multipleTable.forEach(item => {
        deleteList.push(item.ruleId);
      });
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
              this.multipleTable = [];
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
    closeAddDrawer() {
      this.showEditDialog = false;
    },
    addSucceed() {
      this.closeAddDrawer();
    }
  },
  computed: {
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
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
              return data.result.projectId;
            }
          });
        }
      }
    }
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
    /*height: 75vh;*/
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
    /*height: 75vh;*/
    overflow: auto;
    //
    .search-box {
      display: flex;
      flex-direction: column;
      // border-bottom: 1px solid #ddd;
      // padding-bottom: 20px;
      padding-left: 20px;
      // padding-right: 109px;
    }
    .search-right-btn {
      // display: flex;
      width: 183px;
      // align-self: flex-end;
    }
    .rule-table {
      padding: 0px 0px 0 20px;
    }
    .table-box {
      margin-top: 10px;
    }
    .optipn {
      margin-top: 20px;
      /deep/ button {
        height: 50px;
        // line-height: 45px;
      }
    }
  }
}
</style>
