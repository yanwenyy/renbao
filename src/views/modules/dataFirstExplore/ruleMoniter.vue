<template>
  <div class="box">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card v-loading="treeLoading" style="height:800px;overflow-y:auto">
          <!-- <div class="auditRuleMonitoring-left" style="height:800px"> -->
          <el-tree
            :data="batchTreeList"
            highlight-current
            :default-expand-all="true"
            v-loading="treeLoading"
            node-key="id"
            ref="treesa"
            :props="layoutTreeProps"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              @click="nodeClick(node, data)"
            >
              <span>
                {{ node.label }}
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <!-- </div> -->
      <el-col :span="19">
        <!-- <div class="auditRuleMonitoring-right"> -->
        <el-card class="box-card" style="height:800px">
          <div class="search-box">
            <el-form ref="searchForm" :model="searchForm" :inline="true">
              <el-form-item label="规则类型：">
                <el-select
                  v-model="searchForm.ruleCategory"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in ruleCategory"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运行状态：">
                <el-select
                  v-model="searchForm.runStatus"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in runStatus"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onQuery">查询</el-button>
                <el-button type="info" @click="onReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="table-box">
            <el-table
              v-loading="tableLoading"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
              <el-table-column
                prop="ruleName"
                label="规则名称"
              ></el-table-column>
              <el-table-column prop="ruleCategory" label="规则类别">
                <template slot-scope="scope">
                  <div v-if="scope.row.ruleCategory == 1">门诊规则</div>
                  <div v-if="scope.row.ruleCategory == 2">住院规则</div>
                </template>
              </el-table-column>
              <el-table-column prop="expectedBeginTime" label="预计开始时间">
                <template slot-scope="scope">{{
                  scope.row.expectedBeginTime | dateformat
                }}</template>
              </el-table-column>
              <el-table-column prop="actualBeginTime" label="实际开始时间">
                <template slot-scope="scope">{{
                  scope.row.actualBeginTime | dateformat
                }}</template>
              </el-table-column>
              <el-table-column prop="expectedEndTime" label="预计结束时间">
                <template slot-scope="scope">{{
                  scope.row.expectedEndTime | dateformat
                }}</template>
              </el-table-column>
              <el-table-column prop="actualEndTime" label="实际结束时间">
                <template slot-scope="scope">{{
                  scope.row.actualEndTime | dateformat
                }}</template>
              </el-table-column>
              <el-table-column prop="runStatus" label="运行状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.runStatus == 1">待执行</div>
                  <div v-if="scope.row.runStatus == 2">执行中</div>
                  <div v-if="scope.row.runStatus == 3">执行失败</div>
                  <div v-if="scope.row.runStatus == 4">已完成</div>
                </template>
              </el-table-column>
              <el-table-column prop="moblie" label="操作">
                <template slot-scope="scope">
                  <div v-if="scope.row.runStatus == 4">运行成功</div>
                  <el-button
                    type="text"
                    v-if="scope.row.runStatus == 3"
                    @click="resultViewClick(scope.row)"
                    >查看日志</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
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
          <!-- </div> -->
          <!--查看详细弹窗 -->
          <el-dialog
            :visible.sync="showDetailDialog"
            title="监控报告详情"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="40%"
            :close-on-press-escape="false"
          >
            <detail
              @close="closeDetail"
              :id="id"
              v-if="showDetailDialog"
            ></detail>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import detail from "./component/ruleMoniter-detail.vue";
export default {
  components: {
    detail
  },
  data() {
    return {
      showDetailDialog: false,
      treeLoading: false,
      tableLoading: false,
      batchTreeList: [
        {
          label: "批次名称",
          children: []
        }
      ],
      id: "",
      searchForm: {
        ruleCategory: "",
        runStatus: ""
      },
      ruleCategory: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ],
      runStatus: [
        { id: 1, name: "待执行" },
        { id: 2, name: "执行中" },
        { id: 3, name: "执行失败" },
        { id: 4, name: "已完成" }
      ],
      tableData: [],
      Pager: {
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      batchType: 1,
      multipleTable: [],
      batchId: "",
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__ || data;
          return config.label || config.batchName;
        }
      }
    };
  },
  created() {
    this.getbatchList();
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.tableLoading = true;
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/ruleResult/selectPageByRuleResult"),
        method: "get",
        params: this.$http.adornParams(
          {
            batchId: this.batchId,
            runStatus: this.searchForm.runStatus, // 运行状态
            ruleCategory: this.searchForm.ruleCategory,
            pageNo: this.Pager.pageIndex,
            pageSize: this.Pager.pageSize,
            batchType: this.batchType
          },
          false
        )
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code == 200) {
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
    getbatchList() {
      this.treeLoading = true;
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/batch/selectList"),
        method: "get",
        params: this.$http.adornParams(
          {
            batchType: 1
          },
          false
        )
      })
        .then(({ data }) => {
          this.treeLoading = false;
          if (data.code == 200) {
            this.batchTreeList[0].children = data.result;
          }
        })
        .catch(() => {
          this.treeLoading = false;
        });
    },
    //左点右显
    nodeClick(node, data) {
      this.batchId = data.batchId;
      this.getTableData();
    },
    // 列表查询
    onQuery() {
      this.batchId = "";
      this.getTableData();
    },
    // 列表重置
    onReset() {
      this.searchForm = {
        ruleCategory: "",
        runStatus: ""
      };
      this.batchId = "";
      this.getTableData();
    },
    currentChangeHandle(val) {
      this.Pager.pageIndex = val;
    },
    handleSelectionChange(val) {
      this.multipleTable = val;
    },
    sizeChangeHandle(val) {
      this.Pager.pageSize = val;
    },
    // 日志查看
    resultViewClick(data) {
      this.showDetailDialog = true;
      this.id = data.resultId;
    },
    //关闭日志弹窗
    closeDetail() {
      this.showDetailDialog = false;
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
  .auditRuleMonitoring-left {
    width: 300px;
    // min-height: 100vh;
    min-height: calc(100vh - 165px);
    // margin-right: 20px;
    border: 1px solid #ddd;
    overflow: auto;
    min-width: 300px;
    /deep/ .el-tree-node__children .custom-tree-node {
      text-decoration: underline;
      color: #0000ff;
      width: 100%;
    }
  }
  .auditRuleMonitoring-right {
    flex: 1;
    border: none;
    // padding-left: 20px;
    //
    .search-box {
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
      padding-left: 20px;
      // padding-right: 109px;
    }
    .table-box {
      margin-top: 10px;
      // padding-left: 20px;
      .result-view-text {
        color: #0cbde5;
      }
    }
  }
}
</style>
