<template>
  <div>
    <div class="box" >
      <div class="left list-left-tree" :style="{height:(tableHeight+100)+'px'}">
        <div class="custom-tree-container">
         <el-input
           clearable
            class="filter-text"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
           <el-tree
            ref="tree"
            class="treeClass"
            :data="treeData"
            :props="defaultProps"
            node-key="regionId"
            default-expand-all
            @node-click="nodeClick"
            :filter-node-method="filterNode"
            :expand-on-click-node="false">
          </el-tree>
        </div>
      </div>
      <div class="right" :style="{height:(tableHeight+120)+'px'}">
        <el-form
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="getDataList()"
          class="search-form-new"
        >
          <el-form-item label="政策名称：">
            <el-input
              v-model="dataForm.policyName"
              placeholder="政策名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="有效时间：">
            <!--<el-date-picker-->
              <!--value-format="yyyy-MM-dd"-->
              <!--v-model="dataForm.endTime"-->
              <!--type="date"-->
              <!--placeholder="选择日期">-->
            <!--</el-date-picker>-->
            <el-date-picker
              :picker-options="pickerOptionsStart"
              v-model="dataForm.endStartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
            <span>--</span>
            <el-date-picker
              :picker-options="pickerOptionsEnd"
              v-model="dataForm.endStopTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <!--<el-form-item label="文件内容：">-->
            <!--<el-input-->
              <!--v-model="dataForm.createUserName"-->
              <!--placeholder="文件内容"-->
              <!--clearable-->
            <!--&gt;</el-input>-->
          <!--</el-form-item>-->
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
          <!--<el-button-->
            <!--type="warning"-->
            <!--@click="ruleExport('all')"-->
            <!--:loading="ruleExportAllLoading"-->
            <!--&gt;全部导出</el-button-->
          <!--&gt;-->
          <el-button
            :disabled="dataListSelections.length==0"
            type="warning"
            @click="ruleExport('one')"
            :loading="ruleExportLoading"
            >导出</el-button
          >
          <el-button type="danger" @click="deleteHandle()"  :disabled="dataListSelections.length <= 0">删除</el-button>
        </div>
        <el-table
          :height="tableHeight-140"
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
          <el-table-column
            type="index"
            header-align="center"
            align="center"
            width="80"
            label="序号"
            :index="indexMethod"
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
                @click="addOrUpdateHandle(scope.row.policyId)"
                >修改
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteHandle(scope.row.policyId)"
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
      // 开始日期 :picker-options 中引用
      pickerOptionsStart: {
        disabledDate: time => {
          // 获取结束日期的 v-model 值并赋值给新定义的对象
          let endDateVal = this.dataForm.endStopTime;
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
          let beginDateVal = this.dataForm.endStartTime;
          if (beginDateVal) {
            // 比较 距 1970 年 1 月 1 日之间的毫秒数：
            return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        }
      },
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
        endStopTime: "",
        endStartTime: "",
        regionId: "", //行政区划分主键
        regionPath: "", //行政区划分path
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
    // 序号翻页递增
    indexMethod(index) {
      // console.log("索引数下标", index);
      let nowPage = this.pageIndex; //当前第几页，根据组件取值即可
      let nowLimit = this.pageSize; //当前每页显示几条，根据组件取值即可
      return index + 1 + (nowPage - 1) * nowLimit; // 这里可以理解成一个公式
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.regionName.indexOf(value) !== -1;

    },
    //左侧树节点点击
    nodeClick(data,node,ele){
      var _list=this.getParentName(node,'regionName');
      this.dataForm.regionPath=_list.join("-");
      this.dataForm.regionId=data.regionId;
      this.getDataList();
    },
    getParentName(obj,name){
      const list=[];
      function _getName(obj){
        obj.data[name]&&list.unshift(obj.data[name]);
        if(obj.parent){
          _getName(obj.parent,name)
        }
      }
      _getName(obj,name);
      return list;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      if (id) {
        this.$refs.addOrUpdate.init(id, this.dataForm.regionId);
      } else {
        this.$refs.addOrUpdate.init("", this.dataForm.regionId,this.dataForm.regionPath);
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
      this.dataForm.policyName = "";
      this.dataForm.endStopTime = "";
      this.dataForm.endStartTime = "";
      this.dataForm.createUserName = "";
      this.pageIndex = 1;
      this.pageSize = 10;
      this.getDataList();
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
          endStopTime: this.dataForm.endStopTime,
          endStartTime: this.dataForm.endStartTime,
          regionId: this.dataForm.regionId,
          regionPath: this.dataForm.regionPath,
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
      var policyIds = id ? [id] : this.dataListSelections.map(item => {
            return item.policyId;
          });
      console.log(policyIds)
      this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$http({
            url: this.$http.adornUrl("/policy/deleteByIds"),
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
        this.dataForm.endStartTime +
        "&timeEnd=" +
        this.dataForm.endStopTime +
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
  >>>.el-tree-node:focus > .el-tree-node__content ,>>>.el-tree-node.is-current{
    background: #E0EDFA;
  }
</style>
