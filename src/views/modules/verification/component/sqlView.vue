<template>
    <div :style="{height:(tableHeight-60)+'px'}" class="sqlView">
        <el-table v-loading="tableLoading" ref="multipleTable" :data="tableData" :height="tableHeight - 190" style="width: 100%;margin-top: 20px">
        <el-table-column prop="sqlContent" header-align="center" align="center" label="sql内容">
        </el-table-column>
        <el-table-column prop="startTimeString" header-align="center" align="center" label="开始时间">
        </el-table-column>
        <el-table-column prop="endTimeString" header-align="center" align="center" label="结束时间">
        </el-table-column>
        <el-table-column prop="runResult" header-align="center" align="center" label="运行结果">
        </el-table-column>
        <el-table-column prop="runStatus" header-align="center" align="center" label="运行状态">
            <template slot-scope="scope">
                <div v-if="scope.row.runStatus == '0'">待执行</div>
                <div v-if="scope.row.runStatus == '1'">进行中</div>
                <div v-if="scope.row.runStatus == '2'">成功</div>
                <div v-if="scope.row.runStatus == '3'">失败</div>
            </template>
        </el-table-column>
        </el-table>
      </div>
</template>
<script>
export default {
    name:'sqlView',
    props: { sqlId: { type: String } },
    data(){
        return{
            pageNo:1,
            pageSize:10,
            total:0,
            tableLoading:false,
            tableData:[]
        }
    },
    computed:{
          tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    }
    },
    mounted(){
        this.tableSqlList()
    },
    methods:{
        tableSqlList(){
            this.tableLoading = true
            this.$http({
                    url:this.$http.adornUrl('/dataQualityReport/dataQualityReportSqlList'),
                    method: 'get',
                    params: this.$http.adornParams({
                        dataCeeckTemplateProjectId:this.sqlId,
                        pageNo:this.pageNo,
                        pageSize:this.pageSize
                    })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableData = data.result.records
                    this.total = data.result.total
                }else{
                    this.tableData = []
                    this.total = 0
                }
                this.tableLoading = false
            })
        }
    }
}
</script>
