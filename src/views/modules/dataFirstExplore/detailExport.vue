<!--结果明细导出-->
<template>
  <div class="box">
    <div class="left">
      <el-card :style="{height:(tableHeight+120)+'px'}">
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
      <el-card :style="{height:(tableHeight+120)+'px'}">
        <el-form ref="dataForm" :model="dataForm" :inline="true">
          <el-form-item label="规则名称：">
            <el-input
              v-model="dataForm.ruleName"
              size="small"
              placeholder="规则名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="规则类别：">
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
          </el-form-item>
          <el-form-item>
            <el-button @click="getAllSearch()" type="primary">查询</el-button>
            <el-button @click="reset()">重置</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button @click="detailExport()" type="warning"
              >结果明细导出</el-button
            >
            <el-button
              @click="deleteData"
              type="danger"
              :disabled="this.multipleSelection.length <= 0"
              >删除</el-button
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
            :height="tableHeight - 80"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="ruleName" label="规则名称"></el-table-column>
            <el-table-column prop="rule.ruleCategory" label="规则类别">
              <template slot-scope="scope">
                <div v-if="scope.row.ruleCategory == 1">门诊规则</div>
                <div v-if="scope.row.ruleCategory == 2">住院规则</div>
              </template>
            </el-table-column>
            <el-table-column prop="actualBeginTime" label="开始时间">
              <template slot-scope="scope">{{
                scope.row.actualBeginTime
              }}</template>
            </el-table-column>
            <el-table-column prop="actualEndTime" label="结束时间">
              <template slot-scope="scope">{{
                scope.row.actualEndTime
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
            style="height:100px;overflow-y:auto"
            :model="dataForm1"
            ref="dataForm1"
            label-width="120px"
            :rules="rules"
          >
            <el-form-item prop="hospId" label="请选择医院：">
              <el-select
                v-model="dataForm1.hospId"
                filterable
                clearable
                placeholder="请选择医院"
                multiple
                @change="val => checkChange(val)"
              >
                <el-option
                  v-for="item in hospitals"
                  :key="item.hospitalCode"
                  :label="item.hospitalName"
                  :value="item.hospitalCode"
                >
                </el-option>
              </el-select>
              <el-checkbox v-model="checked" @change="selectAll"
                >全选</el-checkbox
              >
            </el-form-item>
          </el-form>
          <div align="center">
            <el-button type="primary" @click="exportExcel('dataForm1')"
              >导出</el-button
            >
            <el-button @click="closeExport">取消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>
<script>
import detail from "./component/detailExport-detail.vue";
import { exportZip } from "@/utils";
import batchList from "../../common/batch-list.vue";
export default {
  components: {
    detail,
    exportZip,
    batchList
  },
  data() {
    return {
      //条件查询
      dataForm: {
        ruleName: "",
        ruleCategory: "",
        total: ""
      },
      //医院数据
      dataForm1: {
        batchId: "",
        hospId: [],
        hospName: []
      },
      //必填校验
      rules: {
        hospitalCode: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      batchTreeList: [
        {
          label: "批次名称",
          children: []
        }
      ],
      //全选状态
      checked: false,
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
      Pager: {
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }
    };
  },
  computed:{
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
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
        url: this.$http.adornUrl("/ruleResult/selectPageByRuleResult"),
        method: "get",
        params: this.$http.adornParams({
          batchId: this.batchId,
          ruleCategory: this.dataForm.ruleCategory, //规则类别;1:门诊规则,2:住院规则
          ruleName: this.dataForm.ruleName,
          pageNo: this.Pager.pageIndex,
          pageSize: this.Pager.pageSize,
          batchType: this.batchType
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
        url: this.$http.adornUrl("batch/getHospitals"),
        method: "get",
        params: this.$http.adornParams(
          {
            batchId: this.batchId
            // pageCount: "1",
            // pageSize: "10000"
          },
          false
        )
      })
        .then(({ data }) => {
          if (data.code == 200) {
            this.hospitals = data.result;
          }
        })
        .catch(() => {});
    },
    //结果明细导出弹窗
    detailExport() {
      if (this.batchId == "" || this.batchId == null) {
        this.$message.warning("请先选择批次");
      } else {
        this.dataForm1.hospId = [];
        this.dataForm1.hospName = [];
        this.checked = false;
        this.initHospital();
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
      this.initData();
    },
    //结果明细导出
    exportExcel(formName) {
      this.dataForm1.batchId = this.batchId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$http
            .post(
              this.$http.adornUrl("/ruleResult/exportResult"),
              this.dataForm1,
              {
                responseType: "blob",
                headers: {
                  "Content-Type": "application/json; application/octet-stream"
                }
              }
            )
            .then(response => {
              exportZip(response, "结果明细");
              this.loading = false;
              this.$message({
                // message: data.message,
                message: "导出成功",
                type: "success",
                duration: 1500
              });
              this.detailExportDialog = false;
            });
          this.reSet();
        }
      });
    },
    //关闭结果明细导出弹窗
    closeExport() {
      this.detailExportDialog = false;
    },
    //选择数据
    checkChange(val) {
      this.dataForm1.hospName = [];
      // 判断是否为全选状态
      if (val.length == this.hospitals.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
      for (let i = 0; i <= val.length - 1; i++) {
        this.hospitals.find(item => {
          //这里的options就是数据源
          if (item.hospitalCode == val[i]) {
            this.dataForm1.hospName.push(item.hospitalName);
          }
        });
      }
    },
    //医院全选
    selectAll() {
      this.dataForm1.hospId = [];
      this.dataForm1.hospName = [];
      if (this.checked) {
        this.hospitals.map(i => {
          this.dataForm1.hospId.push(i.hospitalCode);
          this.dataForm1.hospName.push(i.hospitalName);
        });
      } else {
        this.dataForm1.hospId = [];
        this.dataForm1.hospName = [];
      }
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
