<template>
  <div class="box">
    <div class="left">
      <el-card v-loading="treeLoading" :style="{height:(tableHeight+120)+'px'}">
        <div class="auditRuleMonitoring-left">
          <batch-list
            :batchLoading="treeLoading"
            :batchTreeList="batchTreeList"
            @getbatchData="getbatchData"
            v-on:refreshBitchData="getbatchList"
            :isParent="false"
          ></batch-list>
        </div>
      </el-card>
    </div>
    <div style="width:100%">
      <el-card :style="{height:(tableHeight+120)+'px'}">
        <div class="search-box">
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item label="规则名称：">
              <el-input
                v-model="searchForm.ruleName"
                size="small"
                placeholder="规则名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="规则类型：">
              <el-select
                v-model="searchForm.ruleCategory"
                placeholder="规则类型"
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
                placeholder="运行状态"
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
            <el-button type="primary" @click="onQuery">查询</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-button
              style="float:right"
              @click="deleteData"
              type="danger"
              :disabled="this.multipleTable.length <= 0"
              >删除</el-button
            >
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
            :height="tableHeight - 80"
            :row-key="getRowKeys"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55"
            ></el-table-column>
            <el-table-column prop="ruleName" label="规则名称"></el-table-column>
            <el-table-column prop="ruleCategory" label="规则类别">
              <template slot-scope="scope">
                <div v-if="scope.row.ruleCategory == 1">门诊规则</div>
                <div v-if="scope.row.ruleCategory == 2">住院规则</div>
              </template>
            </el-table-column>
            <el-table-column prop="expectedBeginTime" label="预计开始时间">
              <template slot-scope="scope">{{
                scope.row.expectedBeginTime
              }}</template>
            </el-table-column>
            <el-table-column prop="actualBeginTime" label="实际开始时间">
              <template slot-scope="scope">{{
                scope.row.actualBeginTime
              }}</template>
            </el-table-column>
            <el-table-column prop="expectedEndTime" label="预计结束时间">
              <template slot-scope="scope">{{
                scope.row.expectedEndTime
              }}</template>
            </el-table-column>
            <el-table-column prop="actualEndTime" label="实际结束时间">
              <template slot-scope="scope">{{
                scope.row.actualEndTime
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
                  >结果查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
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
            :name="name"
            v-if="showDetailDialog"
          ></detail>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>
<script>
import detail from "./component/ruleMoniter-detail.vue";
import batchList from "../../common/batch-list.vue";
export default {
  components: {
    detail,
    batchList
  },
  data() {
    return {
      //详情弹窗是否显示
      showDetailDialog: false,
      //树loading
      treeLoading: false,
      //列表loading
      tableLoading: false,
      //左侧批次树数据
      batchTreeList: [
        {
          label: "批次名称",
          children: []
        }
      ],
      //详情弹窗id传值
      id: "",
      //条件查询
      searchForm: {
        ruleName: "",
        ruleCategory: "",
        runStatus: ""
      },
      //规则类别
      ruleCategory: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ],
      //运行状态
      runStatus: [
        { id: 1, name: "待执行" },
        { id: 2, name: "执行中" },
        { id: 3, name: "执行失败" },
        { id: 4, name: "已完成" }
      ],
      //列表数据
      tableData: [],
      //分页
      Pager: {
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      //批次类型
      batchType: 1,
      //多选数据
      multipleTable: [],
      //批次id
      batchId: "",
      //
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__ || data;
          return config.label || config.batchName;
        }
      }
    };
  },
  computed:{
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
  },
  activated() {
    this.getbatchList();
  },
  created() {
    this.getTableData();
  },
  methods: {
    //获取列表数据
    getTableData() {
      this.tableLoading = true;
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/ruleResult/selectPageByRuleResult"),
        method: "get",
        params: this.$http.adornParams(
          {
            batchId: this.batchId,
            ruleName: this.searchForm.ruleName,
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
    //获取左侧批次树数据
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
    //删除
    deleteData() {
      var uuids = [];
      for (var i = 0; i < this.multipleTable.length; i++) {
        uuids.push(this.multipleTable[i].resultId);
      }
      this.$confirm(`确定进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/ruleResult/deleteByIds"),
            method: "delete",
            data: this.$http.adornData(uuids, false)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.initData();
                }
              });
            } else {
              this.$message.error("操作失败");
            }
          });
        })
        .catch(() => {});
    },
    //左点右显
    getbatchData(data, node) {
      this.batchId = data.batchId;
      this.clearChcked();
      this.getTableData();
    },
    // 列表查询
    onQuery() {
      this.Pager.pageIndex = 1;
      this.getTableData();
    },
    // 列表重置
    onReset() {
      this.searchForm = {
        ruleCategory: "",
        runStatus: ""
      };
      this.Pager.pageIndex = 1;
      this.clearChcked();
      this.getTableData();
    },
    //清除已选
    clearChcked() {
      this.$refs.multipleTable.clearSelection(this.multipleTable);
      this.multipleTable = [];
    },
    //分页
    currentChangeHandle(val) {
      this.Pager.pageIndex = val;
      this.getTableData();
    },
    //多选
    handleSelectionChange(val) {
      this.multipleTable = val;
    },
    //分页
    sizeChangeHandle(val) {
      this.Pager.pageSize = val;
      this.getTableData();
    },
    //日志查看
    resultViewClick(data) {
      this.showDetailDialog = true;
      this.id = data.resultId;
      this.name = data.ruleName;
    },
    //关闭日志弹窗
    closeDetail() {
      this.showDetailDialog = false;
    },
    //获取每行数据id
    getRowKeys(row) {
      // return row.ruleId;
    },
    deleteData() {
      console.log("删除");
      var uuids = [];
      for (var i = 0; i < this.multipleTable.length; i++) {
        uuids.push(this.multipleTable[i].resultId);
      }
      this.$confirm(`确定进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/ruleResult/deleteByIds"),
            method: "delete",
            data: this.$http.adornData(uuids, false)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getTableData();
                }
              });
            } else {
              this.$message.error("操作失败");
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped lang="scss">
.box {
  width: 100%;
  // display: flex;
  min-width: 800px;
  // overflow-x: auto;
  .auditRuleMonitoring-left {
    width: 300px;
    height: 100%;
    // min-height: 100vh;
    /*min-height: calc(100vh - 165px);*/
    // margin-right: 20px;
    // border: 1px solid #ddd;
    /*overflow: auto;*/
    min-width: 300px;
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
.left {
  width: 300px;
  float: left;
  margin-right: 10px;
  overflow: auto;
  .el-card{
    overflow: auto;
  }
}
.result-view-text {
  color: #0cbde5;
  cursor: pointer;
}
</style>
