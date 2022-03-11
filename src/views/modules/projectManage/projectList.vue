<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

      <el-form-item label="项目编号:">
        <el-input v-model="dataForm.projectCode" placeholder="项目编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="项目名称:">
        <el-input v-model="dataForm.projectName" placeholder="项目名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="项目时间:">
        <el-date-picker
          v-model="dataForm.projectPeriodBenig"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span>--</span>
        <el-date-picker
          v-model="dataForm.projectPeriodEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageIndex=1,getDataList()">查询</el-button>
        <el-button v-if="" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="projectCode"
        header-align="center"
        align="center"
        width="80"
        label="项目编号">
      </el-table-column>
      <el-table-column
        prop="projectName"
        align="center"
        label="项目名称">
      </el-table-column>

      <el-table-column
        prop="dataAmount"
        header-align="center"
        align="center"
        label="项目周期">
        <template slot-scope="scope">
          {{scope.row.projectPeriodBegin }}-{{scope.row.projectPeriodEnd}}
        </template>
      </el-table-column>
      <el-table-column
        prop="auditedUnit"
        header-align="center"
        align="center"
        label="被审核单位">
      </el-table-column>
      <el-table-column
        prop="createUserName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime | dateformat }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.projectId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.projectId)">删除</el-button>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

  </div>
</template>

<script>
  import AddOrUpdate from './project-add-or-update'

  export default {
    data () {
      return {
        dataForm: {
          projectCode: '',
          projectName: '',
          projectPeriodBenig: '',
          projectPeriodEnd: '',
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        value: '',
        value1: '',
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList () {
        console.log(this.value1)
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/xmProject/selectPage'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNo': this.pageIndex,
            'pageSize': this.pageSize,
            'projectCode': this.dataForm.projectCode||null,
            'projectName': this.dataForm.projectName||null,
            'projectPeriodBenig': this.dataForm.projectPeriodBenig||null,
            'projectPeriodEnd': this.dataForm.projectPeriodEnd||null
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.result.records;
            this.totalPage = data.result.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var projectIds = id ? [id] : this.dataListSelections.map(item => {
          return item.projectId
        })
        this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/xmProject/deleteProjectByIds'),
            method: 'post',
            data: this.$http.adornData(projectIds, false)
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
