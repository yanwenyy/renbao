<template>
  <el-dialog
    width="80%"
    title="成员列表"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

      <el-form-item label="用户姓名:">
        <el-input v-model="dataForm.name" placeholder="用户姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别:">
        <el-select clearable v-model="dataForm.userSex" placeholder="请选择性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="dataForm.userPhone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="组别:">
        <el-select v-model="dataForm.cy" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="" type="info" @click="">重置</el-button>
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
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="用户姓名">
      </el-table-column>
      <el-table-column
        prop="agencyName"
        align="center"
        label="性别">
      </el-table-column>

      <el-table-column
        prop="dataAmount"
        header-align="center"
        align="center"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="effectiveData"
        header-align="center"
        align="center"
        label="组别">
      </el-table-column>
    </el-table>
    <el-pagination
      class="self-page"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="sub()">确定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        roleList:[],
        visible:true,
        dataForm: {
          startTime: '',
          endTime: '',
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        value1: '',
      }
    },
    components: {

    },
    activated () {
      // this.getDataList();
      // this.$http({
      //   url: this.$http.adornUrl('/biz/pdagency/down/list'),
      //   method: 'get',
      //   params: this.$http.adornParams()
      // }).then(({data}) => {
      //   this.options = data && data.code === 200 ? data.data : []
      // })
    },
    methods: {
      //保存信息
      sub(){
        this.$emit('refreshDataList',this.dataListSelections);
      },
      // 获取数据列表
      getDataList () {
        console.log(this.value1)
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/pdbaidudata/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'agencyId': this.dataForm.agencyId,
            'startTime': this.dataForm.startTime,
            'endTime': this.dataForm.endTime
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
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
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确认删除该条数据吗?删除后数据不可恢复`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/pdbaidudata/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
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
<style scoped>
  .self-page{
    text-align: center;
  }
</style>
