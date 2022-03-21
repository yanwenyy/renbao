<template>
  <div class="threeData">
    <!-- 列表 -->
    <div class="listDisplay" style="height:500px;overflow-y:auto;">
      <div class="f_right">
        <el-button type="primary" @click="searchList">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="warning" @click="reportList">导出</el-button>
      </div>
      <!-- 复杂条件查询 -->
      <div @click="handleChange" style="cursor:pointer">
        查询条件<i
          v-show="!show"
          class="el-icon-arrow-down"
          style="padding-left:5px"
        ></i
        ><i v-show="show" class="el-icon-arrow-up" style="padding-left:5px"></i>
      </div>
      <transition name="sub-comments">
        <myquerybuilder
          ref="myquerybuilder"
          :rules="queryRules"
          class="mask"
          v-if="show"
          v-model="output"
          :columns="selectColumns"
          :data="data"
        ></myquerybuilder>
      </transition>
      <el-table
        :data="tableList"
        border
        style="100%"
        :header-cell-style="{ textAlign: 'center' }"
        class="demo-ruleForm"
        :v-loading="listLoading"
      >
        <template v-for="(item, index) in tableColumns">
          <el-table-column
            :prop="item"
            :label="item"
            :key="index"
            width
            show-overflow-tooltip
          ></el-table-column>
        </template>
      </el-table>
    </div>
    <div>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="apComServerData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="apComServerData.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="apComServerData.size"
      ></el-pagination>
    </div>
    <!-- <el-button type="primary" @click="ok">确定</el-button> -->
    <el-button @click="close">关闭</el-button>
  </div>
</template>
<script>
import myquerybuilder from "@/views/modules/dataAcquisition/myquerybuilder.vue";
export default {
  props: {
    info: String,
    resultTableName: String
  },
  components: {
    myquerybuilder
  },
  data() {
    return {
      //分页
      apComServerData: {
        current: 1,
        size: 10,
        pageNum: 1,
        total: 0,
        pageIndex: 1
      },
      //loading
      listLoading: false,
      importVisible: false,
      show: false,
      output: {},
      //table表格数据
      tableList: [],
      tableColumns: [],
      queryRules: [],
      // resultTableName: "",
      data: [],
      selectColumns: {},
      sqlData: "",
      columnType: "",
      dataForm1: {
        resultTableName: ""
      }
    };
  },
  created() {},
  mounted() {
    this.initList();
  },
  methods: {
    //初始化数据列表
    initList() {
      this.listLoading = true;
      this.$http({
        url: this.$http.adornUrl("dataInfoBase/getTableDataListByPage"),
        method: "get",
        params: this.$http.adornParams({
          tableName: this.resultTableName,
          resultId: this.info,
          complexWhere: this.sqlData,
          pageNum: this.apComServerData.pageIndex,
          pageSize: this.apComServerData.size
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableColumns = data.result.data.columns;
          this.tableList = data.result.data.result;
          this.selectColumns = data.result.data.columnInfo;
          this.apComServerData.total = data.result.total;
          this.listLoading = false;
        } else {
          this.tableColumns = [];
          this.apComServerData.total = 0;
          this.listLoading = false;
        }
      });
    },
    //重置
    resetForm() {
      this.sqlData = ''
      this.initList();
    },
    //确定
    /*  ok() {
      this.$emit("ok");
    }, */
    //取消
    close() {
      this.$emit("close");
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查询
    searchList() {
      this.listLoading = true;
      var getSql = this.$refs.myquerybuilder.getSelectSql();
      this.sqlData = getSql.sql;
      this.initList();
    },
    //导出
    reportList() {
      this.dataForm1.resultTableName = this.resultTableName;
      this.$http
        .post(this.$http.adornUrl("ruleResult/viewExport"), this.dataForm1, {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json; application/octet-stream"
          }
        })
        .then(response => {
          this.exportExcel(response, "数据导出");
          // this.loading = false;
          this.$message({
            // message: data.message,
            message: "导出成功",
            type: "success",
            duration: 1500
          });
          this.detailExportDialog = false;
        });
    },
    //导出excel处理方法
    exportExcel(response, fileName) {
      let data = response.data;
      let fileReader = new FileReader();
      fileReader.onload = function() {
        try {
          let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
          if (jsonData.code) {
            that.$message.error(jsonData.message);
          }
        } catch (err) {
          // 解析成对象失败，说明是正常的文件流
          const blob = new Blob([response.data], { type: "application/x-xls" });
          const filename = response.headers["content-disposition"];
          const downloadElement = document.createElement("a");
          const href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          [downloadElement.download] = [fileName + ".xls"];
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放blob对
        }
      };
      fileReader.readAsText(data);
    },
    //复杂查询展开事件
    handleChange() {
      this.selectColumns = this.selectColumns;
      this.show = !this.show;
      this.data = this.output;
    },
    // 页数
    handleSizeChange(val) {
      this.apComServerData.size = val;
      this.apComServerData.pageIndex = 1;
      this.initList();
    },
    //当前页
    handleCurrentChange(val) {
      this.apComServerData.pageIndex = val;
      this.initList();
    }
  }
};
</script>
<style lang="scss" scoped>
.f_right {
  float: right;
  padding: 5px;
}
.mask {
  width: 95%;
  padding-top: 15px;
  position: fixed;
  z-index: 998;
  overflow: hidden;
}
.sub-comments-leave-active,
.sub-comments-enter-active {
  transition: all 1s ease;
}
.sub-comments-leave-active,
.sub-comments-enter {
  height: 0px !important;
}
.sub-comments-leave,
.sub-comments-enter-active {
  height: 500px;
}
</style>
