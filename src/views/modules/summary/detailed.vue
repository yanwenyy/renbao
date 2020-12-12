<template>
  <div class="mod-user">
    <!--菜单上的明细表,路由:summary/detailed-->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="物料名称" name="materials"></el-tab-pane>
      <el-tab-pane label="运输方式" name="trantype"></el-tab-pane>
      <el-tab-pane label="燃油种类" name="fueltype"></el-tab-pane>
    </el-tabs>
    <el-form v-if="this.activeName=='materials'" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="物料名称:">
        <el-input v-model="dataForm.materialsName" placeholder="物料名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="type"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="weigh"
        header-align="center"
        align="center"
        label="重量">
      </el-table-column>
      <el-table-column
        prop="car"
        header-align="center"
        align="center"
        label="车辆数">
      </el-table-column>
    </el-table>
    <el-pagination v-if="this.activeName=='materials'"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          materialsName:''
        },
        activeName: 'materials',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
      }
    },
    components: {
    },
    activated () {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/jinding/'+this.activeName+'/list'),
          method: 'get',
          params: this.activeName=='materials'?this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'materialsName':this.dataForm.materialsName
          }):''
        }).then(({data}) => {
          if (data && data.code === 10000) {
            this.dataList = data.data
            this.totalPage = data.total
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
      handleClick(tab, event) {
        this.getDataList();
      }
    }
  }
</script>
