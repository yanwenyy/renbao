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
            apComServerData.childCount1
          }}</span>
          <span style="position:absolute;top:157px;left:115px;color:#E6A23C">{{
            apComServerData.childCount2
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
                    v-model="apComServerData.displayname"
                    size="small"
                    placeholder="规则名称"
                    clearable
                  ></el-input>
                </div>
              </el-col>
              <el-col :span="4" style="margin-left:10px">
                <div class="search-operation">
                  <el-select
                    v-model="apComServerData.type"
                    filterable
                    clearable
                    placeholder="规则类型"
                    size="small"
                    @change="getProjectId"
                  >
                    <el-option
                      v-for="(item, index) in serverType"
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
                  <el-button @click="runNow">立即运行</el-button>
                  <el-button @click="timeRun">定时运行</el-button>
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
                >查询结果<span style="color:#E6A23C">{{
                  apComServerData.total
                }}</span
                >条</span
              >
              <div style="float:right;margin-bottom:10px">
                <el-button @click="addData" type="primary">新增</el-button>
                <el-button @click="editData" type="primary">修改</el-button>
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
                prop="ISSUEUNIT"
                label="规则名称"
              ></el-table-column>
              <el-table-column
                prop="REFERENCENUMBER"
                label="规则类别"
              ></el-table-column>
              <el-table-column
                prop="REGULATIONCATEGORY"
                label="创建人"
              ></el-table-column>
              <el-table-column
                prop="RULEGRADATIONNAME"
                label="创建时间"
              ></el-table-column>
              <el-table-column prop="TIMELINESSNAME" label="医院">
              </el-table-column>
              <el-table-column prop="moblie" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="detailHandle(scope.row.id)"
                    >查看详情</el-button
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
                :total="apComServerData.total"
              ></el-pagination>
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
              :info="info"
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
              :info="info"
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
      pbFileList: [],
      pbFiles: [],
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
      serverType: [
        { id: 1, name: "门诊规则" },
        { id: 2, name: "住院规则" }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      apComServerData: {
        title: "",
        content: ""
      },
      tableData: [1],
      multipleSelection: [],
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
      info: ""
    };
  },
  mounted() {
    // this.initData()
    // this.initTree()
  },
  created() {},
  methods: {
    initData() {
      this.loading = true;
      showLawDataPage(this.apComServerData, "").then(res => {
        this.tableData = res.data.body.result;
        this.apComServerData.total = res.data.body.pagination.dataCount;
        this.loading = false;
      });
    },
    initTree() {
      this.treeLoading = true;
      selectLawRule().then(res => {
        this.dataTree1 = this.listToTree(res.data);
        this.apComServerData.childCount1 = res.data.length - 1;
      });
      selectLawIndexRule().then(res => {
        this.dataTree2 = this.listToTree(res.data);
        this.apComServerData.childCount2 = res.data.length - 1;
        this.treeLoading = false;
      });
    },
    //点击树节点切换表
    handleNodeClick1(data) {
      this.loading = true;
      showLawDataPage({ regulationCategoryCode: data.extStr1 }, "").then(
        res => {
          this.tableData = res.data.body.result;
          this.apComServerData.total = res.data.body.pagination.dataCount;
          this.loading = false;
        }
      );
    },
    handleNodeClick2(data) {
      this.loading = true;
      showLawDataPage({ ruleGradationCode: data.extStr1 }, "").then(res => {
        this.tableData = res.data.body.result;
        this.apComServerData.total = res.data.body.pagination.dataCount;
        this.loading = false;
      });
    },
    //查看详情弹框
    ledgerTable(data) {
      this.showDetailDialog = true;
      this.info = data;
    },
    //新增弹框
    addData() {
      this.showAddOrEditDialog = true;
    },
    //修改弹框
    editData() {
      this.showAddOrEditDialog = true;
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

    //修改保存
    submitForm() {
      let params = {
        lawRegulationUuid: this.multipleSelection[0].LAWREGULATIONUUID,
        title: this.submitData.title, //标题
        issueUnit: this.submitData.issueUnit, //颁布单位
        referenceNumber: this.submitData.referenceNumber, //文号
        effectiveDate: new Date(this.submitData.effectiveDate), //生效日期
        regulationCategoryCode: this.regulationCategory1.extStr1,
        regulationCategory: this.regulationCategory1.name,
        ruleGradationCode: this.ruleGradation1.extStr1,
        ruleGradationName: this.ruleGradation1.name,
        addressName: this.submitData.addressName,
        content: this.submitData.content,
        timelinessName: this.submitData.timelinessName,
        remark: this.submitData.remark,
        pbFiles: this.pbFileList,
        deleteFileIds: this.deleteFileIds
      };
      updateLawRule(params, "").then(res => {
        if (res.data.head.status == 20) {
          this.$message.success("操作成功");
          this.popUpDatas.show = false;
          this.initData();
        } else {
          this.$message.error("操作失败");
          this.popUpDatas.show = false;
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
    //获取选择的法规类型数据
    getRegulationCategory(extStr1) {
      this.regulationCategory1 = this.regulationCategory.find(
        item => item.extStr1 == extStr1
      );
    },
    //获取选择的法规层次数据
    getRuleGradation(extStr1) {
      this.ruleGradation1 = this.ruleGradationName.find(
        item => item.extStr1 == extStr1
      );
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
      this.apComServerData.pageSize = val;
      this.initData();
    },
    //分页
    handleCurrentChange(val) {
      this.apComServerData.pageNum = val;
      this.initData();
    },
    //搜索
    getAllSearch() {
      this.initData();
    },
    //重置搜索
    reset() {
      this.apComServerData = {
        title: "",
        content: ""
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
    }
  }
};
</script>
