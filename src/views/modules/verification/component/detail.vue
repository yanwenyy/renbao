<template>
    <div class='Detail'>
        <div class='listDisplay' style='text-align:center'>
             <h2 type="primary">数据质量报告</h2>
        </div>
        <el-table :data="tableList" border height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" style="width: 100%">
             <el-table-column label="序号" align="center" type='index' width="50"></el-table-column>
            <el-table-column label="校验规则" align="center" prop="ruleContent"></el-table-column>
            <el-table-column label="校验状态" align="center" prop="checkStatus" width="100">
                <template slot-scope="scope">
                    <div v-if="scope.row.checkStatus == '0'">待校验</div>
                    <div v-if="scope.row.checkStatus == '1'">校验中</div>
                    <div v-if="scope.row.checkStatus == '2'">校验成功</div>
                    <div v-if="scope.row.checkStatus == '3'">校验失败</div>
                </template>
            </el-table-column>
            <el-table-column label="校验结果" align="center" prop="checkResult" width="100">
                <template slot-scope="scope">
                <div class="tac" v-if="scope.row.checkResult=='成功'">成功</div>
                <div class="tac" v-if="scope.row.checkResult=='失败'" style="color:red">失败</div>
                </template>
            </el-table-column>   
            <el-table-column align="center" label="操作" width='100' prop="affirmStatus">
                <template slot-scope="scope">
                    <el-button @click="tableSqlView(scope.row.dataCeeckTemplateProjectId)" type="text" size="small">查看sql</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="itemBtn">
            <el-button type="primary" @click="downloadClick">下载报告</el-button>
        </div>
        <el-dialog title='查看Sql日志' width="50%" :close-on-click-modal="false" append-to-body :modal-append-to-body="false" :visible.sync="showSqlViewVisible">
                <div class="sqlView">
                <el-table v-loading="tableLoading" ref="multipleTable" :height="tableHeight" :data="tableData" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" style="width: 100%;">
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
            <span slot="footer" class="dialog-footer" style="text-align:center">
                <el-button @click="showSqlViewVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:"Detail",
     props: { hospitalCollectPlanId: { type: String } },
    data(){
        return{
            tableList:[],
            pageIndex:1,
            pageSize:1000,
            showSqlViewVisible:false,//查看sql
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
        this.getInitList()
    },

    methods:{
        getInitList(){
             this.$http({
                url:this.$http.adornUrl('/dataQualityReport/dataQualityReportList'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize:this.pageSize,
                    pageNo:this.pageIndex,
                    ruleType:1,
                    hospitalCollectPlanId:this.hospitalCollectPlanId
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableList = data.result.records
                    // this.apComServerData.total = data.result.total                   
                }else{
                    this.tableList = []
                    // this.apComServerData.total = 0
                }
            })
        },
        //关闭
        downloadClick(){
            let url =
                this.$http.adornUrl(
                "dataQualityReport/excelDataExport?ruleType=" + 1 + '&hospitalCollectPlanId='+ this.hospitalCollectPlanId +
                    "&token="
                ) + this.$cookie.get("token");
            window.open(url);
        },    
        //医保查看日志
        tableSqlView(id){
            this.showSqlViewVisible = true
            // this.sqlId = id
            this.tableSqlList(id)
        },
        tableSqlList(id){
            this.tableLoading = true
            this.$http({
                    url:this.$http.adornUrl('/dataQualityReport/dataQualityReportSqlList'),
                    method: 'get',
                    params: this.$http.adornParams({
                        dataCeeckTemplateProjectId:id,
                        ruleType:1,
                        pageNo:this.pageIndex,
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
<style lang="scss" scoped>

.itemBtn{
    text-align: center;
    margin-top: 10px;
}
</style>
