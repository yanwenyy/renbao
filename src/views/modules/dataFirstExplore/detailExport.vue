<!--结果明细导出-->
<template>
  <div class="lawsAregulations">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card v-loading="treeLoading" style="height:500px;overflow-y:auto">
          <el-tree
            :data="dataTree1"
            :props="defaultProps"
            v-loading="listLoadingTry"
            @node-click="handleNodeClick"
            default-expand-all
            :filter-node-method="filterNode"
            ref="dataTree1"
            node-key="id"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="box-card">
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
                    placeholder="规则类型"
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
                <el-button @click="deleteData" type="danger">删除</el-button>
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
              <el-table-column
                prop="ruleCategory"
                label="规则类别"
              ></el-table-column>
              <el-table-column
                prop="actualBeginTime"
                label="开始时间"
              ></el-table-column>
              <el-table-column prop="actualEndTime" label="结束时间">
              </el-table-column>
              <el-table-column prop="resultCount" label="结果条数">
              </el-table-column>
              <el-table-column prop="createUserName" label="执行人">
              </el-table-column>
              <el-table-column prop="moblie" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="detailHandle(scope.row.id)"
                    >查看明细</el-button
                  >
                  <div type="text" v-if="scope.row.aa == 1">运行成功</div>
                </template>
              </el-table-column>
            </el-table>
            <div class="pager">
              <el-pagination
                small
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="dataForm.total"
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
              v-if="showDetailDialog"
            ></detail>
          </el-dialog>
          <!--结果明细导出弹窗 -->
          <el-dialog
            :visible.sync="detailExportDialog"
            title="查看结果明细"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="20%"
            :close-on-press-escape="false"
            v-if="detailExportDialog"
          >
            <el-form :model="dataForm" ref="dataForm" label-width="80px" :rules="rules">
              <el-form-item prop="folderId">
                <el-select
                  v-model="dataForm.folderId"
                  filterable
                  clearable
                  placeholder="请选择医院"
                >
                  <el-option
                    v-for="(item, index) in folderId"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="exportExcel()">导出</el-button>
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
        ruleCategory: "",
        actualBeginTime: "",
        actualEndTime: "",
        resultCount: "",
        createUserName: ""
      },
      dataTree1: [
        {
          name: "批次名称",
          children: [
            {
              name: "人民医院医保数据筛查"
            },
            {
              name: "妇幼保健院医院数据筛查"
            }
          ]
        }
      ],
      ruleCategory: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableData: [2],
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
      info: ""
    };
  },
  mounted() {
    this.initData();
    // this.initTree()
  },
  created() {},
  methods: {
    initData() {
      this.$http({
        url: this.$http.adornUrl("/ruleResult/selectPageByRuleResult"),
        method: "get",
        params: this.$http.adornParams({
          ruleResult: {
            batchId: this.batchId,
            runStatus: this.dataForm.runStatus, //1:待执行,2:执行中,3:执行失败,4:已完成
            rule: {
              ruleCategory: this.dataForm.ruleCategory, //规则类别;1:门诊规则,2:住院规则
              ruleName: this.dataForm.ruleName
            }
          },
          pageNo: this.pageIndex,
          pageSize: this.pageSize
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          // this.tableData = data.result.records;
          this.totalPage = data.result.total;
          this.dataForm.total = data.result.total;
        } else {
          this.dataForm.total = 0;
          this.tableData = [];
          this.totalPage = 0;
        }
      });
    },
    initTree() {
      this.treeLoading = true;
      selectLawRule().then(res => {
        this.dataTree1 = this.listToTree(res.data);
        this.dataForm.childCount1 = res.data.length - 1;
      });
      selectLawIndexRule().then(res => {
        this.dataTree2 = this.listToTree(res.data);
        this.dataForm.childCount2 = res.data.length - 1;
        this.treeLoading = false;
      });
    },
    //点击树节点切换表
    handleNodeClick(data) {
      this.loading = true;
      showLawDataPage({ regulationCategoryCode: data.extStr1 }, "").then(
        res => {
          this.tableData = res.data.body.result;
          this.dataForm.total = res.data.body.pagination.dataCount;
          this.loading = false;
        }
      );
    },
    //结果明细导出弹窗
    detailExport() {
      this.detailExportDialog = true;
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
      if (this.multipleSelection.length == 0) {
        this.$confirm("请勾选数据", "信息", {
          confirmButtonText: "关闭",
          type: "warning"
        });
      } else {
        var uuids = [];
        for (var i = 0; i < this.multipleSelection.length; i++) {
          uuids.push(this.multipleSelection[i].LAWREGULATIONUUID);
        }
        this.$confirm("确定进行删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let formdata = new FormData();
            formdata.append("uuids[]", uuids);
            daleteLawRule(formdata, "").then(res => {
              if (res.data.head.status == 20) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.initData();
                this.initTree();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    //查看详情
    detailHandle(id) {
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
    //搜索
    getAllSearch() {
      this.initData();
    },
    //重置搜索
    reset() {
      this.dataForm = {
        ruleName: "",
        ruleCategory: ""
      };
      this.initData();
    }
  }
};
</script>
