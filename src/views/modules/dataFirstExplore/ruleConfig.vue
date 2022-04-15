<!--初探规则配置-->
<template>
  <div class="box">
    <div class="left">
      <el-card
        v-loading="treeLoading"
        :style="{ height: tableHeight + 100 + 'px' }"
      >
        <rule-tree
          :isShowSearch="true"
          :isShowCheckBox="false"
          @getTreeId="getTreeId"
          :isParent="false"
          ref="ruleTree"
          folderSorts="1,2"
          :height="tableHeight"
        ></rule-tree>
      </el-card>
    </div>
    <div style="width:100%">
      <el-card class="box-card" :style="{ height: tableHeight + 100 + 'px' }">
        <div class="search-box">
          <el-form
            ref="dataForm"
            :model="dataForm"
            :inline="true"
            class="search-form-new"
          >
            <el-form-item label="规则名称：">
              <el-input
                v-model="dataForm.ruleName"
                placeholder="规则名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="规则类别：">
              <el-select
                v-model="dataForm.ruleCategory"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in ruleCategory"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="getAllSearch()" type="primary">查询</el-button>
            <el-button @click="reset()">重置</el-button>
          </el-form>
        </div>

        <div class="content">
          <!-- <div class="tableTitle">
              <span
                >查询结果<span style="color:#E6A23C">{{ dataForm.total }}</span
                >条</span
              >
              <div style="float:right;margin-bottom:10px">
                <el-button @click="addData" type="primary">新增</el-button>
                <el-button
                  :disabled="
                    this.multipleSelection.length <= 0 ||
                      this.multipleSelection.length > 1
                  "
                  @click="editData"
                  type="primary"
                  >修改</el-button
                >
                <el-button
                  @click="deleteData"
                  :disabled="this.multipleSelection.length <= 0"
                  type="danger"
                  >删除</el-button
                >
              </div>
            </div> -->
          <el-table
            :data="tableData"
            ref="tableData"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            style="width: 100%"
            :row-key="getRowKeys"
            :height="tableHeight - tableMinus"
          >
            <el-table-column
              type="selection"
              align="center"
              :reserve-selection="true"
              width="55"
            >
            </el-table-column>
            <el-table-column
              prop="ruleName"
              label="规则名称"
              align="center"
              min-width="140"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="detailHandle(scope.row.ruleId, 'look')"
                  :title="scope.row.ruleName"
                  class="show-ellipsis"
                  >{{ scope.row.ruleName }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="avgRunTime"
              header-align="center"
              align="center"
              label="平均运行时间"
              min-width="140"
            >
            </el-table-column>
            <el-table-column
              prop="createTime"
              header-align="center"
              align="center"
              label="创建时间"
              width="160"
            >
            </el-table-column>
            <el-table-column
              prop="createUserName"
              header-align="center"
              align="center"
              label="创建人"
            >
            </el-table-column>
            <el-table-column
              prop="ruleCategory"
              header-align="center"
              align="center"
              label="规则类别"
            >
              <template slot-scope="scope">
                {{
                  scope.row.ruleCategory == "1"
                    ? "门诊规则"
                    : scope.row.ruleCategory == "2"
                    ? "住院规则"
                    : ""
                }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="hospitalName" label="医院">
              </el-table-column> -->
            <!--  <el-table-column prop="moblie" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="detailHandle(scope.row.ruleId, 'look')"
                  >查看详情</el-button
                >
              </template>
            </el-table-column> -->
          </el-table>
          <el-row>
            <div style="float:left;margin-top:10px">
              <el-button-group>
                <el-button
                  >当前选择规则数量：{{
                    this.multipleSelection.length
                  }}</el-button
                >
                <el-button
                  :disabled="this.multipleSelection.length <= 0"
                  @click="runNow"
                  >立即运行</el-button
                >
                <el-button
                  :disabled="this.multipleSelection.length <= 0"
                  @click="timeRun"
                  >定时运行</el-button
                >
                <el-popover
                  placement="top"
                  width="400"
                  trigger="click"
                  v-if="this.multipleSelection.length > 0"
                >
                  <div style="max-height:300px;overflow-y:auto">
                    <p v-for="(i, k) in multipleSelection" :key="k">
                      {{ i.ruleName }}
                    </p>
                  </div>
                  <el-button slot="reference">当前所选规则</el-button>
                </el-popover>
                <el-button v-else>当前所选规则</el-button>
              </el-button-group>
            </div>
          </el-row>
          <el-row>
            <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :total="totalPage"
              layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
          </el-row>
        </div>
        <!--查看详细弹窗 -->
        <!-- <el-dialog
          :visible.sync="showDetailDialog"
          title="初探规则详细"
          :close-on-click-modal="false"
          :modal-append-to-body="false"
          width="40%"
          :close-on-press-escape="false"
        >
          <detail
            @close="closeDetail"
            @ok="editSucceed"
            :ruleId="ruleId"
            v-if="showDetailDialog"
          ></detail>
        </el-dialog> -->
        <el-dialog
          :visible.sync="showRunDialog"
          title="规则运行"
          :close-on-click-modal="false"
          :modal-append-to-body="false"
          width="40%"
          :close-on-press-escape="false"
        >
          <runNow
            @close="closeRun"
            @ok="succeedRun"
            :info="info"
            :runIds="runIds"
            :sql="sql"
            v-if="showRunDialog"
          ></runNow>
        </el-dialog>
        <!-- 弹窗, 新增 / 修改 -->
        <!--  <el-dialog :title="treeTitle" :visible.sync="treeVisible">
            <el-form :model="form">
              <el-form-item label="分类名称">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="treeVisible = false">取 消</el-button>
              <el-button type="primary" @click="treeVisible = false"
                >确 定</el-button
              >
            </div>
          </el-dialog> -->
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update
          ref="addOrUpdate"
          @refreshDataList="initData"
          :ruleData="ruleData"
        ></add-or-update>
      </el-card>
    </div>
  </div>
</template>
<script>
// import detail from "./component/ruleConfig-detail.vue";
import runNow from "./component/ruleConfig-runNow.vue";
import ruleTree from "../../common/rule-tree.vue";
import addOrUpdate from "@/views/modules/data/rule-add-or-update.vue";
export default {
  components: {
    // detail,
    runNow,
    ruleTree,
    addOrUpdate
  },
  data() {
    return {
      tableMinus: 120,
      //条件查询数据定义
      dataForm: {
        ruleName: "",
        ruleCategory: ""
      },
      //规则树是否可见
      treeVisible: false,
      // treeTitle: "",
      // form: { name: "" },
      getDataList: [],
      //规则树数据
      ruleData: [],
      //树id
      folderId: "",
      //树path
      folderPath: "",
      //规则树
      ruleTree: "",
      //运行id
      runIds: "",
      //当前页
      pageIndex: 1,
      //每页条数
      pageSize: 10,
      //总页数
      totalPage: 0,
      //当前所选规则
      // choseRule: [],
      //树数据
      dataTree: [],
      //规则类别
      ruleCategory: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ],
      //树默认属性
      defaultProps: {
        children: "children",
        label: "name"
      },
      //表格数据定义
      tableData: [],
      //多选数据定义
      multipleSelection: [],
      //loading加载
      listLoadingTry: false,
      //loading
      loading: false,
      //树loading
      treeLoading: false,
      //查看规则详细弹窗是否显示
      showDetailDialog: false,
      //立即运行、定时运行弹窗是否显示
      showRunDialog: false,
      //行数据定义
      rows: [],
      //运行弹窗区分字段 true:定时运行 false:立即运行
      info: "",
      //规则id
      ruleId: "",
      // 选中的规则节点
      ruleCheckData: {},
      //sql语句
      sql: [],
      folderSorts: '1,2'
    };
  },
  computed: {
    tableHeight: {
      get() {
        return this.$store.state.common.tableHeight;
      }
    },
    projectId: {
      get () { return this.$store.state.common.projectId}
    },
  },
  created() {
    //获取列表
    // this.initData();
  },
  mounted() {
    this.$bus.$on("updateRuleData", () => {
      this.getRuleFolder();
    });
  },
  activated () {
    this.getRuleFolder()
  },
  methods: {
    //获取列表数据
    initData() {
      // 判断不选左侧规则节点列表为空
      if (!this.ruleCheckData.folderId) {
        this.$message({ message: "请选择对应的规则分类", type: "warning" });
        return;
      }
      this.loading = true;
      // 如何改规则节点有子节点的话folderId为空
      if (this.ruleCheckData.children) {
        this.folderId = "";
      }
      this.$http({
        url: this.$http.adornUrl("/rule/selectPage"),
        method: "get",
        isLoading: false,
        params: this.$http.adornParams(
          {
            pageNo: this.pageIndex,
            pageSize: this.pageSize,
            ruleName: this.dataForm.ruleName,
            ruleCategory: this.dataForm.ruleCategory,
            folderId: this.folderId,
            folderPath: this.folderPath
          },
          false
        )
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
    // 获取规则树
    getRuleFolder() {
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/ruleFolder/getRuleFolder"),
        method: "get",
        params: this.$http.adornParams(
          { folderSorts: this.folderSorts, projectId: this.projectId },
          false
        )
        // params:  this.$http.adornParams({}, false)
      })
      .then(({ data }) => {
        if (data.code == 200) {
          this.ruleData = data.result;
        }
      })
      .catch(() => {});
    },
    //点击树节点切换表
    handleNodeClick(data) {
      // console.log(data)
    },
    //新增弹框
    addData() {
      this.$refs.addOrUpdate.init("", this.ruleCheckData);
      this.ruleId = "";
      this.folderId = "";
      // this.ruleData = this.$refs.ruleTree.treeData;

    },
    //修改弹框
    editData() {
      this.$refs.addOrUpdate.init(
        this.multipleSelection[0].ruleId,
        this.ruleCheckData
      );
      this.ruleId = this.multipleSelection[0].ruleId;
      this.folderId = this.multipleSelection[0].folderId;
      // this.ruleData = this.$refs.ruleTree.treeData;
    },
    // 关闭详情弹窗
    closeDetail() {
      this.showDetailDialog = false;
    },
    // 关闭详情弹窗确认
    editSucceed() {
      this.closeDetail();
    },
    //列表多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除
    deleteData() {
      var deleteList = [];
      this.multipleSelection.forEach(item => {
        deleteList.push(item.ruleId);
      });
      this.$confirm(`确定进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/rule/deleteByIds`),
            method: "delete",
            data: this.$http.adornData(deleteList, false)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.initData();
                  this.clearTableChecked();
                }
              });
            } else {
              this.$message.error("操作失败");
            }
          });
        })
        .catch(() => {});
    },
    //查看详情
    detailHandle(id, type) {
      // this.showDetailDialog = true;
      this.$refs.addOrUpdate.init(id, this.ruleCheckData, type);
    },
    //搜索
    getAllSearch() {
      // this.folderId = 1;
      this.pageIndex = "";
      this.initData();
    },
    //重置搜索
    reset() {
      this.dataForm = {
        ruleName: "",
        ruleCategory: "",
        createUserName: "",
        createTime: ""
      };
      this.initData();
      this.clearTableChecked();
    },
    //立即运行
    runNow() {
      var sql = [];
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].ruleSqlValue != null) {
          sql.push(this.multipleSelection[i].ruleSqlValue);
        }
      }
      if (sql.length == 0) {
        this.$message.error("选择的规则下没有sql，无法运行");
      } else {
        var arrIds = "";
        for (var j = 0; j < this.multipleSelection.length; j++) {
          arrIds += this.multipleSelection[j].ruleId + ",";
        }
        if (arrIds != null && arrIds != "" && arrIds != undefined) {
          arrIds = arrIds.substr(0, arrIds.length - 1);
        }

        this.runIds = arrIds;
        this.sql = sql;
        this.showRunDialog = true;
        this.info = false;
      }
    },
    //定时运行
    timeRun() {
      var sql = [];
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].ruleSqlValue != null) {
          sql.push(this.multipleSelection[i].ruleSqlValue);
        }
      }
      if (sql.length == 0) {
        this.$message.error("选择的规则下没有sql，无法运行");
      } else {
        var arrIds = "";
        for (var j = 0; j < this.multipleSelection.length; j++) {
          arrIds += this.multipleSelection[j].ruleId + ",";
        }
        if (arrIds != null && arrIds != "" && arrIds != undefined) {
          arrIds = arrIds.substr(0, arrIds.length - 1);
        }
        this.runIds = arrIds;
        this.sql = sql;
        this.showRunDialog = true;
        this.info = true;
      }
    },
    //关闭规则运行弹窗
    closeRun() {
      this.showRunDialog = false;
    },
    //运行成功后关闭页面并刷新
    succeedRun() {
      this.closeRun();
      this.initData();
      this.clearTableChecked();
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.initData();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.initData();
    },
    //查看已选规则
    /* seeChoseRule() {
      this.choseRule = this.multipleSelection;
    }, */
    //拿到选择树的id
    getTreeId(data) {
      this.ruleCheckData = data;
      this.folderPath = (data.folderPath && data.folderPath) || "";
      this.folderId = (data.folderId && data.folderId) || "";
      // if (data.children) {
      //   this.folderId = "";
      // }
      this.initData();
      this.clearTableChecked();
    },
    //获取每行数据id
    getRowKeys(row) {
      return row.ruleId;
    },
    //清除已选
    clearTableChecked() {
      this.$refs.tableData.clearSelection(this.multipleTable);
      this.multipleSelection = [];
    }
  },
  watch: {
    projectId(nval, oval) {
      if (nval) {
        this.getRuleFolder();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.search-box {
  display: flex;
  flex-direction: column;
  // border-bottom: 1px solid #ddd;
  // padding-bottom: 20px;
  padding-left: 20px;
  // padding-right: 109px;
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
