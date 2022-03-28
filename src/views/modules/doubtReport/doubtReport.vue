<template>
  <div class="mod-role">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item label="疑点报告名称：">
        <el-input
          v-model="dataForm.roleNumber"
          placeholder="疑点报告名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :height="'calc(56vh)'"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column> -->
      <el-table-column
        prop="draftName"
        header-align="center"
        align="center"
        label="疑点报告名称"
      >
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="报告规则"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">{{
            scope.row.roleName
          }}</el-button>
        </template>
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
      <el-table-column header-align="center" align="center" label="操作">
        <!-- <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row)">修改</el-button>
          <el-button type="text" @click="deleteHandle(scope.row)"
            >删除</el-button
          >
        </template> -->
        <template slot-scope="scope">
          <el-button type="text" @click="downLoad(scope.row)">下载</el-button>
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
    <el-dialog
      :visible.sync="showAddDialog"
      :title="title"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="40%"
      :close-on-press-escape="false"
    >
      <addOrUpdate
        @close="closeAddDrawer"
        @ok="addSucceed"
        v-if="showAddDialog"
        :id="id"
        :showBtn="showBtn"
        :readonly="readonly"
      ></addOrUpdate>
    </el-dialog>
    <!-- 弹窗, 授权用户 -->
    <!-- <el-dialog
      :visible.sync="showAuthorityUser"
      title="授权用户"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="60%"
      :close-on-press-escape="false"
    >
      <authorityUser
        @close="close"
        @ok="succeed"
        v-if="showAuthorityUser"
      ></authorityUser>
    </el-dialog> -->
  </div>
</template>

<script>
// import authorityUser from "./authorityUser.vue";
// import addOrUpdate from "./role-add-or-update.vue";
export default {
  data() {
    return {
      dataForm: {
        draftName: ""
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
      dataListSelections: [],
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
  components: {
    // addOrUpdate,
    // authorityUser
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/draft/selectDraftPage"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          roleNumber: this.dataForm.roleNumber,
          roleName: this.dataForm.roleName
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
    //授权用户
    downLoad(data) {
      //   this.showAuthorityUser = true;
    },
    //重置
    reset() {
      this.dataForm = {
        draftName: ""
      };
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
