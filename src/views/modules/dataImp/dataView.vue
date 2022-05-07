<template>
  <div :style="{height:(tableHeight-60)+'px'}">
    <el-table
      :data="dataList"
      border
      :height="tableHeight-60"
      ref="tableref"
      style="width: 100%;">
      <el-table-column
       v-for="(column,index) in columnList"
       :prop="column.columnName"
       :label="column.columnName"
       :key="index"
       width="200"
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
        //dataListLoading: false,
        columnList: []
      }
    },
    computed:{
      tableHeight: {
        get () { return this.$store.state.common.tableHeight}
      },
    },
    created () {
      this.getDataList();
    },
    watch: {
      tableName: {
        deep: true,
        immediate: true,
        handler() {
          //this.getDataList(this.tableName)
        }
      }
    },
    methods: {
      // 获取数据列表
      ///${this.tableName}
      getDataList () {
        //this.dataListLoading = true;
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
            //当页面数据加完完毕后
            this.$nextTick(() => {
                // 初始化表格
                this.$refs.tableref.doLayout();
            })
          } else {
            this.dataList = []
            this.columnList = []
          }
          //this.dataListLoading = false
        })
        //this.dataList = [{ columnNameCn : this.tableName + 1,columnTypeCn:"字符型"}]
      }
    }
  }
</script>
