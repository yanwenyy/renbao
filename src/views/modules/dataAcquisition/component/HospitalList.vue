
<template>
    <div>
        <div class='listDisplay'>
             <el-button type="warning" @click="getStopCollection()">查看未导入医院</el-button>
        </div>
        <el-table :data="tableData" ref="tableData" border :header-cell-style="{textAlign:'center'}" style="width: 100%" height="60vh" v-loading="dataListLoading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column label="批次" align="center" prop="hospitalCollectPlanBath"> </el-table-column>
            <el-table-column label="医院名称" align="center" prop="hospitalName"></el-table-column>
            <el-table-column label="采集表名称" align="center" prop="collectTableName"></el-table-column>
            <el-table-column label="采集数据文件路径" align="center" prop="collectPath"> </el-table-column>
            <el-table-column label="数据类型" align="center">
                    <template slot-scope="scope">
                    <div class="tac">医院数据</div>
                    <!-- <div class="tac" v-if="scope.row.dataType=='2'">医保</div> -->
                </template>
            </el-table-column>
            <el-table-column label="采集人" align="center" prop="collectUserName"> </el-table-column>
            <el-table-column label="开始时间" align="center" prop="startTimeString">
            </el-table-column>
            <el-table-column label="结束时间" align="center"  prop="endTimeString">
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
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row.collectPlanMonitorId)" type="text">查看进度</el-button>
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
        <!-- 查看未导入医院弹框-->
        <el-dialog title='查看未导入医院' :close-on-click-modal="false" width="80%" :modal-append-to-body="false" :visible.sync="notImportVisible">
            <NotImport v-if="notImportVisible" @close="closeImportDrawer" @ok="ImportSucceed"></NotImport>
        </el-dialog>
        <!-- 查看进度弹框-->
        <el-dialog title='查看进度' :close-on-click-modal="false" width="80%" :modal-append-to-body="false" :visible.sync="showViewVisible">
            <ViewProgress v-if="showViewVisible" @close="closeViewDrawer" @ok="viewSucceed"></ViewProgress>
        </el-dialog>
    </div>
</template>
<script>
import NotImport from './notImport.vue'
import ViewProgress from './viewProgress.vue'
export default {
    name:'HospitalList',
    components:{
        NotImport,
        ViewProgress
    },
    props:{dataList:{
         type: String,
    }},
    data(){
        return{
            tableData:[],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageIndex:1,
                total:0,
            },
            notImportVisible:false,
            showViewVisible:false,
            multipleSelection:'',
            dataListLoading:false,
            dataForm:{
                filePath:'',
                collectStatus:'',
                startTime:'',
                startTimeEnd:''
            },
        }
    },
    created(){

    },
    mounted(){
        console.log(this.dataList)
        this.getInitList()
     
    },
    methods:{
        // dataList(val){
        //     debugger
        //     console.log(val)
        // },
        getInitList(){
            this.dataListLoading = true;
            this.$http({
                url:this.$http.adornUrl('/hospitalCollectPlan/selectPageList'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize:this.apComServerData.pageSize,
                    pageNo:this.apComServerData.pageIndex,
                    filePath:this.dataForm.filePath || '',
                    collectStatus:this.dataForm.collectStatus || '',
                    startTimeBegin:this.dataForm.startTime || '',
                    startTimeEnd:this.dataForm.startTimeEnd || ''
                    
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
        //查看进度
        edit(){
            this.showViewVisible = true
        },
        //多选
        handleSelectionChange(val){
            this.multipleSelection = val
            this.$emit('satDataHospital',this.multipleSelection); // 回显医院名称
        },
      
        //查看未导入数据
        getStopCollection(){
            this.notImportVisible = true
        },
        //关闭弹框
        ImportSucceed(){
            this.closeImportDrawer()
        },
        closeImportDrawer(){
            this.notImportVisible = false
        },
        //关闭弹框
        viewSucceed(){
            this.closeViewDrawer()
        },
        closeViewDrawer(){
            this.showViewVisible = false
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
    }
}
</script>
<style lang="scss" scoped>
.listDisplay{
    text-align: right;
    margin-bottom: 10px;
}
</style>
