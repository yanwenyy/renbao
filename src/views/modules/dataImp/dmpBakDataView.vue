<template>
  <div :style="{height:(tableHeight-60)+'px'}">
    <el-table
      :data="dataList"
      border
      :height="tableHeight-60"
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
      tableName: String,
      dmpImp: Object
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
          this.getDataList()
        }
      },
      dmpImp: {
        deep: true,
        immediate: true,
        handler() {
          this.getDataList()
        }
      }
    },
    methods: {
      // 获取数据列表
      ///${this.tableName}
      getDataList () {
        this.$http({
            url: this.$http.adornUrl(`dataImp/dmpBakDataView/${this.tableName}`),
            method: 'post',
            data: this.dmpImp
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.dataList = data.result.result
              this.columnList = data.result.columnInfo.columnList
            } else {
              this.dataList = []
            }
          })
      }
    }
  }
</script>
