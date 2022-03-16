<template>
    <div class='viewProgress'>
        <el-table :data="tableList" border height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
            <el-table-column label="采集数据文件路径" align="center" prop="filePath"></el-table-column>
            <el-table-column label="文件类型" align="center" prop="dataType">
                <template slot-scope="scope">
                    <div class="tac" v-if="scope.row.dataType=='1'">医院</div>
                    <div class="tac" v-if="scope.row.dataType=='2'">医保</div>
                </template>
            </el-table-column>
            <el-table-column label="采集人" align="center" prop="collectUserName"></el-table-column>
            <el-table-column label="开始时间" align="center" prop="startTime"></el-table-column>
            <el-table-column label="结束时间" align="center" prop="endTime"></el-table-column>
            <el-table-column label="状态" align="center" prop="collectStatus">
                <template slot-scope="scope">
                    <div class="tac" v-if="scope.row.collectStatus=='0'">已完成</div>
                    <div class="tac" v-if="scope.row.collectStatus=='1'">进行中</div>
                    <div class="tac" v-if="scope.row.collectStatus=='2'">失败</div>
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
                    <el-button @click="editClick(scope.row.collectPlanMonitorId)" size="mini">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pager'>
            <el-pagination small layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total"></el-pagination>
        </div>
        <div class="itemBtn">
            <el-button @click="close">关闭</el-button>
        </div>
        <!-- 查看弹框-->
        <el-dialog title='查看日志' :close-on-click-modal="false" :before-close="closeEditDrawer" width="50%" :modal-append-to-body="false" :visible.sync="editShowVisible">
            <Edit v-if="editShowVisible" @close="closeEditDrawer" @ok="EditSucceed" :collectPlanMonitorId="collectPlanMonitorId"></Edit>
        </el-dialog>
    </div>
</template>
<script>
import Edit from './edit.vue'
export default {
    components:{
        Edit,
    },
    name:"viewProgress",
    data(){
        return{
            tableList:[],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
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
                    startTimeBegin:this.dataForm.startTimeBegin || '',
                    startTimeEnd:this.dataForm.startTimeEnd || ''
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
        editClick(id){
            this.editShowVisible = true
            this.collectPlanMonitorId = id
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
