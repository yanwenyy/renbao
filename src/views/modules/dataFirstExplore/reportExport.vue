<!--初探报告导出-->
<template>
  <div class="threeData">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.reportName"
          placeholder="报告名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" placeholder="报告状态" clearable>
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="addOrEditData(0)">新增</el-button>
        <el-button
          type="primary"
          :disabled="
            this.multipleSelection.length <= 0 ||
              this.multipleSelection.length > 1
          "
          @click="addOrEditData(1)"
          >修改</el-button
        >
        <el-button
          type="danger"
          :disabled="this.multipleSelection.length <= 0"
          @click="deleteData()"
          >删除</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="listDisplay">
      <el-table
        :data="tableList"
        border
        style="100%"
        overflow-y:auto
        height="400px"
        :header-cell-style="{ textAlign: 'center' }"
        class="demo-ruleForm"
        v-loading="listLoading"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="basicName"
          header-align="center"
          align="center"
          label="报告名称"
        ></el-table-column>
        <el-table-column
          prop="basicCode"
          header-align="center"
          align="center"
          label="报告模板"
        ></el-table-column>
        <el-table-column
          prop="administration"
          header-align="center"
          align="center"
          label="开始时间"
        >
        </el-table-column>
        <el-table-column
          prop="basicType"
          header-align="center"
          align="center"
          label="结束时间"
        ></el-table-column>
        <el-table-column
          prop="basicType"
          header-align="center"
          align="center"
          label="状态"
        >
          <template slot-scope="scope">
            <div type="primary" v-if="scope.row.status == 1">执行中</div>
            <div type="primary" v-if="scope.row.status == 2">执行失败</div>
            <div type="primary">已完成</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          header-align="center"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="warning" @click="downLoad(scope.row.id)"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--新增/修改弹窗 -->
    <el-dialog
      :visible.sync="showAddOrEditDialog"
      :title="title"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="30%"
      :close-on-press-escape="false"
    >
      <addOrEdit
        @close="close"
        @ok="succeed"
        v-if="showAddOrEditDialog"
        :info="info"
      ></addOrEdit>
    </el-dialog>
  </div>
</template>
<script>
import addOrEdit from "./component/reportExport-addOrEdit.vue";
export default {
  components: {
    addOrEdit
  },
  data() {
    return {
      dataForm: {
        basicName: "",
        basicType: ""
      },
      showAddOrEditDialog: false,
      //loading
      listLoading: false,
      //弹窗标题
      title: "",
      //多选
      multipleSelection: [],
      //table表格数据
      tableList: [],
      tableColumns: [],
      info: "",
      status: [
        {
          value: "0",
          label: "三级甲等"
        },
        {
          value: "1",
          label: "三级乙等"
        },
        {
          value: "2",
          label: "三级丙等"
        }
      ]
    };
  },
  created() {
    this.initList();
  },
  methods: {
    //初始化数据列表
    initList() {
      this.$http({
        url: this.$http.adornUrl("/ruleReport/selectPage"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: this.pageIndex,
          pageSize: this.pageSize
        },false)
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
    //新增、修改弹窗
    addOrEditData(val) {
      this.showAddOrEditDialog = true;
      if (val == 0) {
        this.title = "新增报告";
        this.info = "";
      } else {
        this.title = "修改报告";
        this.info = this.multipleSelection[0].reportId;
      }
    },
    //删除
    deleteData() {},
    //重置
    resetForm() {},
    //查询
    search() {
      this.initList();
    },
    // 页数
    handleSizeChange(val) {
      this.apComServerData.size = val;
      this.initList();
    },
    //当前页
    handleCurrentChange(val) {
      this.apComServerData.pageNum = val;
      this.initList();
    },
    //下载
    downLoad() {},
    //确定
    succeed() {
      this.close();
      this.initList();
    },
    //取消
    close() {
      this.showAddOrEditDialog = false;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.f_right {
  float: right;
  padding: 5px;
}
.line {
  text-align: center;
}
</style>
