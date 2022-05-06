<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :height="tableHeight+30"
      :data="dataList"
      row-key="menuId"
      :row-style="isRed"
      @row-click="rowClickEv"
      style="width: 100%; ">
      <el-table-column
        prop="menuName"
        header-align="center"
        min-width="150"
        label="名称" >
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="parentName"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="120"-->
        <!--label="上级菜单">-->
      <!--</el-table-column>-->
      <el-table-column
        header-align="center"
        align="center"
        label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menuUrl ==''||scope.row.menuUrl ==null" size="small">目录</el-tag>
          <el-tag v-if="scope.row.menuUrl" size="small" type="success">菜单</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="menuSort"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="menuUrl"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './menu-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        selectedArrData: [], // 把选择到的当前行的id存到数组中
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    computed:{
      tableHeight: {
        get () { return this.$store.state.common.tableHeight}
      },
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 某一行被点击行触发事件，默认形参代表一整行数据
      rowClickEv(row) {
        // console.log(row);//点击的那行数据默认是对象{__ob__: Observer}，将其转数组
        this.selectedArrData = [row];
      },

      isRed({ row }) {
        const checkIdList = this.selectedArrData.map((item) => item.menuId);
        if (checkIdList.includes(row.menuId)) {
          return {
            backgroundColor: "#E0EDFA",
          };
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/menu/getMenuList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data.result, 'menuId','menuParentId')
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true;
        var clickRow=id?null:this.selectedArrData[0]
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,clickRow)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/menu/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
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
<style lang="scss" scoped>
  // 修改鼠标经过表格的颜色
  /deep/ .el-table tbody tr:hover > td {
    background-color: transparent !important;

  }

</style>
