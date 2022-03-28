<!-- 医院基本信息 -->
<template>
  <div class="threeData">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="医疗机构名称:">
        <el-input
          v-model="dataForm.hospitalName"
          placeholder="请输入搜索内容"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="医疗机构类别:">
        <el-select
          v-model="dataForm.hospitalType"
          placeholder="请输入搜索内容"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年度医保基金支付总额:">
        <el-col :span="11">
          <el-input
            placeholder="请输入搜索内容"
            v-model="dataForm.moneyStart"
            style="width: 100%;"
          ></el-input>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-input
            placeholder="请输入搜索内容"
            v-model="dataForm.moneyEnd"
            style="width: 100%;"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item style="float:right;padding:5px;">
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="warning" @click="templateExport">下载模板</el-button>
        <el-button type="warning" @click="exportData">导出数据</el-button>
        <el-button type="warning" @click="importData">导入数据</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="listDisplay">
      <!-- <div class="f_right"> -->
      <!-- <el-button type="warning" @click="templateExport">下载模板</el-button>
        <el-button type="warning" @click="exportData">导出数据</el-button>
        <el-button type="warning" @click="importData">导入数据</el-button> -->
      <!-- </div> -->
      <el-table
        ref="multipleTable"
        :data="tableList"
        border
        style="100%"
        :height="'calc(56vh - 10px)'"
        class="demo-ruleForm"
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <template v-for="(item, index) in tableColumns" width="55">
          <el-table-column
            :prop="item"
            :label="item"
            :key="index"
            width
            show-overflow-tooltip
          ></el-table-column>
        </template>
      </el-table>
      <!-- <el-pagination
                :page-size="apComServerData.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="apComServerData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="apComServerData.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                ></el-pagination> -->
    </div>
    <el-dialog title="导入数据" :visible.sync="importVisible" append-to-body>
      <el-form size="small" label-width="80px">
        <el-form-item label="是否去重" prop="duplicateRemove"
          ><el-checkbox v-model="duplicateRemove"></el-checkbox
        ></el-form-item>
        <el-form-item label="导入类型" prop="importType">
          <el-select v-model="importType" placeholder="请选择">
            <el-option
              v-for="item in selectOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入文件" prop="ruleFile" style="margin-top:5px;">
          <el-upload
            class="upload-demo"
            action=""
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :http-request="uploadFile"
            multiple
            :limit="1"
            :file-list="fileList"
            :on-change="handleChange"
            :on-remove="handleRemove"
            ref="ruleFileUpload"
          >
            <el-button size="small" type="primary" @click="handlePreview"
              >选择文件</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataForm: {
        hospitalName: "",
        hospitalType: "",
        moneyEnd: "",
        moneyStart: ""
      },
      tableLoading: false,
      //loading
      dataListLoading: false,
      importVisible: false,
      apComServerData: {
        current: 1,
        size: 10000,
        pageNum: 1,
        total: 0,
        pageIndex: 1
      },
      tableList: [],
      tableColumns: [],
      options: [
        {
          value: "三级甲等",
          label: "三级甲等"
        },
        {
          value: "三级乙等",
          label: "三级乙等"
        },
        {
          value: "三级丙等",
          label: "三级丙等"
        }
      ],
      fileList: [],
      selectOption: [
        {
          value: "0",
          label: "删除现有数据"
        },
        {
          value: "1",
          label: "保留现有数据"
        }
      ],
      catalogType: 10,
      multipleSelection: [],
      hospitalType: {
        yljgbm: "",
        yljgmc: ""
      },
      dataRuleList: {
        importType: [
          { required: true, message: "请选择导入类型", trigger: "blur" }
        ]
      },
      duplicateRemove: false,
      importType: ""
    };
  },
  created() {
    this.token = this.$cookie.get("token");
  },
  mounted() {
    this.getInitList();
  },
  methods: {
    //初始化数据列表
    getInitList() {
      this.tableLoading = true;
      this.$http({
        url: this.$http.adornUrl("/hospitalBasicInfo/getPageList"),
        method: "get",
        params: this.$http.adornParams({
          hospitalName: this.dataForm.hospitalName,
          hospitalType: this.dataForm.hospitalType,
          moneyEnd: this.dataForm.moneyEnd,
          moneyStart: this.dataForm.moneyStart,
          pageCount: this.apComServerData.current,
          pageNum: this.apComServerData.pageIndex,
          pageSize: this.apComServerData.size
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableList = data.result.result;
          this.tableColumns = data.result.columns;
          // this.apComServerData.total = data.result.pagination.dataCount
        } else {
          this.tableList = [];
          this.apComServerData.total = 0;
        }
        this.tableLoading = false;
      });
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.$set(
          this.multipleSelection[i],
          "yljgbm",
          this.multipleSelection[i].医疗机构编码
        );
        this.$set(
          this.multipleSelection[i],
          "yljgmc",
          this.multipleSelection[i].医疗机构名称
        );
      }
    },
    //上传文件事件
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log(this.fileList);
    },
    uploadFile() {
      let arrDuplicate = "";
      if (this.duplicateRemove == false) {
        arrDuplicate = 0;
      } else if (this.duplicateRemove == true) {
        arrDuplicate = 1;
      }
      if (this.importType.length == 0) {
        this.$message({
          message: "请选择要采集的文件！",
          type: "error"
        });
        return;
      }
      let formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      this.$http({
        url: this.$http.adornUrl("/threeCatalog/dataImportCommonMethod"),
        method: "post",
        data: formData,
        params: this.$http.adornParams({
          importType: this.importType,
          duplicateRemove: arrDuplicate,
          catalogType: 10
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            message: "导入成功",
            type: "success",
            onClose: () => {
              this.importVisible = false;
              this.getInitList();
            }
          });
        } else {
          this.$message.error(data.message);
        }
      });
    },
    //文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.fileList = [];
    },

    handlePreview() {
      this.fileList = [];
    },
    //重置
    resetForm() {
      this.dataForm.hospitalName = '',
      this.dataForm.hospitalType = '',
      this.dataForm.moneyEnd = '',
      this.dataForm.moneyStart = ''
      this.apComServerData.pageIndex = 1
    },
    //查询
    getDataList() {
      this.getInitList();
    },
    //导入
    importData() {
      this.importVisible = true;
      this.fileList = [];
      this.duplicateRemove = false;
      this.importType = "";
    },
    //导出
    exportData() {
      let url =
        this.$http.adornUrl(
          "/threeCatalog/excelDataExport?catalogType=" +
            this.catalogType +
            "&token="
        ) + this.$cookie.get("token");
      window.open(url);
    },
    //模板导出
    templateExport() {
      let url =
        this.$http.adornUrl(
          "/threeCatalog/exportExcelFileCommon?catalogType=" +
            this.catalogType +
            "&token="
        ) + this.$cookie.get("token");
      window.open(url);
    },

    // 关闭弹窗确认
    importSucceed() {
      this.closeimportDrawer();
    },
    closeimportDrawer() {
      this.importVisible = false;
    },
    // 页数
    handleSizeChange(val) {
      this.apComServerData.size = val;
      this.apComServerData.pageIndex = 1;
      this.getInitList();
    },
    //当前页
    handleCurrentChange(val) {
      this.apComServerData.pageIndex = val;
      this.getInitList();
    },
    // 重置医院页面
    reSetHospital() {
      this.resetForm("dataForm");
      this.multipleSelection = [];
      this.$refs.multipleTable.clearSelection(this.multipleSelection);
    },
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
.el-form-item {
  margin-bottom: 0;
}
</style>
