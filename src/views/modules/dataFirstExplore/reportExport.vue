<!--结果明细导出-->
<template>
  <div class="box">
    <div class="left">
      <el-card style="height:80vh;overflow-y:auto">
        <div
          class="auditRuleMonitoring-left"
          style="width:100%;overflow-y:auto"
        >
          <batch-list
            :batchLoading="treeLoading"
            :batchTreeList="batchTreeList"
            @getbatchData="getbatchData"
            v-on:refreshBitchData="initTree"
            :isParent="false"
          ></batch-list>
        </div>
      </el-card>
    </div>
    <div style="width:100%">
      <el-card style="height:80vh;overflow-y:auto">
        <el-form ref="dataForm" :model="dataForm" :inline="true">
          <el-form-item label="运行状态：">
            <el-select
              v-model="dataForm.batchResultExportStatus"
              placeholder="运行状态"
              clearable
            >
              <el-option
                v-for="(item, index) in batchResultExportStatus"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getAllSearch()" type="primary">查询</el-button>
            <el-button @click="reset()">重置</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button @click="toReport()" type="warning">生成报告</el-button>
            <el-button @click="reportExport()" type="warning"
              >导出报告</el-button
            >
          </el-form-item>
        </el-form>
        <div>
          <el-table
            :data="tableData"
            border
            ref="tableData"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            style="width: 100%"
            :height="$tableHeight - 80"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="ruleName" label="规则名称"></el-table-column>
            <el-table-column prop="batchResultExportBeginTime" label="开始时间">
            </el-table-column>
            <el-table-column prop="batchResultExportEndTime" label="结束时间">
            </el-table-column>
            <el-table-column prop="batchResultExportStatus" label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.batchResultExportStatus == 1">待执行</div>
                <div v-if="scope.row.batchResultExportStatus == 2">执行中</div>
                <div v-if="scope.row.batchResultExportStatus == 3">
                  执行失败
                </div>
                <div v-if="scope.row.batchResultExportStatus == 4">已完成</div>
              </template>
            </el-table-column>
            <!--  <el-table-column prop="moblie" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="detailHandle(scope.row)"
                  >查看明细</el-button
                >
              </template>
            </el-table-column> -->
          </el-table>
          <div>
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
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import batchList from "../../common/batch-list.vue";
import { exportZip } from "@/utils";
export default {
  components: {
    batchList,
    exportZip
  },
  data() {
    return {
      //条件查询
      dataForm: {
        batchResultExportStatus: "",
        total: ""
      },
      batchTreeList: [
        {
          label: "批次名称",
          children: []
        }
      ],
      //运行状态
      batchResultExportStatus: [
        { id: 1, name: "待执行" },
        { id: 2, name: "执行中" },
        { id: 3, name: "执行失败" },
        { id: 4, name: "已完成" }
      ],
      //loading
      treeLoading: false,
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__ || data;
          return config.label || config.batchName;
        }
      },
      ruleCategory: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableData: [],
      multipleSelection: [],
      loading: false,
      treeLoading: false,
      formLoading: false,
      rows: [],
      batchId: "",
      batchName: "",
      batchType: 1,
      Pager: {
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }
    };
  },
  activated() {
    this.initTree();
  },
  created() {
    this.initData();
  },
  methods: {
    //初始化列表数据
    initData() {
      this.loading = true;
      this.$http({
        url: this.$http.adornUrl("batchResultExport/selectPage"),
        method: "get",
        params: this.$http.adornParams({
          batchId: this.batchId,
          batchResultExportStatus: this.dataForm.batchResultExportStatus,
          pageNo: this.Pager.pageIndex,
          pageSize: this.Pager.pageSize
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableData = data.result.records;
          this.Pager.total = data.result.total;
          this.dataForm.total = data.result.total;
          this.loading = false;
        } else {
          this.tableData = [];
          this.Pager.total = 0;
          this.dataForm.total = 0;
          this.loading = false;
        }
      });
    },
    //初始化批次树数据
    initTree() {
      this.treeLoading = true;
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("batch/selectBatchSuccessful"),
        method: "get"
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
    //生成报告
    toReport() {
      if (this.batchId == "" || this.batchId == null) {
        this.$message.warning("请先选择批次");
      }
      this.$http({
        url: this.$http.adornUrl("batchResultExport/generateBatchReport"),
        method: "post",
        data: this.$http.adornData({
          batchId: this.batchId,
          batchName: this.batchName,
          batchType: 1
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message.success("生成报告成功");
          this.initData();
        } else {
          this.$message.error("生成报告失败");
        }
      });
    },
    //导出报告
    reportExport() {
      if (this.batchId == "" || this.batchId == null) {
        this.$message.warning("请先选择批次");
      } else {
        let url =
          this.$http.adornUrl(
            "/batchResultExport/download?dataId=" + this.batchId + "&token="
          ) + this.$cookie.get("token");
        window.open(url);
      }
    },
    // 关闭详细弹窗
    closeDetail() {
      this.showDetailDialog = false;
    },
    // 关闭弹窗确认
    editSucceed() {
      this.closeDetail();
    },
    //列表多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //重置表单
    resetForm(formName) {
      this.submitData = {};
      this.$refs[formName].resetFields();
    },
    //分页
    sizeChangeHandle(val) {
      this.Pager.pageSize = val;
      this.initData();
    },
    //分页
    currentChangeHandle(val) {
      this.Pager.pageIndex = val;
      this.initData();
    },
    //查询
    getAllSearch() {
      this.Pager.pageIndex = 1;
      this.initData();
    },
    //重置搜索
    reset() {
      this.dataForm = {
        ruleName: "",
        ruleCategory: ""
      };
      this.Pager.pageIndex = 1;
      this.initData();
    },
    //左点右显
    getbatchData(data, node) {
      this.batchId = data.batchId;
      this.batchName = data.batchName;
      this.initData();
    },

    //关闭结果明细导出弹窗
    closeExport() {
      this.detailExportDialog = false;
    },

    //重置已选
    reSet() {
      this.dataForm1 = {
        hospId: [],
        hospName: [],
        batchId: ""
      };
      this.checked = false;
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
    // min-height: 100vh;
    min-height: calc(100vh - 165px);
    // margin-right: 20px;
    // border: 1px solid #ddd;
    // overflow: auto;
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
  height: 80vh;
}
</style>
