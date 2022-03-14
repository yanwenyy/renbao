
<template>
    <div class='InformationList'>
        <el-table :data="tableData" border ref="tableData" :header-cell-style="{textAlign:'center'}" style="width: 100%" height="600" @selection-change="handleSelectionChanges">
            <el-table-column type="selection"  header-align="center" align="center" width="50"></el-table-column>
            <el-table-column label="批次" align="center" prop="collectPlanMonitorBath"> </el-table-column>
            <el-table-column label="文件名" align="center" prop="fileName"></el-table-column>
            <el-table-column label="采集数据文件路径" align="center" prop="filePath"> </el-table-column>
            <el-table-column label="采集人" align="center" prop="collectUserName"> </el-table-column>
            <el-table-column label="开始时间" align="center" :formatter="dateFormat" prop="startTime"></el-table-column>
            <el-table-column label="结束时间" align="center" :formatter="dateEndFormat" prop="endTime"> </el-table-column>
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
            <el-table-column align="center"  label="操作">
                <template slot-scope="scope">
                    <el-button @click="editClick(scope.row.collectPlanMonitorId)" type="text">查看</el-button>
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
            
        <!-- 查看弹框-->
        <el-dialog title='查看日志' :close-on-click-modal="false" width="50%" :modal-append-to-body="false" :visible.sync="editShowVisible">
            <Edit v-if="editShowVisible" @close="closeEditDrawer"  :collectPlanMonitorId="collectPlanMonitorId" @ok="EditSucceed" @></Edit>
        </el-dialog>
    </div>
</template>
<script>
import Edit from './edit.vue'
export default {
     components:{
        Edit,
    },
    name:'InformationList',
    data(){
        return{
            tableData:[],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageIndex:1,
                total:0,
            },
            editShowVisible:false,  //弹框显示
            collectPlanMonitorId:'',
            collectPlanMonitorId:'',
            dataForm:{
                fileName:'',
                filePath:'',
                collectStatus:'',
                startTime:'',
                endTime:''
            },
            multipleSelection:''
        }
    }, 
     mounted(){
        this.getInitList()
    },
    methods:{
        //多选
        handleSelectionChanges(val){
            this.multipleSelection = val
            this.$emit('satDatalist',this.multipleSelection); // 回显医院名称
        },
         //开始时间转换
        dateFormat(row, column, cellValue, index){
            let date = new Date(parseInt(row.startTime) * 1000);
            let Y = date.getFullYear() + '-';
            let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
            let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
            let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
            let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return Y + M + D + h + m + s;
        },
        //结束时间转换
        dateEndFormat(row, column, cellValue, index){
            let date = new Date(parseInt(row.endTime) * 1000);
            let Y = date.getFullYear() + '-';
            let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
            let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
            let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
            let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return Y + M + D + h + m + s;
        },

        //查看
        editClick(id){
            this.editShowVisible = true
            this.collectPlanMonitorId = id
        },
    
         //初始化数据
        getInitList(){
            this.tableData = []
            this.$http({
                url:this.$http.adornUrl('/collectPlanMonitor/selectPageList'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize:this.apComServerData.pageSize,
                    pageNo:this.apComServerData.pageIndex,
                    fileName:this.dataForm.fileName || '',
                    filePath:this.dataForm.filePath || '',
                    // collectStatus:this.dataForm.collectStatus || '',
                    // startTime:this.dataForm.startTime || '',
                    // endTime:this.dataForm.endTime || ''
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableData = data.result.records
                    this.apComServerData.total = data.result.total
                      
                }else{
                    this.tableData = []
                    this.apComServerData.total = 0
                }
                this.dataListLoading = false;
            })
        },
         // 页数
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
        EditSucceed(){this.closeEditDrawer()},
        closeEditDrawer(){ this.editShowVisible = false},
    }
}
</script>
<style lang="scss" scoped>

</style>
