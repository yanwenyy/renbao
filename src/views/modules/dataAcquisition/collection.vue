<template>
    <div class='collection'>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item label="文件名：">
                <el-input v-model="dataForm.fileName" placeholder="请输入文件名"></el-input>
            </el-form-item>
            <el-form-item label="文件路径：">
                <el-input v-model="dataForm.filePath" placeholder="请输入文件路径"></el-input>
            </el-form-item>
             <el-form-item label="采集状态：">
                <el-select v-model="dataForm.collectionStatus" placeholder="已完成" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间：">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.timeStart" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-time-picker placeholder="选择日期" v-model="dataForm.timeEnd" style="width: 100%;"></el-time-picker>
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
               <el-table :data="tableList" border :header-cell-style="{textAlign:'center'}" style="width: 100%">
                    <el-table-column type="selection" align="center" width="50"></el-table-column>
                    <el-table-column prop="batch" label="批次" align="center"></el-table-column>
                    <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
                    <el-table-column label="采集数据文件路径" align="center" prop="filepath"></el-table-column>
                    <el-table-column label="数据类型" align="center" prop="dataType"></el-table-column>
                    <el-table-column label="采集人" align="center" prop="Collector"></el-table-column>
                    <el-table-column label="开始时间" align="center" prop="startDate"></el-table-column>
                    <el-table-column label="结束时间" align="center" prop="endDate"></el-table-column>
                    <el-table-column label="状态" align="center" prop="stauts">
                        <template slot-scope="scope">
                            <div class="tac" v-if="scope.row.stauts=='0'">已完成</div>
                            <div class="tac" v-if="scope.row.stauts=='1'">进行中</div>
                            <div class="tac" v-if="scope.row.stauts=='2'">失败</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="进度" align="center" prop="schedule">
                        <template slot-scope="scope"><el-progress :percentage="parseFloat(scope.row.schedule)"></el-progress></template>
                    </el-table-column>
                    <el-table-column align="center" label="日志">
                        <template slot-scope="scope">
                            <el-button @click="editClick(scope.row.businessId)" type="text" size="small">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <InsuranceList  v-if="activeName == 'audit'" ref="audit"></InsuranceList> -->
            </el-tab-pane>
         <!--医院数据-->
        <el-tab-pane label="医院数据" name="pass">
            <div v-if="activeName == 'pass'">
                <div class='listDisplay'>
                    <el-button type="warning" @click="getStopCollection()">查看未导入医院</el-button>
                </div>
                <el-table :data="tableDataPass" border stripe style="width: 100%">
                    <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                    <el-table-column label="批次" align="center" prop="batch"> </el-table-column>
                    <el-table-column label="医院名称" align="center" prop="pName"></el-table-column>
                    <el-table-column label="采集数据文件路径" align="center" prop="floor"> </el-table-column>
                    <el-table-column label="数据类型" align="center" prop="spaceNum"></el-table-column>
                    <el-table-column label="采集人" align="center" prop="Collector"> </el-table-column>
                    <el-table-column label="开始时间" align="center" prop="startDate"></el-table-column>
                    <el-table-column label="结束时间" align="center" prop="endDate"> </el-table-column>
                    <el-table-column label="状态" align="center" prop="spaceStatus">
                        <template slot-scope="scope">
                            <div class="tac" v-if="scope.row.spaceStatus=='0'">已完成</div>
                            <div class="tac" v-if="scope.row.spaceStatus=='1'">进行中</div>
                            <div class="tac" v-if="scope.row.spaceStatus=='2'">失败</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="进度" align="center" prop="schedule">
                        <template slot-scope="scope"><el-progress :percentage="parseFloat(scope.row.schedule)"></el-progress></template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="edit(scope.row.id)" size="mini">查看进度</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <HospitalList v-if="activeName == 'pass'" ref="pass"></HospitalList></el-tab-pane> -->
            </el-tab-pane> 
        <!--医院基本信息-->
        <el-tab-pane label="医院基本信息" name="noPass">
            <div v-if="activeName == 'noPass'">
                <el-table :data="tableList" border stripe style="width: 100%">
                    <el-table-column type="selection"  header-align="center" align="center" width="50"></el-table-column>
                    <el-table-column label="批次" align="center" prop="pName"> </el-table-column>
                    <el-table-column label="文件名" align="center" prop="fileName"></el-table-column>
                    <el-table-column label="采集数据文件路径" align="center" prop="floor"> </el-table-column>
                    <el-table-column label="采集人" align="center" prop="Collector"> </el-table-column>
                    <el-table-column label="开始时间" align="center" prop="startDate"></el-table-column>
                    <el-table-column label="结束时间" align="center" prop="endDate"> </el-table-column>
                    <el-table-column label="状态" align="center" prop="stauts">
                        <template slot-scope="scope">
                            <div class="tac" v-if="scope.row.stauts=='0'">已完成</div>
                            <div class="tac" v-if="scope.row.stauts=='1'">进行中</div>
                            <div class="tac" v-if="scope.row.stauts=='2'">失败</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="进度" align="center" prop="schedule">
                        <template slot-scope="scope"><el-progress :percentage="parseFloat(scope.row.schedule)"></el-progress></template>
                    </el-table-column>
                    <el-table-column align="center"  label="操作">
                        <template slot-scope="scope">
                            <el-button @click="editClick(scope.row.businessId)" size="mini">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <InformationList v-if="activeName == 'noPass'" ref="noPass"></InformationList> -->
        </el-tab-pane>
        </el-tabs>
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
            <Edit v-if="editShowVisible" @close="closeEditDrawer" @ok="EditSucceed" :businessId="businessId" ></Edit>
        </el-dialog>
        <!-- 查看未导入医院弹框-->
        <el-dialog title='查看未导入医院' :close-on-click-modal="false" width="50%" :modal-append-to-body="false" :visible.sync="notImportVisible">
            <NotImport v-if="notImportVisible" @close="closeImportDrawer" @ok="ImportSucceed"></NotImport>
        </el-dialog>
        <!-- 查看进度弹框-->
        <el-dialog title='查看进度' :close-on-click-modal="false" width="80%" :modal-append-to-body="false" :visible.sync="showViewVisible">
            <ViewProgress v-if="showViewVisible" @close="closeViewDrawer" @ok="viewSucceed"></ViewProgress>
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
                collectionStatus:'',
                timeEnd:'',
                timeStart:''
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
            }],
            activeName:'audit',
            tableList:[],//医保数据 医院基本信息
            tableDataPass:[],//医院数据
            editShowVisible:false,  //弹框显示
            notImportVisible:false,
            showViewVisible:false,
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageIndex:1,
                total:0,
            },
            businessId:''
        }
    },
    mounted(){
        this.getInitList()
    },
    methods:{
        //tab事件
        handleClick(tab,event){
            this.activeName = tab.name;
            if(this.activeName == 'noPass'){
                this.getInitList()
            }
        },
        //初始化数据
        getInitList(){
            this.$http({
                url:this.$http.adornUrl('/collectPlanMonitor/selectPageList'),
                method: 'get',
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
            this.$confirm('请勾选一条数据','信息',{
                confirmButtonText:'关闭',
                type: 'warning',
            })
        },
        //查看
        editClick(id){
            this.editShowVisible = true
            this.businessId = id
        },
        //医院查看进度
        edit(){
            this.showViewVisible = true
        },

        //医院查看未导入数据
        getStopCollection(){
            this.notImportVisible = true
        },
        //关闭弹框
        ImportSucceed(){this.closeImportDrawer()},
        closeImportDrawer(){ this.notImportVisible = false },
        viewSucceed(){ this.closeViewDrawer()},
        closeViewDrawer(){this.showViewVisible = false},
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
            this.getDataList()
        },
        //当前页
        handleCurrentChange(val){
            this.apComServerData.pageIndex = val;
            this.getDataList()
        },
        //重置
        resetForm(formName){
            this.dataForm = {
                fileName:'',
                filePath:'',
                collectionStatus:'',
                timeEnd:'',
                timeStart:''
            }
            this.$refs[formName].resetFields()
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