<template>
  <div class="box">
    <div class="auditRuleMonitoring-left">
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
    </div>
    <div class="auditRuleMonitoring-right">
      <div class="search-box">
        <el-form ref="searchForm" :model="searchForm" :inline="true">
          <el-form-item label="规则类型：">
            <el-select
              v-model="searchForm.ruleCategory"
              placeholder="请选择"
              clearable
            >
              <el-option label="门诊规则" :value="1"></el-option>
              <el-option label="住院规则" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运行状态：">
            <el-select
              v-model="searchForm.runStatus"
              placeholder="请选择"
              clearable
            >
              <el-option label="待执行" :value="1"></el-option>
              <el-option label="执行中" :value="2"></el-option>
              <el-option label="执行失败" :value="3"></el-option>
              <el-option label="已完成" :value="4"></el-option>
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
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column
            v-for="(items, index) in tablePositionKey"
            :prop="items.dataname"
            :key="index"
            :label="items.label"
            :sortable="items.issortable"
            :min-width="items.minWidth"
            :align="items.align ? items.align : 'center'"
            :width="items.width"
          >
            <template slot-scope="scope">
              <div v-if="items.type == 'option'">
                <div class="operation-box">
                  <!-- <span @click="publish(scope.row)">发表</span> -->
                  <el-button
                    type="text"
                    class="result-view-text"
                    @click="resultViewClick(scope.row)"
                    v-if="scope.row.q5 == 1"
                    >查看日志</el-button
                  >
                  <span v-else>运行成功</span>
                </div>
              </div>
              <div v-else>
                <span
                  :style="scope.row[items.dataname] == '0' ? 'color:#ccc' : ''"
                >
                  {{ scope.row[items.dataname] }}
                </span>
              </div>
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
    </div>
    <!--查看详细弹窗 -->
    <el-dialog
      :visible.sync="showDetailDialog"
      title="监控报告详情"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="40%"
      :close-on-press-escape="false"
    >
      <detail @close="closeDetail" :id="id" v-if="showDetailDialog"></detail>
    </el-dialog>
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
      tableData: [],
      tablePositionKey: [
        {
          dataname: "ruleName",
          label: "规则名称",
          issortable: false,
          type: ""
        },
        {
          dataname: "ruleType",
          label: "规则类别",
          issortable: false,
          type: ""
        },
        {
          dataname: "expectedBeginTime",
          label: "预计开始时间",
          issortable: false,
          type: ""
        },
        {
          dataname: "actualBeginTime",
          label: "实际开始时间",
          issortable: false,
          type: ""
        },
        {
          dataname: "expectedEndTime",
          label: "预计结束时间",
          issortable: false,
          type: ""
        },
        {
          dataname: "actualEndTime",
          label: "实际结束时间",
          issortable: false,
          type: ""
        },
        {
          dataname: "runStatusName",
          label: "运行状态",
          issortable: false,
          type: ""
        },
        { dataname: "q5", label: "操作", issortable: false, type: "option" }
      ],
      Pager: {
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      batchType: "",
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
    dealRunStatus(type) {
      if (type == 1) {
        return "待执行";
      } else if (type == 2) {
        return "执行中";
      } else if (type == 3) {
        return "执行失败";
      } else if (type == 4) {
        return "已完成";
      }
    },
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
            batchType: 1
          },
          false
        )
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code == 200) {
            data.result.records.map(i => {
              i.ruleName = i.rule.ruleName;
              i.ruleType =
                i.rule.ruleType == 1
                  ? "门诊审核规则"
                  : i.ruleCategory == 2
                  ? "住院审核规则"
                  : "";
              i.expectedBeginTime =
                (i.expectedBeginTime && i.expectedBeginTime.split("T")[0]) ||
                "";
              i.actualBeginTime =
                (i.actualBeginTime && i.actualBeginTime.split("T")[0]) || "";
              i.expectedEndTime =
                (i.expectedEndTime && i.expectedEndTime.split("T")[0]) || "";
              i.actualEndTime =
                (i.actualEndTime && i.actualEndTime.split("T")[0]) || "";
              i.runStatusName = this.dealRunStatus(i.runStatus);
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
    onQuery() {},
    // 列表重置
    onReset() {
      this.searchForm = {
        ruleCategory: "",
        runStatus: ""
      };
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
      // alert(JSON.stringify(data))
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
