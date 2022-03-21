<template>
  <div class="mod-user">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.userName"
          placeholder="用户姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.userNumber"
          placeholder="工号"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          clearable
          v-model="dataForm.userSex"
          placeholder="请选择性别"
        >
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.userPhone"
          placeholder="手机号"
          clearable
        ></el-input>
      </el-form-item>
      <!--<el-form-item>-->
      <!--<el-select v-model="dataForm.userName" placeholder="请选择性别">-->
      <!--<el-option label="请选择" value=""></el-option>-->
      <!--<el-option label="正常" value="1"></el-option>-->
      <!--<el-option label="冻结" value="1"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item class="searchBtn">
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="warning" @click="down()">下载模板</el-button>
        <el-upload
          class="inline-block"
          :headers="{ token: token }"
          :action="this.$http.adornUrl('/user/dataImport')"
          :on-success="handleChange"
          :on-error="handleChange"
          :show-file-list="false"
          style="float:right;margin-left:13px"
        >
          <el-button type="warning">导入</el-button>
        </el-upload>
        <!--<el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
      <el-button type="primary" @click="(pageIndex = 1), getDataList()"
        >查询</el-button
      >
      <el-button @click="reset()">重置</el-button>
    </el-form>
    <el-table
      :height="$tableHeight-58"
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
        label="ID"
      >
        <!--prop="userId"-->
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户姓名"
      >
      </el-table-column>
      <el-table-column
        prop="userNumber"
        header-align="center"
        align="center"
        label="工号"
      >
      </el-table-column>
      <el-table-column
        prop="userSex"
        header-align="center"
        align="center"
        label="性别"
      >
        <template slot-scope="scope">{{
          scope.row.userSex == "1" ? "男" : scope.row.userSex == "2" ? "女" : ""
        }}</template>
      </el-table-column>
      <el-table-column
        prop="userPhone"
        header-align="center"
        align="center"
        label="手机号"
      >
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="status"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="状态">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>-->
      <!--<el-tag v-else size="small">正常</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
      >
        <template slot-scope="scope">{{
          scope.row.createTime | dateformat
        }}</template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <!--<el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>-->
          <!--<el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>-->
          <el-button
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.userId)"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="deleteHandle(scope.row.userId)"
            >删除</el-button
          >
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
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./user-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        userName: "",
        userNumber: "",
        userSex: "",
        userPhone: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      fileList: [],
      token: this.$cookie.get("token")
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    //导入
    handleChange(response, file, fileList) {
      if (response && response.code === 200) {
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
        this.$message.error(response.message);
      }
    },
    //下载模板
    down() {
      let url =
        this.$http.adornUrl("/user/exportTemplate?token=") +
        this.$cookie.get("token");
      window.open(url);
      /*  this.$http({
        method: "get",
        url: this.$http.adornUrl("/user/exportTemplate"),
        // data: this.query.data,
        responseType: "blob"
      })
        .then(res => {
          // console.log(decodeURI(res.headers['filename']));
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", decodeURI(res.headers["filename"]));
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          this.$Notice.error({
            title: "错误",
            desc: "系统数据错误"
          });
          console.log(error);
        }); */
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/user/selectPage"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          userName: this.dataForm.userName,
          userNumber: this.dataForm.userNumber,
          userSex: this.dataForm.userSex,
          userPhone: this.dataForm.userPhone
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
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.userId;
          });
      this.$confirm(`确定进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/user/delete/" + id),
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
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //重置
    reset() {
      this.dataForm = {
        userName: "",
        userNumber: "",
        userSex: "",
        userPhone: ""
      };
      this.pageIndex = 1;
      this.getDataList();
    }
  }
};
</script>
<style scoped>
.searchBtn {
  float: right;
}
.inline-block {
  display: inline-block;
}
</style>
