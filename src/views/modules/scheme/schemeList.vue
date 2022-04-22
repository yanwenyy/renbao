<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      class="search-form-new"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.planName"
          placeholder="方案名称"
          clearable
        ></el-input>
        <el-input
          v-model="dataForm.createUserName"
          placeholder="创建人"
          clearable
        ></el-input>
        <el-input
          v-model="dataForm.planCode"
          placeholder="方案编码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="(pageIndex = 1), getDataList()"
        >查询</el-button
        >
        <el-button @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" @click="addOrUpdateHandle('')"
      >新增</el-button
      >
      <!--<el-button type="danger" @click="getDataList()">删除</el-button>-->
    </div>
    <el-table
      :height="tableHeight-50"
      :data="dataList"
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
      <el-table-column prop="planCode" align="center" label="方案编号">
      </el-table-column>
      <el-table-column
        prop="planName"
        header-align="center"
        align="center"
        label="方案名称"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row.planId,'look')">{{
            scope.row.planName
            }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="fileName"
        header-align="center"
        align="center"
        label="方案附件"
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
        prop="createUserName"
        header-align="center"
        align="center"
        label="创建人"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.planId)"
          >修改
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="deleteHandle(scope.row.planId)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      :ruleData="ruleData"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./scheme-add-or-update";
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'regionName'
      },
      treeData:[],
      filterText:'',
      tableMinus:75,
      ruleData: {}, //组件规则数数据
      form: {
        name: ""
      },
      treeTitle: "",
      treeVisible: false,

      path: window.SITE_CONFIG.cdnUrl,
      dataForm: {
        planName: "",
        createUserName: "",
        planCode: "",
      },
      token: "",
      imgUrlfront: "",
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      ImgPreVisible: false,
      drVisibel: false,
      ruleExportLoading: false,
      ruleExportAllLoading: false,
      ruleCheckData: {}
    };
  },
  computed:{
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
    documentClientHeight: {
      get () { return this.$store.state.common.documentClientHeight },

    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    tableMinus(val){
      this.tableMinus=val;
    }
  },
  components: {
    AddOrUpdate,
  },
  activated() {

  },
  mounted() {
    this.getDataList();
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true;
      return data.regionName.indexOf(value) !== -1;

    },
    // 新增 / 修改
    addOrUpdateHandle(id,type) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      if (id) {
        this.$refs.addOrUpdate.init(id, this.dataForm.regionId,null,type);
      } else {
        this.$refs.addOrUpdate.init("", this.dataForm.regionId,this.dataForm.regionPath);
      }

      // })
    },
    //重置点击
    reset() {
      this.dataForm.planName = "";
      this.dataForm.createUserName = "";
      this.dataForm.planCode = "";
      this.pageIndex = 1;
      this.pageSize = 10;
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/plan/selectPage"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          planName: this.dataForm.planName,
          createUserName: this.dataForm.createUserName,
          planCode: this.dataForm.planCode,
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.result.records;
          this.totalPage = data.result.total;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 批量导出
    ruleExport(isAll) {
      var exportList = [];
      let policyIds = "";
      // 判断是否为全部导出，全部导出的话exportList为空列表
      if (isAll == "one") {
        // 单个导出
        if (this.dataListSelections.length === 0)
          return this.$message({
            message: "请选择至少一条数据",
            type: "warning"
          });
        this.dataListSelections.forEach(item => {
          exportList.push(item.policyId);
        });
        // this.ruleExportLoading = true
        policyIds = exportList.join(",");
      } else {
        // 全部导出
        // this.ruleExportAllLoading = true;
        ruleIds = "";
      }
      window.location.href =
        this.$http.adornUrl("/policy/exportData?token=") +
        this.$cookie.get("token") +
        "&policyIds=" +
        policyIds;
    },
    // 导入
    ruleImport() {
      this.$refs.ImportFile.showDialog();
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
      this.dataListSelections = val;
    },
    //图片预览
    preImg(src) {
      this.ImgPreVisible = true;
      this.$nextTick(() => {
        this.$refs.preImgList.init(src);
      });
    },
    imgClose() {
      this.ImgPreVisible = false;
    },
    // 删除
    deleteHandle(id) {
      var policyIds = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.userId;
          });
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$http({
            url: this.$http.adornUrl("/plan/deleteByPlanIds"),
            method: "post",
            data: this.$http.adornData(policyIds, false)
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
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },

    //导入
    handleChange(response, file, fileList) {
      if (response && response.code === 10000) {
        this.$message({
          message: "导入成功",
          type: "success",
          duration: 1500,
          onClose: () => {
            this.getDataList();
            this.drVisibel = false;
          }
        });
      } else {
        this.$message.error(response.msg);
      }
    },
    //导出
    down() {
      var url =
        "/jinding/outcar/port?timeStart=" +
        this.dataForm.timeStart +
        "&timeEnd=" +
        this.dataForm.timeEnd +
        "&tranType=&emissionStand=" +
        this.dataForm.emissionStand +
        "&fuelType=" +
        this.dataForm.fuelType;
      // console.log(url)
      window.open(this.$http.adornUrl(url));
    },
    getTreeId(data) {
      let checkedData = JSON.parse(JSON.stringify(data));
      this.ruleCheckData = data;
      this.dataForm.folderPath = (data.folderPath && data.folderPath) || "";
      this.dataForm.folderId = (data.folderId && data.folderId) || "";
      this.getDataList();
    }
  }
};
</script>
<style scoped>
.search-btn {
  text-align: right;
  margin-bottom: 10px;
}
.tree-btn {
  margin-left: 10px;
}
.tree-btn > .el-button {
  margin-left: 0 !important;
}
.custom-tree-container {
  /*overflow-y: hidden;*/
  overflow-x: auto;
  width: 100%;
  height: 100%;
}
.el-tree {
  min-width: 100%;
  display: inline-block !important;
}
.box {
  width:100%;
  height:100%;
  display: flex;
  justify-content: space-between;
}
.box > div {
  /*height: 73vh;*/
  /*border: 1px solid #ddd;*/
  padding: 1%;
  overflow: auto;
}
.left {
  width: 25%;
  border-right: none;
}
.right {
  width: 75%;
  height: 100%!important;
}

.inline-block {
  display: inline-block;
}
.dr-notice-warn {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background: #ffe5e0;
  color: red;
}
.dr-notice-body {
  padding: 10px;
}
.dr-notice-body > div {
  margin-bottom: 20px;
}
.filter-text {
  width: 80%;
  margin-bottom: 5px;
}
</style>
