<template>
  <div>
    <!-- <div class="left">
      <el-card :style="{height:(tableHeight+100)+'px'}">
        <batch-list
          :batchLoading="batchLoading"
          :batchTreeList="batchTreeList"
          parentGetTreeData="getbatchData"
          v-on:refreshBitchData="getbatchList"
        ></batch-list>
      </el-card>
    </div> -->
    <el-dialog      
      custom-class="rule-dialog"
      width="80%"
      :title="'执行监控'"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
    <div style="width:100%">
      <el-card :style="{height:(tableHeight+100)+'px'}">
        <div class="search-box">
          <el-form ref="searchForm" :model="searchForm" :inline="true" class="search-form-new">
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
              <el-button @click="onReset">重置</el-button>
            </el-form-item>
            <el-form-item style="float:right">
                <el-button @click="visible = false">关闭</el-button>
              <!-- <el-button
                type="danger"
                @click="deleteFn"
                :disabled="this.multipleTable.length <= 0"
                >反馈</el-button
              > -->
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
            :height="tableHeight - 85"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
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
                    <span
                      class="result-view-text"
                      @click="resultViewClick(scope.row)"
                      v-if="scope.row.option == 3"
                      >结果查看</span
                    >
                    <span
                      v-else-if="scope.row.option == 2 || scope.row.option == 1"
                    ></span>
                    <span v-else-if="scope.row.option == 4">运行成功</span>
                  </div>
                </div>
                <div v-else-if="items.dataname == 'ruleName'" :title="scope.row.ruleName" class="show-ellipsis">
                 {{scope.row.ruleName}}
                </div>

                <div v-else>
                  <span>{{ scope.row[items.dataname] }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="Pager.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="Pager.pageSize"
          :total="Pager.total"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination> -->
      </el-card>
    </div>
    </el-dialog>
    <result-view ref="resultView"></result-view>
  </div>
</template>
<script>
import resultView from "./result-view.vue";
import batchList from "../../common/batch-list.vue";
export default {
    name: "SubmitFeed",
    props: {
        ruleId: ""
    },
  data() {
    return {
        visible: false,
      //batchLoading: false,
      tableLoading: false,
    //   batchTreeList: [
    //     {
    //       label: "批次名称",
    //       children: []
    //     }
    //   ],
      searchForm: {
        ruleCategory: "",
        runStatus: ""
      },
      tableData: [],
      tablePositionKey: [
        {
          dataname: "ruleName",
          label: "审核规则名称",
          issortable: false,
          type: "",
          minWidth: 140
        },
        {
          dataname: "dealRuleType",
          label: "审核规则类别",
          issortable: false,
          type: "",
          minWidth: 110
        },
        {
          dataname: "expectedBeginTime",
          label: "预计开始时间",
          issortable: false,
          type: "",
          minWidth: 160
        },
        {
          dataname: "actualBeginTime",
          label: "实际开始时间",
          issortable: false,
          type: "",
          minWidth: 160
        },
        {
          dataname: "expectedEndTime",
          label: "预计结束时间",
          issortable: false,
          type: "",
          minWidth: 160
        },
        {
          dataname: "actualEndTime",
          label: "实际结束时间",
          issortable: false,
          type: "",
          minWidth: 160
        },
        {
          dataname: "resultCount",
          label: "结果条数",
          issortable: false,
          type: "",
          minWidth: 120
        },
        {
          dataname: "runStatusName",
          label: "运行状态",
          issortable: false,
          type: ""
        },
        { dataname: "option", label: "操作", issortable: false, type: "option" }
      ],
      Pager: {
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      multipleTable: [],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__ || data;
          return config.label || config.batchName;
        }
      },
      batchItem: {},
      demandCollaborationId: ""
    };
  },
  computed:{
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
  },
  activated() {
    //this.getbatchList();
    //this.getTableData();
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
    dealRuleType(ruleCategory) {
      if (ruleCategory == 1) {
        return "门诊规则";
      } else if (ruleCategory == 2) {
        return "住院规则";
      } else {
        return "";
      }
    },
    //清除信息
      // clearMsg(){
      //   this.dataForm={
      //     project:{
      //       projectId: 0,
      //       projectCode: '',
      //       projectName: '',
      //       dataTime: [],
      //       auditedUnit: '',
      //       projectRemark: '',
      //       projectPeriodBegin: '',
      //       projectPeriodEnd: '',
      //     },
      //     projectCosts:[],
      //     xmProjectGroupUsers:[],
      //     xmProjectRoleUsers:[]
      //   };
      //   this.dataFormCopy={
      //     project:{},
      //     projectCosts:[],
      //     xmProjectGroupUsers:[],
      //     xmProjectRoleUsers:[],
      //   };
      // },
    getTableData(id) {
      this.ruleId = id;
      this.visible = true;
      this.tableLoading = true;
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl(
          `/demandCollaboration/selectResultByRuleId`
        ),
        method: "get",
        params: this.$http.adornParams(
          {
            batchId: (this.batchItem.batchId && this.batchItem.batchId) || "",
            runStatus: this.searchForm.runStatus, // 运行状态
            batchType: 2,
            ruleCategory: this.searchForm.ruleCategory,
            ruleId: this.ruleId
            // rule: {
            //     ruleCategory: this.searchForm.ruleCategory
            // }
            // rule: {
            //     ruleCategory: ''
            // }
          },
          false
        )
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code == 200) {
            data.result.map(i => {
              i.ruleName = i.ruleName;
              i.dealRuleType = this.dealRuleType(i.ruleCategory);
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
              i.option = i.runStatus;
            });
            this.tableData = data.result;
            this.Pager.pageSize = data.result.size;
            this.Pager.pageIndex = data.result.current;
            this.Pager.total = data.result.total;
          } else {
            this.tableData = [];
            this.Pager.pageIndex = 1;
            this.Pager.total = 0;
            this.$message.warning(data.message);
            this.tableLoading = false;
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 反馈
    // deleteFn() {
    //   if (this.multipleTable.length != 1)
    //     return this.$message({
    //       message: "请选择一条数据进行提交",
    //       type: "warning"
    //     });
    // //   var deleteList = [];
    // //   this.multipleTable.forEach(item => {
    // //     deleteList.push(item.resultId);
    // //   });
    //     let fd = new FormData();
    //     fd.append("demandCollaborationId", this.demandCollaborationId);
    //     fd.append("resultId", this.multipleTable[0].resultId);

    //   this.$confirm(`是否确认提交反馈`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.$http({
    //         isLoading: false,
    //         url: this.$http.adornUrl("demandCollaboration/updateRuleResult"),
    //         method: "DELETE",
    //         data: fd
    //       }).then(({ data }) => {
    //         if (data && data.code === 200) {
    //           this.$message({ message: "反馈成功", type: "success" });
    //         //   this.Pager.pageIndex = 1;
    //         //   this.Pager.pageSize = 10;
    //           //this.getTableData();
    //           this.setTableChecked();
    //         } else {
    //           this.$message.error(data.msg);
    //         }
    //       });
    //     })
    //     .catch(() => {});
    // },

    // getbatchData(data, node) {
    //   this.batchItem = data;
    //   this.getTableData();
    // },
    // 列表查询
    onQuery() {
      // if (this.batchItem.batchId) {
      //     this.getTableData()
      // } else {
      //     this.$message({message: '请选择批次列表',type: 'warning'})
      // }
      this.Pager.pageIndex = 1;
      this.getTableData();
    },
    // 列表重置
    onReset() {
      this.searchForm.ruleCategory = "";
      this.searchForm.runStatus = "";
      this.Pager.pageIndex = 1;
      this.getTableData()
      // this.$refs.treesa.setCheckedKeys([]);
      // this.$refs.treesa.setCurrentKey(null);
      // this.batchItem = {}
    },
    currentChangeHandle(val) {
      this.Pager.pageIndex = val;
      this.getTableData();
    },
    sizeChangeHandle(val) {
      this.Pager.pageSize = val;
      this.getTableData();
    },
    handleSelectionChange(val) {
      this.multipleTable = val;
    },
    // 列表查看
    resultViewClick(data) {
      this.$refs.resultView.showDialog(data);
    },
    setTableChecked() {
      this.multipleTable = [];
      this.$refs.multipleTable.clearSelection(this.multipleTable);
    }
  },
  components: {
    resultView,
    batchList
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
    min-width: 300px;
    min-height: calc(100vh - 165px);
    // overflow: auto;
    // border: 1px solid #ddd;
    // padding: 10px 0 0 10px;
  }
  .auditRuleMonitoring-right {
    flex: 1;
    border: none;
    height: 75vh;
    overflow: auto;
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
      padding-left: 20px;
      // padding-left: 20px;
      .result-view-text {
        color: #0cbde5;
        cursor: pointer;
      }
      .option-box {
        margin-bottom: 10px;
      }
    }
  }
}
.left {
  width: 300px;
  float: left;
  margin-right: 10px;
  .el-card{
    overflow: auto;
  }
}
</style>
