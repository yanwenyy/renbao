<template>
    <div class='collection'>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item label="文件名：" v-if="activeName == 'audit'">
                <el-input v-model="dataForm.fileName" placeholder="请输入文件名"></el-input>
            </el-form-item>
            <el-form-item label="文件路径：">
                <el-input v-model="dataForm.filePath" placeholder="请输入文件路径"></el-input>
            </el-form-item>
             <el-form-item label="采集状态：">
                <el-select v-model="dataForm.collectStatus" placeholder="已完成" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间:">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.startTimeBegin" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.startTimeEnd" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getSearch()">查询</el-button>
                <el-button @click="getReset()">重置</el-button>
                <!-- <el-button type="warning" @click="getStopCollection()">停止采集</el-button> -->
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <!--医保数据-->
            <el-tab-pane label="医保数据" name="audit" >
            <div v-if="activeName == 'audit'">
               <el-table :data="tableList" border :header-cell-style="{textAlign:'center'}" height="60vh" style="width: 100%" v-loading="dataLoading" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="50"></el-table-column>
                    <el-table-column prop="collectPlanMonitorBath" label="批次" align="center"></el-table-column>
                    <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
                    <el-table-column label="采集表名称" align="center" prop="collectTableName"></el-table-column>
                    <el-table-column label="采集数据文件路径" align="center" prop="filePath"></el-table-column>
                    <el-table-column label="数据类型" align="center" prop="dataType">
                        <template slot-scope="scope">
                            <div class="tac" v-if="scope.row.dataType=='1'">医院</div>
                            <div class="tac" v-if="scope.row.dataType=='2'">医保</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="采集人" align="center" prop="collectUserName"></el-table-column>
                    <el-table-column label="开始时间" align="center">
                        <template slot-scope="scope">{{scope.row.startTime | datetimeformat}}</template>
                    </el-table-column>
                    <el-table-column label="结束时间" align="center">
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
                            <el-button @click="editClick(scope.row.collectPlanMonitorId)" type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination 
                :page-size="apComServerData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="apComServerData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="apComServerData.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                ></el-pagination>
            <!-- <InsuranceList  v-if="activeName == 'audit'" ref="audit"></InsuranceList> -->
            </el-tab-pane>
         <!--医院数据-->
        <el-tab-pane label="医院数据" name="pass">
             <div  v-if="activeName == 'pass'">
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
            <!-- <HospitalList v-if="activeName == 'pass'" ref="pass" @satDataHospital='satDataHospital' @dataList ="dataForm"></HospitalList></el-tab-pane> -->
        </el-tab-pane> 
        <!--医院基本信息 暂时注释-->
        <!-- <el-tab-pane label="医院基本信息" name="noPass">
            <InformationList v-if="activeName == 'noPass'" @satDatalist='satDatalist' ref="noPass" @dataList ="dataForm"></InformationList>
        </el-tab-pane> -->
        </el-tabs>
         <!-- 查看弹框-->
        <el-dialog title='查看日志' :close-on-click-modal="false" width="50%" :modal-append-to-body="false" :visible.sync="editShowVisible">
            <Edit v-if="editShowVisible" @close="closeEditDrawer" @ok="EditSucceed" :collectPlanMonitorId="collectPlanMonitorId"></Edit>
        </el-dialog>
    </div>
</template>
<script>
import InsuranceList from './component/InsuranceList.vue'
import HospitalList from './component/HospitalList.vue'
import InformationList from './component/InformationList.vue'
import Edit from './component/edit.vue'
import NotImport from './component/notImport.vue'
import ViewProgress from './component/viewProgress.vue'
export default {
    components:{
        InsuranceList,
        HospitalList,
        InformationList,
        Edit,
        NotImport,
        ViewProgress
    },
    data(){
        return{
            dataForm:{
                fileName:'',
                filePath:'',
                collectStatus:'',
                startTimeEnd:'',
                startTimeBegin:''
            },
            options:[{
                value:'0',
                label:'待采集'
            },{
                value:'1',
                label:'进行中'
            },{
                value:'2',
                label:'已完成'
            },{
                value:'3',
                label:'失败'
            }],
            activeName:'audit',
            tableList:[],//医保数据 医院基本信息
            tableData:[], //医院数据
            editShowVisible:false,  //弹框显示
            showViewVisible:false,
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageIndex:1,
                total:0,
            },
            collectPlanMonitorId:'',
            dataLoading:false,
            dataList:'',
            notImportVisible:false, //未导入医院弹框
            showViewVisible:false,
            multipleSelection:'',
            dataListLoading:false,
        }
    },
    activated(){
        this.getInitList()
    },
    methods:{
        //多选
        handleSelectionChange(val){
             this.multipleSelection = val
        },
        
        //tab事件
        handleClick(tab,event){
            if(tab.name == 'audit'){
                this.activeName = tab.name;
                this.getInitList()
            }else if(tab.name == 'pass'){
                this.activeName = tab.name;
                this.getDataList()
            }
          

        },
        //初始化数据
        getInitList(){
            this.dataLoading = true
            this.$http({
                url:this.$http.adornUrl('/collectPlanMonitor/selectPageList'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize:this.apComServerData.pageSize,
                    pageNo:this.apComServerData.pageIndex,
                    fileName:this.dataForm.fileName || '',
                    filePath:this.dataForm.filePath || '',
                    collectStatus:this.dataForm.collectStatus || '',
                    startTimeBegin:this.dataForm.startTimeBegin || '',
                    startTimeEnd:this.dataForm.startTimeEnd || ''
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableList = data.result.records
                    this.apComServerData.total = data.result.total                   
                }else{
                    this.tableList = []
                    this.apComServerData.total = 0
                }
                this.dataLoading = false;
            })
        },
        //停止采集
        getStopCollection(){
            if(this.multipleSelection.length == 0 || this.multipleSelection.length > 1){
                this.$confirm('请勾选一条数据','信息',{ 
                confirmButtonText:'关闭',
                type: 'warning',
                })
            }else{

            }
        },
        //查看
        editClick(id){
            this.editShowVisible = true
            this.collectPlanMonitorId = id
        },
        //医院数据
        getDataList(){
            this.dataListLoading = true;
            this.$http({
                url:this.$http.adornUrl('/hospitalCollectPlan/selectPageList'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize:this.apComServerData.pageSize,
                    pageNo:this.apComServerData.pageIndex,
                    filePath:this.dataForm.filePath || '',
                    collectStatus:this.dataForm.collectStatus || '',
                    startTimeBegin:this.dataForm.startTimeBegin || '',
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
        
        EditSucceed(){this.closeEditDrawer()},
        closeEditDrawer(){ this.editShowVisible = false},
        //关闭弹框
        ImportSucceed(){this.closeImportDrawer() },
        closeImportDrawer(){this.notImportVisible = false},
        //关闭弹框
        viewSucceed(){  this.closeViewDrawer() },
        closeViewDrawer(){ this.showViewVisible = false },
        // 页数
        handleSizeChange(val){
            if(this.activeName === 'audit'){
                this.apComServerData.pageSize = val;
                this.apComServerData.pageIndex = 1
                this.getInitList()
            }else if(this.activeName === 'pass'){
                this.apComServerData.pageSize = val;
                this.apComServerData.pageIndex = 1
                this.getDataList()
            }
        },
        //当前页
        handleCurrentChange(val){
            if(this.activeName === 'audit'){
                this.apComServerData.pageIndex = val;
                this.getInitList()
            }else if(this.activeName === 'pass'){
                this.apComServerData.pageIndex = val;
                this.getDataList()
            }
        },
        //重置
        getReset(){
            this.dataForm.fileName = '',
            this.dataForm.filePath = '',
            this.dataForm.collectionStatus = '',
            this.dataForm.startTimeBegin = '',
            this.dataForm.startTimeEnd = ''  
            this.apComServerData.pageIndex = 1
        },
        //查询
        getSearch(){
            if(this.activeName === 'audit'){
                this.getInitList()
            }else if(this.activeName === 'pass'){
                this.getDataList()
            }
        },
         //查看未导入数据
        getStopCollection(){
            this.notImportVisible = true
        },
    }
}
</script>
<style lang="scss" scoped>
.line{
    text-align: center;
}
.listDisplay{
    text-align: right;
    margin-bottom: 10px;
}
.line{
    text-align: center;
}
</style>