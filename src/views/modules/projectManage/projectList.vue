<template>
  <div class="mod-user">
    <el-form class="search-form-new" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

      <el-form-item label="项目编号：">
        <el-input v-model="dataForm.projectCode" placeholder="项目编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="项目名称：">
        <el-input v-model="dataForm.projectName" placeholder="项目名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          :picker-options="pickerOptionsStart"
          v-model="dataForm.createTimeBegin"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span>--</span>
        <el-date-picker
          :picker-options="pickerOptionsEnd"
          v-model="dataForm.createTimeEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageIndex=1,getDataList()">查询</el-button>
        <el-button v-if="" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button @click="reset()">重置</el-button>
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :height="tableHeight-75"
      :data="dataList"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--<el-table-column-->
        <!--type="selection"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="50">-->
      <!--</el-table-column>-->
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="序号"
        :index="indexMethod"
      >
      </el-table-column>
      <el-table-column
        prop="projectCode"
        header-align="center"
        align="center"
        width="120"
        label="项目编号">
      </el-table-column>
      <el-table-column
        prop="projectName"
        align="center"
        label="项目名称"
        min-width="160">
        <template slot-scope="scope">
          <!--<div :title="scope.row.projectName" class="show-ellipsis">{{scope.row.projectName}}</div>-->
          <el-button :title="scope.row.projectName" type="text" size="small" @click="addOrUpdateHandle(scope.row.projectId,'look')">{{scope.row.projectName}}</el-button>
        </template>
      </el-table-column>

      <el-table-column
        prop="dataAmount"
        header-align="center"
        align="center"
        label="项目周期"
        min-width="160">
        <template slot-scope="scope">
          {{scope.row.projectPeriodBegin }}至{{scope.row.projectPeriodEnd}}
        </template>
      </el-table-column>
      <el-table-column
        prop="auditedUnit"
        header-align="center"
        align="center"
        label="委托单位">
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
        label="创建时间"
        min-width="160">
        <template slot-scope="scope">
          {{scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column
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
        // 开始日期 :picker-options 中引用
        pickerOptionsStart: {
          disabledDate: time => {
            // 获取结束日期的 v-model 值并赋值给新定义的对象
            let endDateVal = this.dataForm.createTimeEnd;
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
            let beginDateVal = this.dataForm.createTimeBegin;
            if (beginDateVal) {
              // 比较 距 1970 年 1 月 1 日之间的毫秒数：
              return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            }
          }
        },
        dataForm: {
          projectCode: '',
          projectName: '',
          createTimeBegin: '',
          createTimeEnd: '',
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
        userId:sessionStorage.getItem("userId"),//当前用户id
      }
    },
    computed: {
      projectId: {
        get () { return this.$store.state.common.projectId}
      },
      tableHeight: {
        get () { return this.$store.state.common.tableHeight}
      },
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList();
    },
    methods: {
      // 序号翻页递增
      indexMethod(index) {
        // console.log("索引数下标", index);
        let nowPage = this.pageIndex; //当前第几页，根据组件取值即可
        let nowLimit = this.pageSize; //当前每页显示几条，根据组件取值即可
        return index + 1 + (nowPage - 1) * nowLimit; // 这里可以理解成一个公式
      },
      //重置
      reset(){
        this.dataForm={
          projectCode: '',
          projectName: '',
          createTimeBegin: '',
          createTimeEnd: '',
        };
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/xmProject/selectPage'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNo': this.pageIndex,
            'pageSize': this.pageSize,
            'projectCode': this.dataForm.projectCode||null,
            'projectName': this.dataForm.projectName||null,
            'createTimeBegin': this.dataForm.createTimeBegin||null,
            'createTimeEnd': this.dataForm.createTimeEnd||null
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
      addOrUpdateHandle (id,type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,type)
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
                  this.getDataList();
                  if(this.projectId==id){
                    this.$store.commit('common/updateProjectId', '');
                    this.$http({
                      isLoading:false,
                      url: this.$http.adornUrl('/nowProject/saveOrUpdateByCreateUserId'),
                      method: 'post',
                      data:  this.$http.adornData({projectId: '',createUserId:this.userId})
                    }).then(({data}) => {
                      if (data.code == 200) {

                      }
                    })

                  }
                  this.$store.dispatch('common/changeProjectList',this.userId);
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
<style scoped lang="scss">
  .show-ellipsis{
    color:#17B3A3;
  }
</style>
