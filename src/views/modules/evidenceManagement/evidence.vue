<!--证据管理-->
<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      class="search-form-new"
    >
      <el-form-item label="证据名称：">
        <el-input
          v-model="dataForm.evidenceName"
          placeholder="证据名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="创建人：">
        <el-input
          v-model="dataForm.createUserName"
          placeholder="创建人"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item style="float:right" v-if="!isShow">
        <el-button
          type="primary"
          :disabled="multipleSelection.length <= 0"
          @click="downLoadFile()"
          >附件下载</el-button
        >
        <el-button type="primary" @click="addHandle()">新增</el-button>
        <el-button
          type="primary"
          @click="editHandle"
          :disabled="
            multipleSelection.length <= 0 || multipleSelection.length > 1
          "
          >修改</el-button
        >
        <el-button
          type="danger"
          @click="deleteHandle"
          :disabled="multipleSelection.length <= 0"
          >删除</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :height="tableHeight - 60"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
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
        prop="evidenceName"
        header-align="center"
        align="center"
        label="证据名称"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">{{
            scope.row.evidenceName
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="fileNames"
        header-align="center"
        align="center"
        label="附件"
      >
        <!-- <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">{{
            scope.row.fileNames
          }}</el-button>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="createUserName"
        header-align="center"
        align="center"
        label="创建人"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="relation"
        header-align="center"
        align="center"
        label="是否被底稿关联"
      >
      </el-table-column>
    </el-table>
    <div style="float:right">
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
    <!-- 弹窗, 新增 / 修改 -->
    <el-dialog
      :visible.sync="showAddDialog"
      :title="title"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="40%"
      :close-on-press-escape="false"
      append-to-body
      custom-class="evidence-dialog"
    >
      <addOrUpdate
        @close="closeAddDrawer"
        @ok="addSucceed"
        v-if="showAddDialog"
        :id="id"
        :showFileTable="showFileTable"
        :showBtn="showBtn"
        :readonly="readonly"
        :manuscriptName="manuscriptName"
      ></addOrUpdate>
    </el-dialog>
  </div>
</template>

<script>
import addOrUpdate from "./evidence-addOrUpdate.vue";
export default {
  props: {
    isShow: Boolean,
    evidenceId: {
      type: String,
      default: null
    }
  },
  components: {
    addOrUpdate
  },
  data() {
    return {
      dataForm: {
        evidenceName: "",
        createUserName: ""
      },
      //列表数据
      dataList: [],
      //当前页
      pageIndex: 1,
      //每页条数
      pageSize: 10,
      //总页数
      totalPage: 0,
      //列表加载
      dataListLoading: false,
      //多选数据
      multipleSelection: [],
      //新增修改弹窗
      showAddDialog: false,
      //传给修改弹窗的子组件id
      id: "",
      //弹窗标题
      title: "",
      //传给弹窗：是否显示附件列表
      showFileTable: false,
      //传给弹窗：是否显示上传按钮
      showBtn: false,
      //传给弹窗：是否只读
      readonly: "",
      //底稿名称
      manuscriptName: ""
    };
  },
  computed: {
    tableHeight: {
      get() {
        return this.$store.state.common.tableHeight;
      }
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
  mounted() {
    this.getDataList();
  },
  methods: {
    // 序号翻页递增
    indexMethod(index) {
      // console.log("索引数下标", index);
      let nowPage = this.pageIndex; //当前第几页，根据组件取值即可
      let nowLimit = this.pageSize; //当前每页显示几条，根据组件取值即可
      return index + 1 + (nowPage - 1) * nowLimit; // 这里可以理解成一个公式
    },
    // 获取数据列表
    getDataList() {
      // this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/evidence/selectPage"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          evidenceName: this.dataForm.evidenceName,
          createUserName: this.dataForm.createUserName,
          projectId: this.projectId
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.result.records;
          this.totalPage = data.result.total;
          this.$nextTick(() => {
            this.dataList.forEach((item, index) => {
              if (item.evidenceId == this.evidenceId) {
                this.$refs.multipleTable.toggleRowSelection(item, true);
              }
            });
          });
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        // this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.multipleSelection = val;
    },
    //新增
    addHandle() {
      if(this.projectId==''||this.projectId==null||this.projectId==undefined){
        this.$message.error("请先在右上角选择项目!");
        return false;
      }
      this.showAddDialog = true;
      this.title = "新增证据";
      this.id = "";
      this.showFileTable = false;
      this.showBtn = true;
      this.readonly = false;
    },
    //修改
    editHandle(data) {
      this.showAddDialog = true;
      this.title = "修改证据";
      this.id = this.multipleSelection[0].evidenceId;
      this.showFileTable = true;
      this.showBtn = true;
      this.readonly = false;
    },
    //查看详情
    detail(data) {
      this.showAddDialog = true;
      this.title = "查看详情";
      this.id = data.evidenceId;
      this.showFileTable = true;
      this.showBtn = false;
      this.readonly = true;
      this.manuscriptName = data.manuscriptName;
    },
    //关闭新增/修改弹窗
    closeAddDrawer() {
      this.showAddDialog = false;
    },
    addSucceed() {
      this.showAddDialog = false;
      this.getDataList();
    },
    succeed() {
      this.close();
    },
    //查询
    search() {
      this.pageIndex = 1;
      this.getDataList();
    },
    //重置
    reset() {
      this.dataForm = {
        roleName: "",
        roleNumber: ""
      };
      this.getDataList();
    },
    // 删除
    deleteHandle() {
      var evidenceIds = [],candel=true;
      this.multipleSelection.forEach(item => {
        evidenceIds.push(item.evidenceId);
        if(item.relation=='是'){
          candel=false;
          return false;
        }
      });
      if(!candel){
        this.$message.error("被底稿关联的数据不能删除!")
      }else{
        this.$confirm(`确定进行删除操作?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl(`/evidence/deleteByEvidenceIds`),
              method: "post",
              data: this.$http.adornData(evidenceIds, false)
            }).then(({ data }) => {
              if (data && data.code === 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.getDataList();
                  }
                });
              } else {
                this.$message.error("操作失败");
              }
            });
          })
          .catch(() => {});
      }

    },
    //附件下载
    downLoadFile() {
      var evidenceIds = "";
      for (var i = 0; i < this.multipleSelection.length; i++) {
        evidenceIds += this.multipleSelection[i].evidenceId + ",";
      }
      if (evidenceIds.length > 0) {
        evidenceIds = evidenceIds.substr(0, evidenceIds.length - 1);
      }
      let url =
        this.$http.adornUrl(
          "/evidence/downloadAttachments?evidenceIds=" + evidenceIds + "&token="
        ) + this.$cookie.get("token");
      window.open(url);
    },
    //是否显示按钮
    showFunction() {
      return false;
    }
  }
};
</script>
<style scoped>
  >>>.el-dialog.evidence-dialog{
    margin-top: 8vh!important;
  }
</style>
