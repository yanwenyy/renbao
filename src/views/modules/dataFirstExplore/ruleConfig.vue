<!--初探规则配置-->
<template>
  <div class="lawsAregulations">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card v-loading="treeLoading" style="height:800px;overflow-y:auto">
          <rule-tree
            :isShowSearch="true"
            :isShowCheckBox="false"
            @getTreeId="getTreeId"
            :isParent="false"
            ref="ruleTree"
            folderSort="1,2"
          ></rule-tree>
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
              <el-col :span="11">
                <el-button-group style="float:right">
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
                  <el-popover placement="right" trigger="click">
                    <el-table :data="choseRule">
                      <el-table-column
                        property="ruleName"
                        label="规则名称"
                      ></el-table-column>
                    </el-table>
                    <el-button slot="reference" @click="seeChoseRule"
                      >当前所选规则</el-button
                    >
                  </el-popover>
                </el-button-group>
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
              <el-table-column prop="ruleCategory" label="规则类别">
                <template slot-scope="scope">
                  <div v-if="scope.row.ruleCategory == 1">门诊规则</div>
                  <div v-if="scope.row.ruleCategory == 2">住院规则</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createUserName"
                label="创建人"
              ></el-table-column>
              <el-table-column prop="createTime" label="创建时间">
              </el-table-column>
              <!-- <el-table-column prop="hospitalName" label="医院">
              </el-table-column> -->
              <el-table-column prop="moblie" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="detailHandle(scope.row.ruleId)"
                    >查看详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="pager">
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
            </div>
          </div>
          <!--查看详细弹窗 -->
          <el-dialog
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
          </el-dialog>
          <!--新增/修改页面 -->
          <el-dialog
            :visible.sync="showAddOrEditDialog"
            title="sql编辑器"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="40%"
            :close-on-press-escape="false"
          >
            <AddOrEdit
              @close="closeAddOrEdit"
              @ok="succeed"
              :ruleId="ruleId"
              v-if="showAddOrEditDialog"
            ></AddOrEdit>
          </el-dialog>
          <!--规则运行页面 -->
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
              v-if="showRunDialog"
            ></runNow>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import detail from "./component/ruleConfig-detail.vue";
import AddOrEdit from "./component/ruleConfig-addOredit.vue";
import runNow from "./component/ruleConfig-runNow.vue";
import ruleTree from "../../common/rule-tree.vue";
export default {
  components: {
    detail,
    AddOrEdit,
    runNow,
    ruleTree
  },
  data() {
    return {
      dataForm: {
        ruleName: "",
        ruleCategory: "",
        createUserName: "",
        createTime: ""
        // hospitalName: ""
      },
      // pbFileList: [],
      // pbFiles: [],
      ruleTree: "",
      runIds: "",
      //当前页
      pageIndex: 1,
      //每页条数
      pageSize: 10,
      //总页数
      totalPage: 0,
      //当前所选规则
      choseRule: [],
      dataTree: [],
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
      listLoadingTry: false,
      loading: false,
      treeLoading: false,
      formLoading: false,
      //查看规则详细弹窗是否显示
      showDetailDialog: false,
      //新增、修改弹窗是否显示
      showAddOrEditDialog: false,
      //立即运行、定时运行弹窗是否显示
      showRunDialog: false,
      rows: [],
      info: "",
      ruleId: "",
      folderId: 1
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.$http({
        url: this.$http.adornUrl("/rule/selectPage"),
        method: "get",
        params: this.$http.adornParams(
          {
            pageNo: this.pageIndex,
            pageSize: this.pageSize,
            ruleName: this.dataForm.ruleName,
            ruleCategory: this.dataForm.ruleCategory,
            folderId: this.folderId
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableData = data.result.records;
          this.totalPage = data.result.total;
          this.dataForm.total = data.result.total;
        } else {
          this.dataForm.total = 0;
          this.tableData = [];
          this.totalPage = 0;
        }
      });
    },
    //点击树节点切换表
    handleNodeClick(data) {
      // console.log(data)
    },
    //新增弹框
    addData() {
      this.showAddOrEditDialog = true;
      this.ruleId = "";
    },
    //修改弹框
    editData() {
      this.showAddOrEditDialog = true;
      this.ruleId = this.multipleSelection[0].ruleId;
    },
    // 关闭编辑弹窗
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
    detailHandle(id) {
      this.showDetailDialog = true;
      this.ruleId = id;
    },
    //搜索
    getAllSearch() {
      this.folderId = 1;
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
      this.folderId = 1;
      this.initData();
    },
    //立即运行
    runNow() {
      var arrIds = "";
      for (var j = 0; j < this.multipleSelection.length; j++) {
        arrIds += this.multipleSelection[j].ruleId + ",";
      }
      if (arrIds != null && arrIds != "" && arrIds != undefined) {
        arrIds = arrIds.substr(0, arrIds.length - 1);
      }
      this.runIds = arrIds;
      this.showRunDialog = true;
      this.info = false;
    },
    //定时运行
    timeRun() {
      var arrIds = "";
      for (var j = 0; j < this.multipleSelection.length; j++) {
        arrIds += this.multipleSelection[j].ruleId + ",";
      }
      if (arrIds != null && arrIds != "" && arrIds != undefined) {
        arrIds = arrIds.substr(0, arrIds.length - 1);
      }
      this.runIds = arrIds;
      this.showRunDialog = true;
      this.info = true;
    },
    //关闭规则运行弹窗
    closeRun() {
      this.showRunDialog = false;
    },
    succeedRun() {
      this.showRunDialog = false;
    },
    //关闭新增、修改弹窗
    closeAddOrEdit() {
      this.showAddOrEditDialog = false;
    },
    succeed() {
      this.closeAddOrEdit();
      this.initData();
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
    //
    filterNode() {},
    //查看已选规则
    seeChoseRule() {
      var chose = [];
      // chose.
      this.choseRule = this.multipleSelection;
    },
    //拿到选择树的id
    getTreeId(data) {
      this.folderId = data.folderId;
      this.initData();
    }
  }
};
</script>
