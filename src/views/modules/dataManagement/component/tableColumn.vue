<template>
  <div class='next-content'>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      border
      style="width: 100%;height:50vh;overflow:auto;" :height="tableMaxHeight">
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
        structureList:{
            type: Object,
        },
        tableName:{
            type: String,
        }
    },
    data () {
      return {
        dataList: [],
        columnList:[],
        dataListLoading: false
      }
    },
    created () {
      this.getDataList();
    },
    computed:{
     tableMaxHeight(){
       return window.innerHeight - 170 + 'px'
     }
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
            url: this.$http.adornUrl('/prjBusDatabaseRelation/getTableDtaList'),
            method: 'get',
            params: this.$http.adornParams({
                'projectId':this.structureList.projectId,
                'tableName':this.tableName,
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
      },
    }
  }
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
}
.el-table::before {
  position: relative !important;
  height: 0;
}

</style>

