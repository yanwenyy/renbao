 <!-- 数据质量导出 -->
<template>
    <div class="dataExport">
        <el-form :inline="true" :model="dataForm" v-if="activeName == 'hospital'">
            <el-form-item label="医院名称:">
                <el-input v-model="dataForm.hospitalName" placeholder="请输入文件路径"></el-input>
            </el-form-item>
             <el-form-item label="校验状态:">
                <el-select v-model="dataForm.checkStatus" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getSearch()">查询</el-button>
                <el-button @click="getReset()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <!--医保数据-->
            <el-tab-pane label="医保数据" name="insurance">
                <div v-if="activeName == 'insurance'">
                <div class='listDisplay'>
                    <el-button type="primary" @click="getSearch()">刷新</el-button>
                    <el-button type="primary" @click="downloadClick">下载报告</el-button>
                    <el-button type="primary" @click="startCheck">开始校验</el-button>
                </div>
                <el-table :data="tableList" border stripe style="width: 100%"  :height="tableHeight-85" v-loading="dataLoading">
                    <el-table-column label="序号" prop='ruleNumber' align="center" width="50"></el-table-column>
                    <el-table-column label="校验规则" align="center" prop="ruleContent"></el-table-column>
                    <el-table-column label="校验状态" align="center" prop="checkStatus">
                        <template slot-scope="scope">
                            <div v-if="scope.row.checkStatus == '0'">待校验</div>
                            <div v-if="scope.row.checkStatus == '1'">校验中</div>
                            <div v-if="scope.row.checkStatus == '2'">校验成功</div>
                            <div v-if="scope.row.checkStatus == '3'" style="color:red">校验失败</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="校验结果" align="center" prop="checkResult">
                        <template slot-scope="scope">
                        <div class="tac" v-if="scope.row.checkResult=='成功'">成功</div>
                        <div class="tac" v-if="scope.row.checkResult=='失败'" style="color:red">失败</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" prop="affirmStatus">
                        <template slot-scope="scope">
                            <el-button @click="tableSqlView(scope.row.dataCeeckTemplateProjectId)" type="text" size="small">查看sql</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                </div>
                <!-- <InsuranceData  v-if="activeName == 'insurance'" ref="insurance"></InsuranceData> -->
            </el-tab-pane>
            <!--医院数据-->
            <el-tab-pane label="医院数据" name="hospital">
                <div v-if="activeName == 'hospital'">
                    <div class='listDisplay'>
                        <el-button type="primary" @click="addClick()">新增校验</el-button>
                        <el-button type="primary" @click="getStartclick()">开始校验</el-button>
                    </div>
                    <el-table :data="tableData" border stripe style="width: 100%"  :height="tableHeight-85" v-loading='dataLoading' @selection-change="handleSelectionChange">
                        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                        <el-table-column label="医院名称" align="center" prop="hospitalName"> </el-table-column>
                        <el-table-column label="校验进度" align="center" prop="checkStatus">
                           <template slot-scope="scope">
                            <el-progress v-if="scope.row.checkStatus=='0'" :percentage="0"></el-progress>
                            <el-progress v-if="scope.row.checkStatus=='1'" :percentage="50"></el-progress>
                            <el-progress v-if="scope.row.checkStatus=='2'" :percentage="100"></el-progress>
                            <el-progress v-if="scope.row.checkStatus=='3'" :percentage="100"></el-progress>
                        </template>
                        </el-table-column>
                        <el-table-column label="采集人" align="center" prop="collectUserName"> </el-table-column>
                        <el-table-column label="确认人" align="center" prop="affirmUserName"></el-table-column>
                        <el-table-column label="校验状态" align="center" prop="checkStatus">
                            <template slot-scope="scope">
                                <div v-if="scope.row.checkStatus == '0'">待校验</div>
                                <div v-if="scope.row.checkStatus == '1'">校验中</div>
                                <div v-if="scope.row.checkStatus == '2'">校验成功</div>
                                <div v-if="scope.row.checkStatus == '3'" style="color:red">校验失败</div>
                            </template> </el-table-column>
                        <el-table-column label="日志" align="center" prop="startDate">
                            <template slot-scope="scope">
                                <el-button @click="detail(scope.row)" type="text" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="合格状态" align="center" prop="affirmStatus">
                            <template slot-scope="scope">
                                <div v-if="scope.row.affirmStatus == '0'">已确认合格</div>
                                <div v-if="scope.row.affirmStatus == '1'">已确认不合格</div>
                            </template> 
                        </el-table-column>
                        <el-table-column label="批次" align="center" prop="bathNo"></el-table-column>
                        <el-table-column align="center" label="操作" prop="affirmStatus">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click='qualified(scope.row.dataQualityId,0)'>合格</el-button>
                                <el-button @click="qualified(scope.row.dataQualityId,1)" type="text" size="small">不合格</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    ></el-pagination>
                    <el-dialog title="新增校验" :visible.sync="ShowAddVisible">
                        <el-table :data="addTableList" border @selection-change="handleSelectionChange" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" style="width: 100%;">
                            <el-table-column  type="selection" header-align="center" align="center" width="50" />
                            <el-table-column prop="hospitalName" align="center" label="医院名称"></el-table-column>
                            <el-table-column prop="hospitalCollectPlanBath" align="center" label="批次"></el-table-column>
                            <el-table-column prop="collectStatus" align="center" label="采集状态">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.collectStatus == '2'">已完成</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="itemBtn" slot="footer">
                            <el-button type="primary" @click="startsClick()">开始校验</el-button>
                        </div>
                    </el-dialog>
                    <!-- 查看弹框-->
                    <el-dialog :close-on-click-modal="false" width="50%" :modal-append-to-body="false" :visible.sync="detailShowVisible">
                        <Detail v-if="detailShowVisible" @close="closeDetailDrawer" @ok="DetailSucceed" :hospitalCollectPlanId='hospitalCollectPlanId'></Detail>
                    </el-dialog>
                </div>
                <!-- <Hospitaldata v-if="activeName == 'hospital'" ref="hospital"></Hospitaldata> -->
            </el-tab-pane>
         </el-tabs>
        <el-dialog title='查看Sql日志' :close-on-click-modal="false" width="50%" :visible.sync="showSqlViewVisible">
            <sqlView v-if="showSqlViewVisible" :sqlId = 'sqlId'></sqlView>
            <span slot="footer" class="dialog-footer" style="text-align:center">
                <el-button @click="showSqlViewVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Detail from './component/detail.vue'
import Hospitaldata from './component/Hospitaldata.vue'
import sqlView from './component/sqlView.vue'
export default {
    components:{
        Hospitaldata,
        Detail,sqlView
    },
    data(){
        return{
            dataForm:{
                hospitalName:'',
                checkStatus:'',
            },
            options:[{
                value:'0',
                label:'待校验'
            },{
                value:'1',
                label:'校验中'
            },{
                value:'2',
                label:'校验成功'
            }, {
                value:'3',
                label:'校验失败'
            }],
            activeName:'insurance',
            tableList:[],
            tableData:[],
            addTableList:[], //新增校验teble
            detailShowVisible:false,
            showSqlViewVisible:false,//查看sql
            dataLoading:false, //loading
            ShowAddVisible:false,
            token:'',
            ruleType:'',
            dataQualityId:'',
            pageIndex:1,
            pageSize:10000,
            total:0,
            hospitalCollectPlanId:'',
            multipleSelection:'',
            selectId:'', //新增校验id,
            startClick:false,
            sqlId:'',
        }
    },
    computed:{
        tableHeight: {
        get () { return this.$store.state.common.tableHeight}
        },
    },
    created(){
          this.token = this.$cookie.get("token");
    },
    mounted(){
        this.getInitList()
    },
    methods:{
        //多选
        handleSelectionChange(val){
             this.multipleSelection = val
        },
        //tab事件
        handleClick(tab,event){
            if( tab.name =='insurance'){
                this.activeName = 'insurance';
                this.getInitList()
            }else if(tab.name =='hospital'){
                this.activeName = 'hospital';
                this.initTableList()
            }
        },
        //初始化医保数据
        getInitList(){
            this.dataLoading = true
            this.$http({
                url:this.$http.adornUrl('/dataQualityReport/dataQualityReportList'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize:this.pageSize,
                    pageNo:this.pageIndex,
                    ruleType:2,
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableList = data.result.records
                    if(this.tableList.length > 1){
                        this.startClick = false
                    }else{
                        this.startClick = true
                    }
                    // this.apComServerData.total = data.result.total
                }else{
                    this.tableList = []
                    // this.apComServerData.total = 0
                }
                this.dataLoading = false;
            })
        },
        //医院table数据
        initTableList(id){
            this.dataLoading = true
            this.$http({
                url:this.$http.adornUrl('/dataQualityReport/dataQualityList'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNo:this.pageIndex,
                    pageSize:this.pageSize,
                    hospitalName:this.dataForm.hospitalName,
                    checkStatus :this.dataForm.checkStatus
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableData = data.result.records
                    this.total = data.result.total
                }else{
                    this.tableData = []
                    this.total = 0
                }
                this.dataLoading = false;
            })
        },
        //查询
        getSearch(){
            if(this.activeName === 'insurance'){
                this.getInitList()
            }else if(this.activeName === 'hospital'){
                this.initTableList()
            }
        },
            
        //重置
        getReset(){
            this.dataForm.hospitalName = '',
            this.dataForm.checkStatus=''
        },
        //查看
        detail(row){
            this.detailShowVisible = true
            this.hospitalCollectPlanId = row.hospitalCollectPlanId
        },

        //弹框按钮事件
        DetailSucceed(){
            this.closeDetailDrawer()
        },
        closeDetailDrawer(){
            this.detailShowVisible = false
        },
        // 下载报告
        downloadClick(){
            let url =
                this.$http.adornUrl(
                "dataQualityReport/excelDataExport?ruleType=" +
                    2  +
                    "&token="
                ) + this.$cookie.get("token");
            window.open(url);
        },

         //新增校验
        addClick(){
            this.ShowAddVisible = true;
            this.$http({
                url:this.$http.adornUrl('dataQualityReport/hospitalList'),
                method: 'get',
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.addTableList = data.result
                }else{
                    this.addTableList = []
                }
            })
        },

        //医院重复校验
        getStartclick(){
            for(let i =0;i<this.multipleSelection.length;i++){
                this.selectId = this.multipleSelection[i].dataQualityId
            }
            // if(this.tableData.length >= 1 || this.tableData.length == 0){
            //     this.$message({
            //         message: "请先新增校验",
            //         type: "warning"
            //     });
            // }
            if(this.multipleSelection.length == 0 || this.multipleSelection.length > 1){
                this.$confirm(`请选择至少一条数据`, "提示",{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() =>{ 
                }).catch(() => {
                    
                })
            }else{
                this.$http({
                    url:this.$http.adornUrl('/dataQualityCheckPlan/dataQualityCheckExecute'),
                    method: 'get',
                    params: this.$http.adornParams({
                        ruleType:1,
                        dataQualityId:this.selectId,
                    })
                }).then(({data}) =>{
                    if(data && data.code === 200){
                        this.$message({
                        message: '校验成功',
                        type: 'success',
                        })
                    }else{
                        this.$message.error(data.message)
                    }
                })
            }
        },

        //医院数据开始校验事件
        startsClick(){
            for(let i =0;i<this.multipleSelection.length;i++){
                this.selectId = this.multipleSelection[i].hospitalCollectPlanId
            }
            if(this.multipleSelection.length == 0 || this.multipleSelection.length > 1){
                 this.$confirm('请勾选一条数据','信息',{
                    confirmButtonText:'关闭',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消校验'
                    });
                })
            }else {
                this.$http({
                    url:this.$http.adornUrl('/dataQualityCheckPlan/dataQualityCheckAdd'),
                    method: 'get',
                    params: this.$http.adornParams({
                        ruleType:1,
                        hospitalCollectPlanId:this.selectId,
                    })
                }).then(({data}) =>{
                    if(data && data.code === 200){
                        this.$message({
                        message: '新增成功',
                        type: 'success',
                        onClose: () => {
                            this.ShowAddVisible=false;
                            this.initTableList(this.selectId);
                        }
                    })              
                    }else{
                        this.$message.error(data.message)
                    }
                })
            }
        },

        //确认合格
        qualified(id,status){
            this.$confirm(`确定进行此操作?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() =>{
                this.$http({
                    url:this.$http.adornUrl('/dataQualityReport/affirmStatus0'),
                    method: 'get',
                    params: this.$http.adornParams({
                        dataQualityId:id,
                        affirmStatus:status
                    })
                }).then(({data}) =>{
                    if(data && data.code === 200){
                        this.$message({
                            message: "操作成功",
                            type: "success",
                            duration: 1500,
                        });
                        this.initTableList()
                    }else{
                        this.$message.error("操作失败");
                    }
                })
            }).catch(() => {})
        }, 
        // 页数
        handleSizeChange(val){
            if(this.activeName === 'insurance'){
                this.apComServerData.pageSize = val;
                this.apComServerData.pageIndex = 1
                this.getInitList()
            }else if(this.activeName === 'hospital'){
                this.apComServerData.pageSize = val;
                this.apComServerData.pageIndex = 1
                this.initTableList()
            }
        },
        //当前页
        handleCurrentChange(val){
            if(this.activeName === 'insurance'){
                this.apComServerData.pageIndex = val;
                this.getInitList()
            }else if(this.activeName === 'hospital'){
                this.apComServerData.pageIndex = val;
                this.initTableList()
            }
        },
        //医保开始校验
        startCheck(){
            if(this.tableList.length == 0){
                 this.$confirm('当前校验规则为空不可校验','信息',{
                    confirmButtonText:'关闭',
                    cancelButtonText: '取消',
                    type: 'warning',
                 })
            }else if(this.tableList.length >1){
                 this.$http({
                    url:this.$http.adornUrl('/dataQualityCheckPlan/dataQualityCheckExecute'),
                    method: 'get',
                    params: this.$http.adornParams({
                        ruleType:2,
                    })
                }).then(({data}) =>{
                    if(data && data.code === 200){
                        this.getInitList()     
                        this.$message({
                        message: '校验中，点击刷新查看规则校验进度！',
                        type: 'success',
                        })         
                    }else{
                        this.$message.error(data.message)
                    }
                })
            }else{
                // this.$http({
                //     url:this.$http.adornUrl('/dataQualityCheckPlan/dataQualityCheckAdd'),
                //     method: 'get',
                //     params: this.$http.adornParams({
                //         ruleType:2,
                //     })
                // }).then(({data}) =>{
                //     if(data && data.code === 200){
                //         this.$message({
                //         message: '校验成功',
                //         type: 'success',
                //     })      
                //     this.getInitList()        
                //     }else{
                //         this.$message.error(data.message)
                //     }
                // })
            }
        },
        //医保查看日志
        tableSqlView(id){
            this.showSqlViewVisible = true
            this.sqlId = id
        }
    }
}
</script>
<style lang="scss" scoped>
.listDisplay{
    text-align: right;
    margin-bottom: 10px;
}
</style>
