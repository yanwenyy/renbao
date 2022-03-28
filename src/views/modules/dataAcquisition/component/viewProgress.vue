<template>
    <div class='viewProgress'>
        <el-table :data="tableList" border :height="$tableHeight-75" :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
            <el-table-column label="采集数据文件路径" align="center" prop="filePath"></el-table-column>
            <el-table-column label="采集表名称" align="center" prop="collectTableName"></el-table-column>
            <el-table-column label="文件类型" align="center" prop="dataType">
                <template slot-scope="scope">
                    <div class="tac" v-if="scope.row.dataType=='1'">医院数据</div>
                    <div class="tac" v-if="scope.row.dataType=='2'">医保数据</div>
                </template>
            </el-table-column>
            <el-table-column label="采集人" align="center" prop="collectUserName"></el-table-column>
            <el-table-column label="开始时间" align="center" prop="startTime">
                <template slot-scope="scope">{{scope.row.startTime | datetimeformat}}</template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="endTime">
                <template slot-scope="scope">{{scope.row.endTime | datetimeformat}}</template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="collectStatus">
                <template slot-scope="scope">
                    <div class="tac" v-if="scope.row.collectStatus=='0'">待采集</div>
                    <div class="tac" v-if="scope.row.collectStatus=='1'">进行中</div>
                    <div class="tac" v-if="scope.row.collectStatus=='2'">已完成</div>
                    <div class="tac" v-if="scope.row.collectStatus=='3'">失败</div>
                </template>
            </el-table-column>
            <el-table-column label="进度" align="center" prop="collectStatus">
               <template slot-scope="scope">
                    <el-progress v-if="scope.row.collectStatus=='0'" :percentage="0"></el-progress>
                    <el-progress v-if="scope.row.collectStatus=='1'" :percentage="50"></el-progress>
                    <el-progress v-if="scope.row.collectStatus=='2'" :percentage="100"></el-progress>
                    <el-progress v-if="scope.row.collectStatus=='3'" :percentage="0"></el-progress>
                </template>
            </el-table-column>
            <el-table-column align="center" label="日志">
                <template slot-scope="scope">
                    <el-button @click="editClicks(scope.row.collectPlanMonitorId)" size="mini">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
         <el-pagination 
                :page-size="apComServerData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="apComServerData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="apComServerData.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                ></el-pagination>
        <div class="itemBtn">
            <el-button @click="close">关闭</el-button>
        </div>
        <!-- 查看弹框-->
        <el-dialog title='查看日志' width="70%"  :close-on-click-modal="false" append-to-body :modal-append-to-body="false" :visible.sync="editShowVisible">
            <!-- <editClick v-if="editShowVisible" @close="closeEditDrawer" @ok="EditSucceed" :collectPlanMonitorId="collectPlanMonitorId"></editClick> -->
            <div class='Edit'>
                <el-table :data="tableData" border :header-cell-style="{textAlign:'center'}" :height="$tableHeight-75">
                    <el-table-column label="步骤规则" align="center" prop="stepName"></el-table-column>
                    <el-table-column label="步骤开始时间" align="center">
                        <template slot-scope="scope">{{scope.row.stepStartTime | datetimeformat}}</template>
                    </el-table-column>
                    <el-table-column label="步骤结束时间" align="center">
                        <template slot-scope="scope">{{scope.row.stepEndTime | datetimeformat}}</template>
                    </el-table-column>
                    <el-table-column label="步骤状态" align="center" min-width="50" prop="stepStatus">
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
                    <el-button @click="editShowVisible = false">关闭</el-button>
                </div>
            </div>
        </el-dialog> 
    </div>
</template>
<script>
export default {
    name:"viewProgress",
    props: { collectPlanMonitorIds: { type: String } },
    data(){
        return{
            tableList:[],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageIndex:1,
                total:0,
                pageIndex:1
            },
            dataForm:{
                fileName:'',
                filePath:'',
                collectStatus:'',
                startTimeEnd:'',
                startTimeBegin:''
            },
            editShowVisible:false,  //弹框显示
            collectPlanMonitorId:'', //id
            Visible:false,
            tableData:[]  //查看table
        }
    },
    mounted() {
        this.getInitList();
    },
    methods:{
        //关闭
        close(){
          this.$emit('close')
        },
       
        getInitList(){
            this.$http({
                url: this.$http.adornUrl('/collectPlanMonitor/selectPageList'),
                method: "get",
                params: this.$http.adornParams({
                    pageSize:this.apComServerData.pageSize,
                    pageNo:this.apComServerData.pageIndex,
                    fileName:this.dataForm.fileName || '',
                    filePath:this.dataForm.filePath || '',
                    collectStatus:this.dataForm.collectStatus || '',
                    dataType:1,
                    startTimeBegin:this.dataForm.startTimeBegin || '',
                    startTimeEnd:this.dataForm.startTimeEnd || '',
                    hospitalCollectPlanId:this.collectPlanMonitorIds
                })
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.tableList = data.result.records
                    this.apComServerData.total = data.result.total      
                }else{
                    this.tableList = []
                    this.apComServerData.total = 0
                }
            })
        },
        EditSucceed(){this.closeEditDrawer()},
        closeEditDrawer(){ this.editShowVisible = false},
        editClicks(id){
            this.editShowVisible = true
            this.getDataList(id)
            // this.collectPlanMonitorId = id
        },
        getDataList(id){
            this.$http({
                url: this.$http.adornUrl('/stepPlanMonitor/selectPageList'),
                method: "get",
                params: this.$http.adornParams({
                    'businessId':id
                })
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.tableData = data.result.records
                }else{
                    this.tableData = []
                }
            })
        },
        handleSizeChange(val){
            this.apComServerData.pageSize = val;
            this.apComServerData.pageIndex = 1
            this.getInitList()
        },
         //当前页
        handleCurrentChange(val){
            this.apComServerData.pageIndex = val;
            this.getInitList()
        },
    }
}
</script>
<style lang="scss" scoped>

.itemBtn{
    text-align: center;
    margin-top: 10px;
}
.Edit{
/deep/.el-table{
padding:0;
}
}
</style>
