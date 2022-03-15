<!--结果明细导出-->
<template>
  <div class="box">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card v-loading="treeLoading" style="height:800px;overflow-y:auto">
          <div class="auditRuleMonitoring-left" style="height:800px">
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
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="box-card" style="height:800px;overflow-y:auto">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="4">
                <div class="search-operation">
                  <el-input
                    v-model="dataForm.ruleName"
                    size="small"
                    placeholder="规则名称"
                    clearable
                  ></el-input>
                </div>
              </el-col>
              <el-col :span="4" style="margin-left:10px">
                <div class="search-operation">
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
                </div>
              </el-col>
              <el-col :span="4" style="margin-left:10px">
                <el-button @click="getAllSearch()" type="primary"
                  >查询</el-button
                >
                <el-button @click="reset()">重置</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="content">
            <div class="tableTitle">
              <span
                >查询结果<span style="color:#E6A23C">{{ dataForm.total }}</span
                >条</span
              >
              <div style="float:right;margin-bottom:10px">
                <el-button @click="detailExport" type="warning"
                  >结果明细导出</el-button
                >
                <el-button
                  @click="deleteData"
                  type="danger"
                  :disabled="this.multipleSelection.length <= 0"
                  >删除</el-button
                >
              </div>
            </div>
            <el-table
              :data="tableData"
              border
              ref="tableData"
              @selection-change="handleSelectionChange"
              v-loading="loading"
              style="width: 100%;margin-top: 20px"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column
                prop="ruleName"
                label="规则名称"
              ></el-table-column>
              <el-table-column prop="rule.ruleCategory" label="规则类别">
                <template slot-scope="scope">
                  <div v-if="scope.row.ruleCategory == 1">门诊规则</div>
                  <div v-if="scope.row.ruleCategory == 2">住院规则</div>
                </template>
              </el-table-column>
              <el-table-column prop="actualBeginTime" label="开始时间">
                <template slot-scope="scope">{{
                  scope.row.actualBeginTime | dateformat
                }}</template>
              </el-table-column>
              <el-table-column prop="actualEndTime" label="结束时间">
                <template slot-scope="scope">{{
                  scope.row.actualEndTime | dateformat
                }}</template>
              </el-table-column>
              <el-table-column prop="resultCount" label="结果条数">
              </el-table-column>
              <el-table-column prop="createUserName" label="执行人">
              </el-table-column>
              <el-table-column prop="moblie" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="detailHandle(scope.row)"
                    >查看明细</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="pager">
              <el-pagination
                small
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="totalPage"
              ></el-pagination>
            </div>
          </div>
          <!--查看详细弹窗 -->
          <el-dialog
            :visible.sync="showDetailDialog"
            title="查看结果明细"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="90%"
            :close-on-press-escape="false"
          >
            <detail
              @close="closeDetail"
              @ok="editSucceed"
              :info="info"
              :resultTableName="resultTableName"
              v-if="showDetailDialog"
            ></detail>
          </el-dialog>
          <!--结果明细导出弹窗 -->
          <el-dialog
            :visible.sync="detailExportDialog"
            title="结果明细导出"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="30%"
            :close-on-press-escape="false"
            v-if="detailExportDialog"
          >
            <el-form
              :model="dataForm1"
              ref="dataForm1"
              label-width="120px"
              :rules="rules"
            >
              <el-form-item prop="hospital" label="请选择医院：">
                <el-select
                  v-model="dataForm1.hospital"
                  filterable
                  clearable
                  placeholder="请选择医院"
                  multiple
                >
                  <el-option
                    v-for="item in hospitals"
                    :key="item['医院编码']"
                    :label="item['医院名称']"
                    :value="item['医院编码']"
                  >
                  </el-option>
                </el-select>
                <el-button type="primary" @click="exportExcel()"
                  >导出</el-button
                >
              </el-form-item>
            </el-form>
            <el-button @click="closeExport">取消</el-button>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import detail from "./component/detailExport-detail.vue";
export default {
  components: {
    detail
  },
  data() {
    return {
      dataForm: {
        ruleName: "",
        ruleCategory: ""
      },
      dataForm1: {
        batchId: "",
        hospital: ""
      },
      rules: {
        hospital: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      batchTreeList: [
        {
          label: "批次名称",
          children: []
        }
      ],
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
      //查看规则详细弹窗是否显示
      showDetailDialog: false,
      //新增、修改弹窗是否显示
      detailExportDialog: false,
      //立即运行、定时运行弹窗是否显示
      showRunDialog: false,
      rows: [],
      info: "",
      batchId: "",
      batchType: 1,
      hospitals: [],
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0
    };
  },
  created() {
    this.initData();
    this.initTree();
    this.initHospital();
  },
  methods: {
    //初始化列表数据
    initData() {
      this.loading = true;
      this.$http({
        url: this.$http.adornUrl("/ruleResult/selectPageByRuleResult"),
        method: "get",
        params: this.$http.adornParams({
          batchId: this.batchId,
          ruleCategory: this.dataForm.ruleCategory, //规则类别;1:门诊规则,2:住院规则
          ruleName: this.dataForm.ruleName,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          batchType: this.batchType
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableData = data.result.records;
          this.totalPage = data.result.total;
          this.dataForm.total = data.result.total;
          this.loading = false;
        } else {
          this.dataForm.total = 0;
          this.tableData = [];
          this.totalPage = 0;
          this.loading = false;
        }
      });
    },
    //初始化批次树数据
    initTree() {
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
    //选择医院下拉列表数据
    initHospital() {
      this.$http({
        url: this.$http.adornUrl("/hospitalBasicInfo/getPageList"),
        method: "get",
        params: this.$http.adornParams(
          {
            pageCount: "1",
            pageSize: "10000"
          },
          false
        )
      })
        .then(({ data }) => {
          if (data.code == 200) {
            this.hospitals = data.result.records;
          }
        })
        .catch(() => {});
    },
    //结果明细导出弹窗
    detailExport() {
      if (this.batchId == "" || this.batchId == null) {
        this.$message.error("请先选择批次");
      } else {
        this.dataForm1.hospital = [];
        this.detailExportDialog = true;
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
    // 关闭新增弹窗
    closeAddDrawer() {
      this.showAddDialog = false;
    },
    // 保存新增
    addSucceed() {
      this.showAddDialog = false;
      this.initData();
    },
    //列表多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除
    deleteData() {
      /* var uuids = "";
      for (var i = 0; i < this.multipleSelection.length; i++) {
        uuids += this.multipleSelection[i].resultId + ",";
      }
      if (uuids.length > 0) {
        var uuids = uuids.substring(0, uuids.length - 1);
      } */
      var uuids = [];
      for (var i = 0; i < this.multipleSelection.length; i++) {
        uuids.push(this.multipleSelection[i].resultId);
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
    //查看结果明细
    detailHandle(data) {
      this.info = data.resultId;
      this.resultTableName = data.resultTableName;
      this.showDetailDialog = true;
    },
    //重置表单
    resetForm(formName) {
      this.submitData = {};
      this.$refs[formName].resetFields();
    },
    //分页
    handleSizeChange(val) {
      this.dataForm.pageSize = val;
      this.initData();
    },
    //分页
    handleCurrentChange(val) {
      this.dataForm.pageNum = val;
      this.initData();
    },
    //查询
    getAllSearch() {
      // this.batchId = "";
      this.initData();
    },
    //重置搜索
    reset() {
      this.dataForm = {
        ruleName: "",
        ruleCategory: ""
      };
      this.initData();
    },
    //左点右显
    nodeClick(node, data) {
      this.batchId = data.batchId;
      this.initData();
    },
    //结果明细导出
    exportExcel() {
      this.dataForm1.batchId = this.batchId;
      /* var arr = [];
      var hospitalCodes = [];
      var hospitalNames = [];
      for (var i = 0; i < this.dataForm1.hospital.length; i++) {
        arr.push(this.dataForm1.hospital[i].split("|"));
      }
      for (var j = 0; j < arr.length; j++) {
        hospitalCodes.push(arr[j][0]);
        hospitalNames.push(arr[j][1]);
      } */
      // console.log(hospitalCodes);
      // console.log(hospitalNames);
      console.log(this.dataForm1);
      this.$http({
        url: this.$http.adornUrl("ruleResult/exportResult"),
        method: "post",
        responseType: "blob", //解决乱码问题
        data: this.$http.adornData(this.dataForm1, false)
      }).then(({ data }) => {
        const blob = new Blob([data]);
        let fileName = "结果明细.xls";
        if ("download" in document.createElement("a")) {
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob); // 创建下载的链接
          document.body.appendChild(elink);
          elink.click(); // 点击下载
          URL.revokeObjectURL(elink.href); // 释放掉blob对象
          document.body.removeChild(elink); // 下载完成移除元素
        } else {
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    //关闭结果明细导出弹窗
    closeExport() {
      this.detailExportDialog = false;
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
