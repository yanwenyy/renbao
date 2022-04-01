<!--结果明细导出-->
<template>
  <div class="box">
    <div class="left">
      <el-card :style="{ height: tableHeight + 120 + 'px' }">
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
      <el-card :style="{ height: tableHeight + 120 + 'px' }">
        <el-form ref="dataForm" :model="dataForm" :inline="true">
          <el-form-item label="规则名称：">
            <el-input
              v-model="dataForm.ruleName"
              placeholder="规则名称"
              clearable
            ></el-input>
          </el-form-item>
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
            v-loading="loading"
            style="width: 100%"
            :height="tableHeight - 30"
          >
            <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
            <el-table-column prop="ruleName" label="规则名称"></el-table-column>
            <el-table-column prop="batchResultExportBeginTime" label="开始时间">
            </el-table-column>
            <el-table-column prop="batchResultExportEndTime" label="结束时间">
            </el-table-column>
            <el-table-column prop="batchResultExportStatus" label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.batchResultExportStatus == 1">待执行</div>
                <div v-if="scope.row.batchResultExportStatus == null">
                  待执行
                </div>
                <div v-if="scope.row.batchResultExportStatus == 2">执行中</div>
                <div v-if="scope.row.batchResultExportStatus == 3">
                  已完成
                </div>
                <el-button
                  type="text"
                  @click="detailHandle(scope.row)"
                  v-if="scope.row.batchResultExportStatus == 4"
                >
                  执行失败
                </el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="moblie" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.row.batchResultExportStatus == 4"
                  @click="detailHandle(scope.row)"
                  >查看错误信息</el-button
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
    <!-- 查看错误信息弹窗 -->
    <el-dialog
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="30%"
      :close-on-press-escape="false"
      title="查看错误信息"
    >
      <el-form>
        <el-form-item prop="errorLog">
          <el-input type="textarea" readonly="" v-model="errorLog"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
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
        ruleName: "",
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
        { id: 3, name: "已完成" },
        { id: 4, name: "执行失败" }
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
      },
      showDialog: false,
      errorLog: ""
    };
  },
  computed: {
    tableHeight: {
      get() {
        return this.$store.state.common.tableHeight;
      }
    }
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
      // this.loading = true;
      this.$http({
        url: this.$http.adornUrl("batchResultExport/selectPage"),
        method: "get",
        params: this.$http.adornParams({
          batchId: this.batchId,
          ruleName: this.dataForm.ruleName,
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
          // this.loading = false;
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
      } else {
        this.$http({
          url: this.$http.adornUrl("batchResultExport/generateBatchReport"),
          method: "post",
          isLoading: false,
          data: this.$http.adornData({
            batchId: this.batchId,
            batchName: this.batchName,
            batchType: 1
          })
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.initData();
            let success = false;
            for (var i in this.tableData) {
              if (this.tableData[i].batchResultExportStatus == 3) {
                success = true;
                break;
              }
            }
            if (success == true) {
              this.$message.success("生成报告成功");
            } else {
              this.$message.error("生成报告失败");
            }
          } else {
            this.$message.error("生成报告失败");
            this.initData();
          }
        });
      }
    },
    //导出报告
    reportExport() {
      if (this.batchId == "" || this.batchId == null) {
        this.$message.warning("请先选择批次");
      } else {
        if (this.tableData == [] || this.tableData.length == 0) {
          this.$message.error("请先生成报告");
        } else {
          var status = [];
          this.tableData.forEach(item => {
            status.push(item.batchResultExportStatus);
          });
          //判断报告是否生成
          var isExport = true;
          for (var i in status) {
            if (status[i] == null || status[i] == 1) {
              isExport = false;
              break;
            }
          }
          if (isExport == false) {
            this.$message.error("请先生成报告");
            isExport = "";
          } else {
            //判断是否有执行中的报告
            var isDoing = true;
            for (var i in status) {
              if (status[i] == 2) {
                isDoing = false;
                break;
              }
            }
            if (isDoing == false) {
              this.$message.error("有正在执行中的报告，请稍后再导出！");
              isDoing = "";
            } else {
              var failNum = [];
              for (var i in status) {
                if (status[i] == 4) {
                  failNum.push(status[i]);
                }
              }
              if (failNum.length == status.length) {
                this.$message.error("全部执行失败时，请勿导出！");
              } else {
                let url =
                  this.$http.adornUrl(
                    "/batchResultExport/download?dataId=" +
                      this.batchId +
                      "&token="
                  ) + this.$cookie.get("token");
                window.open(url);
              }
            }
          }
        }
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
    /*  handleSelectionChange(val) {
      this.multipleSelection = val;
    }, */
    //重置表单
    resetForm(formName) {
      this.submitData = {};
      this.$refs[formName].resetFields();
      this.initData();
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
    },
    //查看错误信息
    detailHandle(data) {
      this.showDialog = true;
      this.errorLog = data.errorLog;
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
  .el-card {
    overflow: auto;
  }
}
</style>
