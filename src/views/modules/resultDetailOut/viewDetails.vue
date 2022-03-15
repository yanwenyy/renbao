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
                <vue-query-builder
                :rules="rules"
                class="mask"
                v-show="show"
                v-model="output"
                ></vue-query-builder>
            </transition>
            <el-table
                :data="tableList"
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
                    width
                    show-overflow-tooltip
                ></el-table-column>
                </template>
            </el-table>
            </div>
            <div>
            <el-pagination
                small
                layout="total, sizes, prev, pager, next, jumper"
                :total="apComServerData.total"
            ></el-pagination>
            </div>
            <!-- <el-button type="primary" @click="ok">确定</el-button> -->
            <el-button @click="close">关闭</el-button>
        </div>
    </el-dialog> 
 
</template>
<script>
import VueQueryBuilder from "@/views/modules/dataAcquisition/VueQueryBuilder.vue";
export default {
  components: {
    VueQueryBuilder
  },
  data() {
    return {
    showDetailDialog: false,
      dataForm: {
        basicName: "",
        basicType: "",
        data2: "",
        data1: ""
      },
      apComServerData: {
        total: ""
      },
      //loading
      listLoading: false,
      importVisible: false,
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
      viewDetailsData: []
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

    },
    // 导出
    reportList () {

    },
    //初始化数据列表
    initList() {
        console.log({
          tableName: this.viewDetailsData.resultTableName,
          resultId: this.viewDetailsData.resultId
        }, '查询参数')
      this.$http({
        url: this.$http.adornUrl("/dataInfoBase/getTableDataList"),
        method: 'get',
        params: this.$http.adornParams({
          tableName: this.viewDetailsData.resultTableName,
          resultId: this.viewDetailsData.resultId
        }, false)
      }).then(({ data }) => {
        if (data && data.code === 200) {
            console.log(data, 'datadatadata')
          this.tableColumns = data.result.columns;
          this.tableList = data.result.result;
          // this.apComServerData.total;
        } else {
          this.tyqab = [];
          this.apComServerData.total = 0;
        }
      });
    },
    //重置
    resetForm() {},
    //查询
    getDataList() {},
    //确定
    ok() {
      this.$emit("ok");
    },
    //取消
    close() {
      this.$emit("close");
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
    },
    //查询条件事件
    handleChange() {
      this.show = !this.show;
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
