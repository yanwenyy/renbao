<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="底稿名称：">
        <el-input
          v-model="dataForm.manuscriptName"
          placeholder="底稿名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="关联规则名称：">
        <el-input
          v-model="dataForm.ruleName"
          placeholder="关联规则名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          :disabled="this.multipleSelection.length <= 0"
          type="primary"
          @click="downLoad"
          >导出报告</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :height="tableHeight"
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
        prop="manuscriptCode"
        header-align="center"
        align="center"
        label="底稿编码"
      >
      </el-table-column>
      <el-table-column
        prop="manuscriptName"
        header-align="center"
        align="center"
        label="底稿名称"
      >
      </el-table-column>
      <el-table-column
        prop="ruleName"
        header-align="center"
        align="center"
        label="关联规则名称"
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
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"
      >
      </el-table-column>
      <!-- <el-table-column header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="downLoad(scope.row)">下载</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataForm: {
        ruleName: "",
        manuscriptName: ""
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
      //授权用户弹窗
      // showAuthorityUser: false,
      //传给修改弹窗的子组件id
      id: "",
      //弹窗标题
      title: "",
      //弹窗按钮
      showBtn: ""
    };
  },
  computed: {
    tableHeight: {
      get() {
        return this.$store.state.common.tableHeight;
      }
    }
  },
  components: {
    // addOrUpdate,
    // authorityUser
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      // this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/manuscript/selectManuscriptPage"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          manuscriptName: this.dataForm.manuscriptName,
          ruleName: this.dataForm.ruleName
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.result.records;
          this.totalPage = data.result.total;
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
      this.showAddDialog = true;
      this.title = "新增角色";
      this.showBtn = true;
      this.id = "";
    },
    //修改
    editHandle(data) {
      this.showAddDialog = true;
      this.title = "修改角色";
      this.id = data.roleId;
      this.showBtn = true;
      this.readonly = false;
    },
    //查看详情
    detail(data) {
      this.showAddDialog = true;
      this.title = "查看角色";
      this.id = data.roleId;
      this.showBtn = false;
      this.readonly = true;
    },
    //关闭新增/修改弹窗
    closeAddDrawer() {
      this.showAddDialog = false;
    },
    addSucceed() {
      this.closeAddDrawer();
      this.getDataList();
    },
    //关闭授权用户弹窗
    /* close() {
      this.showAuthorityUser = false;
    }, */
    //授权用户弹窗关闭
    succeed() {
      this.close();
    },
    //导出报告
    downLoad() {
      var ids = "";
      this.multipleSelection.forEach(item => {
        ids += item.manuscriptId + ",";
      });
      if (ids.length > 0) {
        ids = ids.substr(0, ids.length - 1);
      }
      let url =
        this.$http.adornUrl(
          "/manuscript/reportExport?manuscriptIds=" + ids + "&token="
        ) + this.$cookie.get("token");
      window.open(url);
    },
    //查询
    search() {
      this.getDataList();
    },
    //重置
    reset() {
      this.dataForm = {
        ruleName: "",
        manuscriptName: ""
      };
      this.pageIndex = 1
      this.getDataList();
    },
    // 删除
    deleteHandle(data) {
      var roleId = data.roleId;
      this.$confirm(`确定进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/role/delete/" + roleId),
            method: "post"
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
              this.$message.error("操作失败");
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
