<template>
    <div class='Detail'>
        <div class='listDisplay' style='text-align:center'>
             <h2 type="primary">数据质量报告</h2>
        </div>
        <el-table :data="tableList" border height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column label="校验规则" align="center" prop="ValidateRules"></el-table-column>
            <el-table-column label="校验状态" align="center" prop="ValidateStatus">
                <template slot-scope="scope">
                    <div v-if="scope.row.ValidateStatus == '0'">校验完成</div>
                    <div v-if="scope.row.ValidateStatus == '1'">校验中</div>
                    <div v-if="scope.row.ValidateStatus == '2'">待校验</div>
                </template>
            </el-table-column>
            <el-table-column label="校验结果" align="center" prop="ValidateResult"></el-table-column>
        </el-table>
        <div class="itemBtn">
            <el-button type="primary" @click="downloadClick">下载报告</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:"Detail",
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
                    pageNo:this.pageIndex
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
