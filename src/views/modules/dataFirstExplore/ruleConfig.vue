<!--初探规则配置-->
<template>
  <div class="lawsAregulations">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card v-loading="treeLoading" style="height:500px;overflow-y:auto">
          <el-tree
            :data="dataTree1"
            :props="defaultProps"
            v-loading="listLoadingTry"
            @node-click="handleNodeClick1"
            default-expand-all
            :filter-node-method="filterNode"
            ref="dataTree1"
            node-key="id"
          ></el-tree>
          <el-tree
            :data="dataTree2"
            :props="defaultProps"
            v-loading="listLoadingTry"
            @node-click="handleNodeClick2"
            default-expand-all
            :filter-node-method="filterNode"
            ref="dataTree2"
            node-key="id"
          ></el-tree>
          <span style="position:absolute;top:27px;left:115px;color:#E6A23C">{{
            dataForm.childCount1
          }}</span>
          <span style="position:absolute;top:157px;left:115px;color:#E6A23C">{{
            dataForm.childCount2
          }}</span>
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
                  <el-button>当前选择规则数量：{{ 10 }}</el-button>
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
                    placement="bottom"
                    title="当前所选规则"
                    width="200"
                    trigger="click"
                    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                  >
                    <el-button slot="reference" @click="seeChoosed"
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
                <template slot-scope="scope">{{
                  scope.row.createTime | dateformat
                }}</template></el-table-column
              >
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
            width="80%"
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
export default {
  components: {
    detail,
    AddOrEdit,
    runNow
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
      //当前页
      pageIndex: 1,
      //每页条数
      pageSize: 10,
      //总页数
      totalPage: 0,
      dataTree1: [
        {
          name: "全国通用规则",
          children: [
            {
              name: "医保",
              children: [
                {
                  name: "床位费超量"
                },
                {
                  name: "男女性诊断串换"
                },
                {
                  name: "男女性项目互换"
                }
              ]
            },
            {
              name: "医院",
              children: [
                {
                  name: "超医保适应症用药"
                }
              ]
            }
          ]
        }
      ],
      dataTree2: [
        {
          name: "地区个性化规则",
          children: [
            {
              name: "医保",
              children: [
                {
                  name: "限门诊和药店用药"
                },
                {
                  name: "项目同时收费"
                }
              ]
            },
            {
              name: "医保",
              children: [
                {
                  name: "护理费超量"
                }
              ]
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
      ruleId: ""
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
        url: this.$http.adornUrl("/rule/selectPage"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          ruleName: this.dataForm.ruleName,
          ruleCategory: this.dataForm.ruleCategory,
          folderId: 1
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableData = data.result.records;
          this.totalPage = data.result.total;
        } else {
          this.tableData = [];
          this.totalPage = 0;
        }
      });
    },
    initTree() {},
    //点击树节点切换表
    handleNodeClick1(data) {
      this.loading = true;
      showLawDataPage({ regulationCategoryCode: data.extStr1 }, "").then(
        res => {
          this.tableData = res.data.body.result;
          this.dataForm.total = res.data.body.pagination.dataCount;
          this.loading = false;
        }
      );
    },
    handleNodeClick2(data) {
      this.loading = true;
      showLawDataPage({ ruleGradationCode: data.extStr1 }, "").then(res => {
        this.tableData = res.data.body.result;
        this.dataForm.total = res.data.body.pagination.dataCount;
        this.loading = false;
      });
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
    //弹窗提交
    popUpSubmit() {
      this.pbFileList = this.$refs.pbFile.fileListData;
      this.$refs.submitData.validate(valid => {
        if (valid) {
          if (this.popUpDatas.type == 1) {
            this.addSub();
          } else {
            this.submitForm();
          }
        }
      });
    },
    //将返回的数据整理为树形结构
    listToTree(list) {
      var arr = [];
      let items = {};
      var idsStr = "";
      // 获取每个节点的直属子节点（是直属，不是所有子节点）
      for (let i = 0; i < list.length; i++) {
        let key = list[i].pid;
        if (items[key]) {
          items[key].push(list[i]);
        } else {
          items[key] = [];
          items[key].push(list[i]);
        }
        idsStr += idsStr === "" ? list[i].id : "," + list[i].id;
      }
      for (var key in items) {
        if (idsStr.indexOf(key) === -1) {
          //找到最大的父节点key
          arr = this.formatTree(items, key);
        }
      }
      // console.log(arr)
      return arr;
    },
    formatTree(items, parentId) {
      let result = [];
      if (!items[parentId]) {
        return result;
      }
      for (let t of items[parentId]) {
        t.children = this.formatTree(items, t.id); //递归获取children
        result.push(t);
      }
      return result;
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
      var ruleIds = [];
      for (var i = 0; i < this.multipleSelection.length; i++) {
        ruleIds.push(this.multipleSelection[0].ruleId);
      }
      console.log(ruleIds);
      this.$confirm(`确定进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/rule/deleteByIds/"),
            method: "delete",
            data: this.$http.adornData({
              ruleIds: ruleIds
            })
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
    //重置表单
    resetForm(formName) {
      this.submitData = {};
      this.$refs[formName].resetFields();
    },
    //搜索
    getAllSearch() {
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
    },
    //立即运行
    runNow() {
      this.showRunDialog = true;
      this.info = false;
    },
    //定时运行
    timeRun() {
      this.showRunDialog = true;
      this.info = true;
    },
    //查看当前所选规则
    seeChoosed() {},
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
    filterNode() {}
  }
};
</script>
