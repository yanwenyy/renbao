<template>
  <div>
    <div class="left">
      <el-card :style="{height:(tableHeight+100)+'px'}">
        <batch-list
          :batchLoading="batchLoading"
          :batchTreeList="batchTreeList"
          parentGetTreeData="getbatchData"
          v-on:refreshBitchData="getbatchList"
          v-on:refreshRuleData="getTableData"
        ></batch-list>
      </el-card>
    </div>
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
              <el-button
                type="danger"
                @click="deleteFn"
                :disabled="this.multipleTable.length <= 0"
                >删除</el-button
              >
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
            :height="tableHeight - 105"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
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
      </el-card>
    </div>
    <result-view ref="resultView"></result-view>
  </div>
</template>
<script>
import resultView from "./result-view.vue";
import batchList from "../../common/batch-list.vue";
export default {
  data() {
    return {
      batchLoading: false,
      tableLoading: false,
      batchTreeList: [
        {
          label: "批次名称",
          children: []
        }
      ],
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
      batchItem: {}
    };
  },
  computed:{
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
    projectId: {
      get () {
        if(this.$store.state.common.projectId){
          return this.$store.state.common.projectId
        }else{
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
  },
  activated() {
    this.getbatchList();
    // this.getTableData();
  },
  methods: {
    // 序号翻页递增
    indexMethod(index) {
      // console.log("索引数下标", index);
      let nowPage = this.Pager.pageIndex; //当前第几页，根据组件取值即可
      let nowLimit = this.Pager.pageSize; //当前每页显示几条，根据组件取值即可
      return index + 1 + (nowPage - 1) * nowLimit; // 这里可以理解成一个公式
    },
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
    getTableData() {
      this.tableLoading = true;
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl(
          `/ruleResult/selectPageByRuleResult?pageNo=${this.Pager.pageIndex}&pageSize=${this.Pager.pageSize}`
        ),
        method: "get",
        params: this.$http.adornParams(
          {
            batchId: (this.batchItem.batchId && this.batchItem.batchId) || "",
            runStatus: this.searchForm.runStatus, // 运行状态
            batchType: 2,
            ruleCategory: this.searchForm.ruleCategory,
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
            data.result.records.map(i => {
              i.ruleName = i.ruleName;
              i.dealRuleType = this.dealRuleType(i.ruleCategory);
              i.runStatusName = this.dealRunStatus(i.runStatus);
              i.option = i.runStatus;
            });
            this.tableData = data.result.records;
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
    getbatchList() {
      this.batchLoading = true;
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/batch/selectList"),
        method: "get",
        params: this.$http.adornParams({ batchType: 2 , projectId:this.projectId}, false)
      })
        .then(({ data }) => {
          this.batchLoading = false;
          if (data.code == 200) {
            this.batchTreeList[0].children = data.result;
          }
        })
        .catch(() => {
          this.batchLoading = false;
        });
    },
    // 删除
    deleteFn() {
      if (this.multipleTable.length === 0)
        return this.$message({
          message: "请选择至少一条数据",
          type: "warning"
        });
      var deleteList = [];
      this.multipleTable.forEach(item => {
        deleteList.push(item.resultId);
      });
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            isLoading: false,
            url: this.$http.adornUrl("ruleResult/deleteByIds"),
            method: "DELETE",
            data: this.$http.adornData(deleteList, false)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({ message: "删除成功", type: "success" });
              this.Pager.pageIndex = 1;
              this.Pager.pageSize = 10;
              this.getTableData();
              this.setTableChecked();
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },

    getbatchData(data, node) {
      if ( data && data.batchId) {
        this.batchItem = data;
      }
      this.getTableData();
    },
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
