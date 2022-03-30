<template>
  <div>
    <div class="box" >
      <div class="left list-left-tree" :style="{height:(tableHeight+120)+'px'}">
        <div class="custom-tree-container">
         <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
           <el-tree
            class="treeClass"
            :data="treeData"
            :props="defaultProps"
            node-key="regionId"
            default-expand-all
            @node-click="nodeClick"
            :expand-on-click-node="false">
          </el-tree>
        </div>
      </div>
      <div class="right" :style="{height:(tableHeight+120)+'px'}">
        <el-form
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="getDataList()"
        >
          <el-form-item label="政策名称:">
            <el-input
              v-model="dataForm.policyName"
              placeholder="政策名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="有效时间:">
            <el-date-picker
              v-model="dataForm.endTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="文件内容:">
            <el-input
              v-model="dataForm.createUserName"
              placeholder="文件内容"
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
          <el-button type="primary" :disabled="dataForm.regionId==''" @click="addOrUpdateHandle('')"
            >新增</el-button
          >
          <el-button
            type="warning"
            @click="ruleExport('all')"
            :loading="ruleExportAllLoading"
            >全部导出</el-button
          >
          <el-button
            type="warning"
            @click="ruleExport('one')"
            :loading="ruleExportLoading"
            >导出</el-button
          >
          <!--<el-button type="danger" @click="getDataList()">删除</el-button>-->
        </div>
        <el-table
          :height="tableHeight-tableMinus"
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
          <el-table-column prop="policyName" align="center" label="政策名称">
          </el-table-column>
          <el-table-column
            prop="beginTime"
            header-align="center"
            align="center"
            label="开始时间"
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            header-align="center"
            align="center"
            label="有效时间"
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
                @click="addOrUpdateHandle(scope.row.ruleId)"
                >修改
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteHandle(scope.row.ruleId)"
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
      </div>
    </div>
    <el-dialog :title="treeTitle" :visible.sync="treeVisible">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeVisible = false">取 消</el-button>
        <el-button type="primary" @click="treeVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      :ruleData="ruleData"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./policy-add-or-update";
import ruleTree from "../../common/rule-tree.vue";
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
        policyName: "",
        endTime: "",
        regionId: "", //行政区划分主键
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
    ruleTree,
    AddOrUpdate,
  },
  activated() {

  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    //左侧树节点点击
    nodeClick(data,node,ele){
      this.dataForm.regionId=data.regionId;
      this.getDataList();
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      if (id) {
        this.$refs.addOrUpdate.init(id, this.dataForm.regionId);
      } else {
        this.$refs.addOrUpdate.init("", this.dataForm.regionId);
      }

      // })
    },
    // 获取左侧树
    getTreeData() {
      this.$http({
        url: this.$http.adornUrl("region/getRegion"),
        method: "get",
        params: this.$http.adornParams(),
        isLoading:false,
      }).then(({ data }) => {
        this.treeData = data.result;
      });
    },
    //重置点击
    reset() {
      this.dataForm.ruleName = "";
      this.dataForm.createUserName = "";
      this.pageIndex = 1;
      this.pageSize = 10;
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        isLoading: false,
        url: this.$http.adornUrl("/policy/selectPage"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          policyName: this.dataForm.policyName,
          endTime: this.dataForm.endTime,
          regionId: this.dataForm.regionId,
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
      let ruleIds = "";
      // 判断是否为全部导出，全部导出的话exportList为空列表
      if (isAll == "one") {
        // 单个导出
        if (this.dataListSelections.length === 0)
          return this.$message({
            message: "请选择至少一条数据",
            type: "warning"
          });
        this.dataListSelections.forEach(item => {
          exportList.push(item.ruleId);
        });
        // this.ruleExportLoading = true
        ruleIds = exportList.join(",");
      } else {
        // 全部导出
        // this.ruleExportAllLoading = true;
        ruleIds = "";
      }
      window.location.href =
        this.$http.adornUrl("/rule/ruleExport?token=") +
        this.$cookie.get("token") +
        "&ruleIds=" +
        ruleIds;
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
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.userId;
          });
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/policy/delete/"+id),
            method: "delete",
            // data: this.$http.adornData(userIds, false)
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
</style>
