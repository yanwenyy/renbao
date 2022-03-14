<template>
    <div class='collection'>
        <el-form :inline="true" :model="dataForm">
            <el-form-item label="文件名：">
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
            <el-form-item label="开始时间：">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.startTime" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-time-picker placeholder="选择日期" v-model="dataForm.endTime" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getSearch()">查询</el-button>
                <el-button @click="getReset('dataForm')">重置</el-button>
                <el-button type="warning" @click="getStopCollection()">停止采集</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <!--医保数据-->
            <el-tab-pane label="医保数据" name="audit" >
            <div v-if="activeName == 'audit'">
               <el-table :data="tableList" border :header-cell-style="{textAlign:'center'}" height="600" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="50"></el-table-column>
                    <el-table-column prop="collectPlanMonitorBath" label="批次" align="center"></el-table-column>
                    <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
                    <el-table-column label="采集数据文件路径" align="center" prop="filePath"></el-table-column>
                    <el-table-column label="数据类型" align="center" prop="dataType">
                        <template slot-scope="scope">
                            <div class="tac" v-if="scope.row.dataType=='1'">医院</div>
                            <div class="tac" v-if="scope.row.dataType=='2'">医保</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="采集人" align="center" prop="collectUserName"></el-table-column>
                    <el-table-column label="开始时间" align="center" :formatter="dateFormat" prop="startTime"></el-table-column>
                    <el-table-column label="结束时间" align="center" :formatter="dateEndFormat" prop="endTime"></el-table-column>
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
            <HospitalList v-if="activeName == 'pass'" ref="pass" @satDataHospital='satDataHospital'></HospitalList></el-tab-pane>
        <!--医院基本信息-->
        <el-tab-pane label="医院基本信息" name="noPass">
            <InformationList v-if="activeName == 'noPass'" @satDatalist='satDatalist' ref="noPass" ></InformationList>
        </el-tab-pane>
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
                startTime:'',
                endTime:''
            },
            options:[{
                value:'1',
                label:'已完成'
            },{
                value:'2',
                label:'进行中'
            },{
                value:'3',
                label:'失败'
            },{
                value:'4',
                label:'待采集'
            }],
            activeName:'audit',
            tableList:[],//医保数据 医院基本信息
            tableDataPass:[],//医院数据
            editShowVisible:false,  //弹框显示
            showViewVisible:false,
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageIndex:1,
                total:0,
            },
            collectPlanMonitorId:'',
            dataSelectTable:[], //选中数据

        }
    },
    mounted(){
        this.getInitList()
    },
    methods:{
        satDatalist(data){
            this.dataSelectTable = data
        },
        satDataHospital(data){ this.dataSelectTable = data},
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
        //多选
        handleSelectionChange(val){
            this.dataSelectTable = val
        },
        
        //tab事件
        handleClick(tab,event){
            this.activeName = tab.name;
        },
        //初始化数据
        getInitList(){
            this.tableList = []
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
                    this.tableList = data.result.records
                    this.apComServerData.total = data.result.total
                      
                }else{
                    this.tableList = []
                    this.apComServerData.total = 0
                }
                this.dataListLoading = false;
            })
        },


     
        //停止采集
        getStopCollection(){
            if(this.dataSelectTable.length == 0 || this.dataSelectTable.length > 1){
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

        //进度条
        format(percentage) {
           return percentage === 100 ? '满' : `${percentage}%`;
        },
        EditSucceed(){this.closeEditDrawer()},
        closeEditDrawer(){ this.editShowVisible = false},
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
        //重置
        getReset(formName){
            this.dataForm = {
                fileName:'',
                filePath:'',
                collectionStatus:'',
                timeEnd:'',
                timeStart:''
            }
            this.$refs[formName].resetFields()
        },
        getSearch(){
            this.getInitList()
            // this.$http({
            //     url:this.$http.adornUrl('/collectPlanMonitor/selectPageList'),
            //     method: 'get',
            //     params :this.$http.adornParams({
            //         fileName:this.dataForm.fileName,
            //         filePath:this.dataForm.filePath,
            //         collectStatus:this.dataForm.collectStatus,
            //         startTime:this.dataForm.startTime,
            //         endTime:this.dataForm.endTime
            //     })
            // }).then(({data}) =>{
            //     if(data && data.code === 200){
            //         this.tableList = data.result.records
            //         this.apComServerData.total = data.result.total
            //     }else{
            //         this.tableList = []
            //         this.apComServerData.total = 0
            //     }
            //     this.dataListLoading = false;
            // })
        }
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