<template>
  <div>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      style="width: 100%;height:45vh;overflow:auto;">
      <el-table-column
        label="字段名称"
        align="center"
        prop="columnNameCn"
       />
      <el-table-column
        label="字段类型"
        align="center"
        prop="columnTypeCn"
       />
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      tableName: String
    },
    data () {
      return {
        dataList: [],
        dataListLoading: false
      }
    },
    created () {
      this.getDataList();
    },
    watch: {
      tableName: {
        deep: true,
        immediate: true,
        handler() {
          this.getDataList(this.tableName)
        }
      }
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl(`/dataImp/getColumnInfosByTN/${this.tableName}`),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.result
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
        //this.dataList = [{ columnNameCn : this.tableName + 1,columnTypeCn:"字符型"}]
      }
    }
  }
</script>