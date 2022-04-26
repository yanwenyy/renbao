<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="需求标题:">
        <el-input v-model="dataForm.demandName" placeholder="需求标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态：">
            <el-select
              v-model="dataForm.examineStatus"
              placeholder="请选择"
              clearable
            >
              <el-option label="编制中" value="0"></el-option>
              <el-option label="待医学组长审批" value="1"></el-option>
              <el-option label="待信息组长分派" value="2"></el-option>
              <el-option label="待信息组员反馈" value="3"></el-option>
              <el-option label="已完成" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
        <el-button type="primary" @click="pageIndex=1,getDataList()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </el-form-item>
      <br>
      <el-form-item label="规则类别" prop="ruleCategory">
                <el-select v-model="dataForm.ruleCategory">
                  <el-option label="请选择" value=""></el-option>
                  <el-option label="门诊规则" :value="1"></el-option>
                  <el-option label="住院规则" :value="2"></el-option>
                </el-select>
              </el-form-item>
          <el-form-item label="规则分类"  prop="folderId">
                <el-popover
                  ref="menuListPopover"
                  placement="bottom-start"
                  trigger="click"
                  v-model="treeVisible">
                  <el-tree
                    class="rule-tree"
                    :data="ruleData"
                    :props="menuListTreeProps"
                    node-key="folderId"
                    ref="menuListTree"
                    @current-change="menuListTreeCurrentChangeHandle"
                    :default-expand-all="false"
                    :highlight-current="true"
                    :expand-on-click-node="false">
                   <span  slot-scope="{ node }">
                      <span class="tree-label">
                          <span class="folder-icon"></span>
                          <span :title="node.label" > {{node.label}}</span>
                      </span>
                  </span>
                  </el-tree>
                </el-popover>
                <el-input @click="treeVisible=true" v-popover:menuListPopover v-model="dataForm.parentName" :readonly="true"
                          placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
              </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addHandle()">新增</el-button>
        <el-button type="primary" @click="updateHandle()">修改</el-button>
        <el-button type="primary" @click="submitHandle()">提交</el-button>
        <el-button type="primary" @click="deleteFn()">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :height="tableHeight-75"
      :data="dataList"
      v-loading="dataListLoading"
      ref="multipleTable"
      :row-key="getRowKeys"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"

        :reserve-selection="true"
       ></el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="序号"
        >
      </el-table-column>
      <el-table-column
        prop="DEMANDNAME"
        header-align="center"
        align="center"
        width="150"
        label="需求标题">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">{{
            scope.row.DEMANDNAME
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="规则分类">
        <template slot-scope="scope">
          {{getTreeData2(ruleData,scope.row.FOLDERID)}}
        </template>
      </el-table-column>

      <el-table-column
        prop="RULECATEGORY"
        header-align="center"
        align="center"
        label="规则类别">
        <template slot-scope="scope">
                {{
                  scope.row.RULECATEGORY == "1"
                    ? "门诊规则"
                    : scope.row.RULECATEGORY == "2"
                    ? "住院规则"
                    : ""
                }}
              </template>
      </el-table-column>
      <el-table-column
        prop="ISFEEDBACK"
        header-align="center"
        align="center"
        label="是否已反馈">
        <template slot-scope="scope">
                {{
                  scope.row.ISFEEDBACK == "0"
                    ? "是"
                    : scope.row.ISFEEDBACK == "1"
                    ? "否"
                    : ""
                }}
              </template>
      </el-table-column>
      <el-table-column
        prop="EXAMINESTATUS"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
                {{
                  scope.row.EXAMINESTATUS == "0"
                    ? "编制中"
                    : scope.row.EXAMINESTATUS == "1"
                    ? "待医学组长审批"
                    : scope.row.EXAMINESTATUS == "2"
                    ? "待信息组长分派"
                    : scope.row.EXAMINESTATUS == "3"
                    ? "待信息组员反馈"
                   : scope.row.EXAMINESTATUS == "4"
                    ? "已反馈"
                    : scope.row.EXAMINESTATUS == "5"
                    ? "已完成"
                    : ""
                }}
              </template>
      </el-table-column>
      <el-table-column
        prop="CREATEUSERNAME"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="CREATETIME"
        header-align="center"
        align="center"
        label="创建时间">
        <!-- <template slot-scope="scope">
          {{scope.row.createTime }}
        </template> -->
      </el-table-column>
      <!-- <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateHandle()">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.demandCollaborationId)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" :projectId = "projectId" :demandCollaboration="demandCollaboration" :ruleData="treeData" :showBtn="showBtn"
        :readonly="readonly" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 提交选人 -->
    <submit-person v-if="submitPersonVisible" :projectId = "projectId" :currentNode="currentNode" :roleId="roleId" :flowNode="1" ref="submitPerson" :demandCollaborationIds="demandCollaborationIds" @refreshDataList="getDataList"></submit-person>

  </div>
</template>

<script>
  import AddOrUpdate from './project-add-or-update'
  import SubmitPerson from './RoleAndUserPage'

  export default {
    data () {
      return {
        //角色
        roleId:"yxzz",
        currentNode:"yxry",
        demandCollaboration: {},
        demandCollaborationIds: [],
        // 开始日期 :picker-options 中引用
        pickerOptionsStart: {
          disabledDate: time => {
            // 获取结束日期的 v-model 值并赋值给新定义的对象
            let endDateVal = this.dataForm.createTimeEnd;
            if (endDateVal) {
              // 比较 距 1970 年 1 月 1 日之间的毫秒数：
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
        },
        // 结束日期 :picker-options 中引用
        pickerOptionsEnd: {
          disabledDate: time => {
            // 获取开始日期的 v-model 值并赋值给新定义的对象
            let beginDateVal = this.dataForm.createTimeBegin;
            if (beginDateVal) {
              // 比较 距 1970 年 1 月 1 日之间的毫秒数：
              return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            }
          }
        },
        dataForm: {
          demandName: '',
          status: '',
          ruleType: '',
          ruleCategory: '',
          folderId: '',
          folderPath: '',
        },
        dataList: [],
        multipleTable: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        submitPersonVisible: false,
        value: '',
        value1: '',
        userId:sessionStorage.getItem("userId"),//当前用户id
        treeData: [],
        folderSorts: "",
        ruleCheckData: {},
        treeVisible:false,//规则分类显示名称
        ruleData: [],
        menuList: [],//规则树数据
        menuListTreeProps: {
          label: 'folderName',
          children: 'children'
        },
      }
    },
    computed: {
      demandCollaborationId: {
        get () { return this.$store.state.common.demandCollaborationId}
      },
      tableHeight: {
        get () { return this.$store.state.common.tableHeight}
      },
      projectId: {
      get() {
        if (this.$store.state.common.projectId) {
          return this.$store.state.common.projectId;
        } else {
          this.$http({
            url: this.$http.adornUrl("/xmProject/selectProjectByUserId"),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 200) {
              return data.result.projectId;
            }
          });
        }
      }
    }
    },
    components: {
      AddOrUpdate,
      SubmitPerson
    },
    activated () {
      this.getDataList();
      this.getRuleFolder();

    },
    methods: {
      //获取每行数据id
      getRowKeys(row) {
        return row.DEMANDCOLLABORATIONID;
      },
      // 通过folderId 获取对应的item
      getTreeData2(treeData, folderId) {
        const getTreeDataItem = [];
        const traverse = function(treeData, folderId) {
          treeData.map(i => {
            if (i.folderId == folderId) {
              getTreeDataItem.push(i);
            }
            if (i.children) {
              traverse(i.children, folderId);
            }
          });
        };
        traverse(treeData, folderId);
        return getTreeDataItem.length>0?getTreeDataItem[0].folderName:"";
      },
      getRowKeys(row) {
        return row.demandCollaborationId;
      },
      //重置
      reset() {
        this.dataForm= {
          //projectCode: '',
          demandName: '',
          status: '',
          ruleType: '',
          ruleCategory: '',
        };
        this.getDataList();
      },

    getTreeId(data) {
      if (data && data.folderId) {
        this.ruleCheckData = data;
        this.$refs.multipleTable.clearSelection(this.multipleTable);
        this.multipleTable = [];
        this.searchForm.folderPath = (data.folderPath && data.folderPath) || "";
        this.searchForm.folderId = (data.folderId && data.folderId) || "";
        this.getSelectPage();
      } else {
        this.ruleCheckData = {};
        this.$refs.multipleTable.clearSelection(this.multipleTable);
        this.multipleTable = [];
        this.searchForm.folderPath = "";
        this.searchForm.folderId = "";
        // this.getSelectPage();
      }
    },

    // 获取规则树
    getRuleFolder() {
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/ruleFolder/getRuleFolder"),
        method: "get",
        params: this.$http.adornParams(
          { folderTypes: this.folderSorts, projectId: this.projectId },
          false
        )
        // params:  this.$http.adornParams({}, false)
      })
        .then(({ data }) => {
          if (data.code == 200) {
            this.treeData = data.result;
            this.ruleData = data.result;
            // this.dataForm.folderId = data.result[0].folderId;
            // this.menuListTreeSetCurrentNode();
          }
        })
        .catch(() => {});
    },
    // 规则树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.folderId = data.folderId;
        this.dataForm.parentName = data.folderName;
        this.dataForm.folderPath =  data.folderPath;
        this.ruleCheckData = data;
        this.treeVisible=false;
      },
      // 规则树设置当前选中节点
      menuListTreeSetCurrentNode () {
        if (this.dataForm.folderId) {
          if (this.$refs.menuListTree) {
            this.$refs.menuListTree.setCurrentKey(this.dataForm.folderId);
          }
          this.dataForm.parentName = this.getTreeData(this.treeData,this.dataForm.folderId)[0].folderName;
        }

      },
      // 通过folderId 获取对应的item
      getTreeData (treeData,folderId) {
          const getTreeDataItem = [];
          const traverse = function(treeData,folderId) {
              treeData.map(i => {
                  if (i.folderId == folderId) {
                      getTreeDataItem.push(i);
                  }
                  if (i.children) {
                    traverse(i.children, folderId);
                  }
              })

          }
          traverse(treeData,folderId)
          return getTreeDataItem
      },
    getSelectPage() {
      // 判断不选左侧规则节点列表为空
      if (!this.ruleCheckData.folderId) {
        this.$message({ message: "请选择对应的规则分类", type: "warning" });
        return;
      }
      this.tableLoading = true;
      // 如何改规则节点有子节点的话folderId为空
      if (this.ruleCheckData.children) {
        this.searchForm.folderId = "";
      }
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl(
          `/rule/selectPage?pageNo=${this.Pager.pageIndex}&pageSize=${this.Pager.pageSize}`
        ),
        method: "get",
        params: this.$http.adornParams(this.searchForm, false)
      })
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.code == 200) {
            data.result.records.map(i => {
              i.createTime = i.createTime;
              i.ruleCategory =
                i.ruleCategory == 1
                  ? "门诊规则"
                  : i.ruleCategory == 2
                  ? "住院规则"
                  : "";
            });
            this.tableData = data.result.records;
            this.Pager.pageSize = data.result.size;
            this.Pager.pageIndex = data.result.current;
            this.Pager.total = data.result.total;
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        console.log(this.dataForm)
        this.$http({
          url: this.$http.adornUrl('/demandCollaboration/selectAllList'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNo': this.pageIndex,
            'pageSize': this.pageSize,
            'projectId': this.projectId,
            'demandName': this.dataForm.demandName||null,
            'examineStatus': this.dataForm.examineStatus||null,
            'folderId': this.dataForm.folderId||null,
            'ruleCategory': this.dataForm.ruleCategory||null
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.result.records;
            this.totalPage = data.result.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.multipleTable = val
      },
      //查看详情
      detail(data) {
        this.title = "需求详情";
        this.id = data.DEMANDCOLLABORATIONID;
        this.showBtn = false;
        this.readonly = true;
        this.demandCollaboration = data;
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.projectId,this.ruleCheckData)
        })
      },
      // 新增
      addHandle () {
        this.showBtn = true;
        this.readonly = false;
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.projectId,this.ruleCheckData)
        })
      },
      // 修改
      updateHandle () {
        if (this.multipleTable.length != 1)
        return this.$message({
          message: "请选择一条数据进行编辑",
          type: "warning"
        });
        if (this.multipleTable[0].EXAMINESTATUS != "0")
        return this.$message({
          message: "已提交的需求不可修改",
          type: "warning"
        });
        this.showBtn = true;
        this.readonly = false;
        this.demandCollaboration = this.multipleTable[0];
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.projectId,this.ruleCheckData)
        })
        this.multipleTable = []
      },
      //提交
      submitHandle () {
        if (this.multipleTable.length === 0)
        return this.$message({
          message: "请选择至少一条数据",
          type: "warning"
        });

        let flag = false
        this.multipleTable.forEach(item => {
          if (item.EXAMINESTATUS != "0"){
            flag = true
          }

          this.demandCollaborationIds.push(item.DEMANDCOLLABORATIONID)
        })

        if(flag === false){
          this.submitPersonVisible = true
        }else{
          return this.$message({
          message: "已提交不能重复提交",
          type: "warning"
        });
        }

        this.$nextTick(() => {
          this.$refs.submitPerson.init()
        })
        this.multipleTable = []
      },
      deleteFn() {
      if (this.multipleTable.length === 0)
        return this.$message({
          message: "请选择至少一条数据",
          type: "warning"
        });
      var deleteList = [];
      this.multipleTable.forEach(item => {
        deleteList.push(item.DEMANDCOLLABORATIONID);
      });
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            isLoading: false,
            url: this.$http.adornUrl("/demandCollaboration/deleteByIds"),
            method: "DELETE",
            data: this.$http.adornData(deleteList, false)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({ message: "删除成功", type: "success" });
              // this.Pager.pageIndex = 1;
              // this.Pager.pageSize = 10;
              // this.getSelectPage();
              this.setTableChecked();
              this.multipleTable = []
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
      },
      setTableChecked() {
        this.multipleTable = [];
        this.$refs.multipleTable.clearSelection(this.multipleTable);
      },
    }
  }
</script>
