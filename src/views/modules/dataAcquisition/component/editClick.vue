<template>
    <div class='Edit'>
        <el-table :data="tableList" border :header-cell-style="{textAlign:'center'}" :height="$tableHeight-75" style="width: 100%">
            <el-table-column label="步骤规则" align="center" prop="stepName"></el-table-column>
            <el-table-column label="步骤开始时间" align="center">
                <template slot-scope="scope">{{scope.row.stepStartTime | datetimeformat}}</template>
            </el-table-column>
            <el-table-column label="步骤结束时间" align="center">
                <template slot-scope="scope">{{scope.row.stepEndTime | datetimeformat}}</template>
            </el-table-column>
            <el-table-column label="步骤状态" align="center" prop="stepStatus">
                <template slot-scope="scope">
                    <div class="tac" v-if="scope.row.stepStatus=='0'">待采集</div>
                    <div class="tac" v-if="scope.row.stepStatus=='1'">进行中</div>
                    <div class="tac" v-if="scope.row.stepStatus=='2'">已完成</div>
                    <div class="tac" v-if="scope.row.stepStatus=='3'">失败</div>
                </template>
            </el-table-column>
            <el-table-column label="步骤结果" align="center" prop="stepResult">
            </el-table-column>
        </el-table>
        <div class="itemBtn">
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:"Edit",
    props: { collectPlanMonitorId: { type: String } },
    data(){
        return{
            tableList:[]
        }
    },
    mounted() {
        this.getInitList();
    },
    methods:{
        getInitList(){
            this.$http({
                url: this.$http.adornUrl('/stepPlanMonitor/selectPageList'),
                method: "get",
                params: this.$http.adornParams({
                    'businessId':this.collectPlanMonitorId,
                })
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.tableList = data.result.records
                }else{
                    this.tableList = []
                }
            })
        },
        //关闭
        close(){
          this.$emit('close')
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
