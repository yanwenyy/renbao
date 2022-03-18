<template>
    <el-dialog
        :visible.sync="showDetailDialog"
        title="查看结果明细"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        width="90%"
        :close-on-press-escape="false"
        :before-close="handleClose"
        >
        <div class="threeData" style="height:600px">
            <!-- 列表 -->
            <div class="listDisplay" style="height:500px;overflow-y:auto;">
            <div class="f_right">
                <el-button type="primary" @click="searchList">查询</el-button>
                <el-button type="warning" @click="reportList">导出</el-button>
            </div>
            <div @click="handleChange" style="cursor:pointer;">
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
                  v-show="show"
                  v-model="output"
                  :columns="columns"
                  :data="myquerybuilderData"
                ></myquerybuilder>
            </transition>
            <el-table
                :data="tableList"
                v-loading="tableLoading"
                border
                style="100%"
                :header-cell-style="{ textAlign: 'center' }"
                class="demo-ruleForm"
            >
                <template v-for="(item, index) in tableColumns">
                <el-table-column
                    :prop="item"
                    :label="item"
                    :key="index"
                    show-overflow-tooltip
                ></el-table-column>
                </template>
            </el-table>
            </div>
            <div>
            <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="Pager.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="Pager.pageSize"
                :total="Pager.total"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            </div>
            <!-- <el-button type="primary" @click="ok">确定</el-button> -->
            <el-button @click="close">关闭</el-button>
        </div>
    </el-dialog> 
 
</template>
<script>
import myquerybuilder from "@/views/modules/dataAcquisition/myquerybuilder.vue";
export default {
  components: {
    myquerybuilder
  },
  data() {
    return {
        tableLoading: false,
        showDetailDialog: false,
        Pager: {
            pageSize: 10,
            pageIndex: 1,
            total: 0
        },
        show: false,
        output: null,
        //table表格数据
        tableList: [],
        tableColumns: [],
        options: [
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
        ],
        rules: [
            {
            type: "text",
            id: "医疗机构编码",
            label: "医疗机构编码 "
            },
            {
            type: "text",
            id: "医疗机构名称",
            label: "医疗机构名称"
            },
            {
            type: "text",
            id: "结算单据号",
            label: "结算单据号"
            },
            {
            type: "text",
            id: " 住院号",
            label: " 住院号"
            },
            {
            type: "text",
            id: " 结算类别",
            label: " 结算类别"
            },
            {
            type: "text",
            id: "结算日期",
            label: "结算日期"
            },
            {
            type: "text",
            id: "入院科室名称",
            label: "入院科室名称"
            },
            {
            type: "text",
            id: "患者姓名",
            label: "患者姓名"
            }
        ],
        viewDetailsData: [],
        queryRules: [],
        columns: {},
        sqlData: "",
        myquerybuilderData: [],
    };
  },
  created() {
    
  },
  methods: {
    showDialog (data) {
        this.viewDetailsData = data;
        this.showDetailDialog = true;  
        this.initList();
    },
    handleClose () {
        this.showDetailDialog = false;  
    },
    close () {
        this.showDetailDialog = false;  
    },
    // 查询
    searchList () {
      this.tableLoading = true;
      var getSql = this.$refs.myquerybuilder.getSelectSql();
      this.sqlData = getSql.sql;
      this.$http({
        url: this.$http.adornUrl("/threeCatalog/getThreeCatalogDataList"),
        method: "get",
        params: this.$http.adornParams({
          // catalogType: this.ruleForm.catalogType,
          complexWhere: getSql.sql
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableList = data.result.records;
          this.apComServerData.total = data.result.total;
          this.getDataList();
        } else {
          this.dataList = [];
          this.apComServerData.total = 0;
        }
        this.tableLoading = false;
      });

    },
    // 导出
    reportList () {
      this.$http({
        url: this.$http.adornUrl("/threeCatalog/excelDataExport"),
        method: "get",
        responseType: "blob", //解决乱码问题
        params: this.$http.adornParams({
          catalogType: this.ruleForm.catalogType
        })
      }).then(({ data }) => {
      
      
      });

    },
    //初始化数据列表
    initList() {
      this.tableLoading = true
      this.$http({
        url: this.$http.adornUrl("/dataInfoBase/getTableDataList"),
        method: 'get',
        params: this.$http.adornParams({
          tableName: this.viewDetailsData.resultTableName,
          resultId: this.viewDetailsData.resultId
        }, false)
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableColumns = data.result.columns;
          this.tableList = data.result.result;
          // this.apComServerData.total;
        } else {
         
        }
        this.tableLoading = false
      });
    },
    //查询条件事件
    handleChange() {
      this.show = !this.show;
      this.columns = this.columns;
      this.myquerybuilderData = this.output;
    },
    sizeChangeHandle (val) {
        this.Pager.pageSize = val
        this.initList()
    },
    currentChangeHandle (val) {
        this.Pager.pageIndex = val;
        this.initList()
    },
  }
};
</script>
<style lang="scss" scoped>
.f_right {
  float: right;
  padding: 5px;
}
.mask {
  width: 85%;
  padding-top: 23px;
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
