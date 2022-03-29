<template>
    <div class='Detail'>
        <div class='listDisplay' style='text-align:center'>
             <h2 type="primary">数据质量报告</h2>
        </div>
        <el-table :data="tableList" border height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column label="校验规则" align="center" prop="ruleContent"></el-table-column>
            <el-table-column label="校验状态" align="center" prop="checkStatus">
                <template slot-scope="scope">
                    <div v-if="scope.row.checkStatus == '0'">待校验</div>
                    <div v-if="scope.row.checkStatus == '1'">校验中</div>
                    <div v-if="scope.row.checkStatus == '2'">校验成功</div>
                    <div v-if="scope.row.checkStatus == '3'">校验失败</div>
                </template>
            </el-table-column>
            <el-table-column label="校验结果" align="center" prop="checkResult"></el-table-column>
        </el-table>
        <div class="itemBtn">
            <el-button type="primary" @click="downloadClick">下载报告</el-button>
        </div>
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
            pageSize:10
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
    }
}
</script>
<style lang="scss" scoped>

.itemBtn{
    text-align: center;
    margin-top: 10px;
}
</style>
