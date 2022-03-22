<template>
  <div style="height:46vh;overflow:auto;">
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      height="46vh"
      style="width: 100%;">
      <el-table-column
       v-for="(column,index) in columnList"
       :prop="column.columnName"
       :label="column.columnName"
       :key="index"
        align="center"/>
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
        dataListLoading: false,
        columnList: []
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
      ///${this.tableName}
      getDataList () {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl(`/dataInfoBase/getTableDataList`),
          method: 'get',
          params: this.$http.adornParams({
            'tableName': this.tableName
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.result.result
            this.columnList = data.result.columnInfo.columnList
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