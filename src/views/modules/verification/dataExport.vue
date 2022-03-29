 <!-- 数据质量导出 -->
<template>
    <div class="dataExport">
        <el-form :inline="true" :model="dataForm">
            <el-form-item label="数据名称：">
                <el-select v-model="dataForm.dataName" placeholder="请选择" clearable>
                    <el-option v-for="item in dataOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="批次：">
                <el-input v-model="dataForm.bathNo" placeholder="请输入文件路径"></el-input>
            </el-form-item>
             <el-form-item label="校验状态：">
                <el-select v-model="dataForm.checkStatus" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getSearch()">查询</el-button>
                <el-button @click="getReset('dataForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <!--医保数据-->
            <el-tab-pane label="医保数据" name="insurance">
                <div v-if="activeName == 'insurance'">
                <div class='listDisplay'>
                    <el-button type="primary" @click="downloadClick">下载报告</el-button>
                </div>
                <el-table :data="tableList" border stripe style="width: 100%"  :height="tableHeight-85" v-loading="dataLoading" >
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
                <!-- 查看弹框-->
                <!-- <el-dialog :close-on-click-modal="false" width="50%" :modal-append-to-body="false" :visible.sync="detailShowVisible">
                    <Detail v-if="detailShowVisible" @close="closeDetailDrawer" @ok="DetailSucceed"></Detail>
                </el-dialog> -->
                </div>
                <!-- <InsuranceData  v-if="activeName == 'insurance'" ref="insurance"></InsuranceData> -->
            </el-tab-pane>
            <!--医院数据-->
            <el-tab-pane label="医院数据" name="hospital">
                <div v-if="activeName == 'hospital'">
                    <div class='listDisplay'>
                        <el-button type="primary" @click="addClick()">新增校验</el-button>
                    </div>
                    <el-table :data="tableData" border stripe style="width: 100%"  :height="tableHeight-85" v-loading='dataLoading'>
                        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                        <el-table-column label="医院名称" align="center" prop="hospitalName"> </el-table-column>
                        <el-table-column label="校验进度" align="center" prop="schedule">
                            <!-- <template slot-scope="scope">
                                <el-progress :percentage="parseFloat(scope.row.schedule)"></el-progress>
                            </template> -->
                        </el-table-column>
                        <el-table-column label="采集人" align="center" prop="collectUserName"> </el-table-column>
                        <el-table-column label="确认人" align="center" prop="spaceNum"></el-table-column>
                        <el-table-column label="校验状态" align="center" prop="checkStatus">
                            <template slot-scope="scope">
                                <div v-if="scope.row.checkStatus == '0'">进行中</div>
                                <div v-if="scope.row.checkStatus == '1'">已完成</div>
                                <div v-if="scope.row.checkStatus == '2'">失败</div>
                            </template> </el-table-column>
                        <el-table-column label="日志" align="center" prop="startDate">
                            <template slot-scope="scope">
                                <el-button @click="detail(scope.row.id)" type="text" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="批次" align="center" prop="bathNo"></el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button @click="determineClick(scope.row.id)" type="text" size="small">{{qualified}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-dialog title="新增校验" :visible.sync="ShowAddVisible">
                        <el-table :data="addTableList" border @selection-change="handleSelectionChange" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" style="width: 100%;">
                            <el-table-column  type="selection" header-align="center" align="center" width="50" />
                            <el-table-column prop="hospitalName" align="center" label="医院名称"></el-table-column>
                            <el-table-column prop="bathNo" align="center" label="批次"></el-table-column>
                            <el-table-column prop="checkStatus" align="center" label="采集状态">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.checkStatus == '2'">已完成</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="itemBtn" slot="footer">
                            <el-button type="primary" @click="startsClick()">开始校验</el-button>
                        </div>
                    </el-dialog>
                    <!-- 查看弹框-->
                    <el-dialog :close-on-click-modal="false" width="50%" :modal-append-to-body="false" :visible.sync="detailShowVisible">
                        <Detail v-if="detailShowVisible" @close="closeDetailDrawer" @ok="DetailSucceed"></Detail>
                    </el-dialog>
                </div>
                <!-- <Hospitaldata v-if="activeName == 'hospital'" ref="hospital"></Hospitaldata> -->
            </el-tab-pane>
         </el-tabs>
    </div>
</template>
<script>
import Detail from './component/detail.vue'
import Hospitaldata from './component/Hospitaldata.vue'
export default {
    components:{
        Hospitaldata,
        Detail
    },
    data(){
        return{
            dataForm:{
                dataName:'',
                checkStatus:'',
                bathNo:''
            },
            dataOptions:[{
                value:'0',
                label:'北京部分医保数据.csv'
            },{
                value:'1',
                label:'slybdata20210707.dmp'
            }],
            options:[{
                value:'0',
                label:'进行中'
            },{
                value:'1',
                label:'已完成'
            },{
                value:'2',
                label:'失败'
            }],
            activeName:'insurance',
            tableList:[],
            tableData:[],
            addTableList:[], //新增校验teble
            detailShowVisible:false,
            dataLoading:false, //loading
            ShowAddVisible:false,
            multipleSelection:[],
            token:'',
            qualified:'确定合格',
            ruleType:'',
            dataQualityId:'',
            projectId:'',
            exportList:[],
            pageIndex:1,
            pageSize:10

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
    mounted(){this.getInitList()},
    methods:{
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
            // this.dataLoading = true
            // this.$http({
            //     url:this.$http.adornUrl('/dataQualityReport/dataQualityReportList'),
            //     method: 'get',
            //     params: this.$http.adornParams({
            //         pageSize:this.pageSize,
            //         pageNo:this.pageIndex
            //     })
            // }).then(({data}) =>{
            //     if(data && data.code === 200){
            //         this.tableList = data.result.records
            //         // this.apComServerData.total = data.result.total
            //     }else{
            //         this.tableList = []
            //         // this.apComServerData.total = 0
            //     }
            //     this.dataLoading = false;
            // })
        },
        //医院table数据
        initTableList(){
            // this.dataLoading = true
            // this.$http({
            //     url:this.$http.adornUrl('/dataQualityReport/dataQualityList'),
            //     method: 'get',
            //     params: this.$http.adornParams({
            //         pageSize:this.pageSize,
            //         pageNo:this.pageIndex
            //     })
            // }).then(({data}) =>{
            //     if(data && data.code === 200){
            //         this.tableData = data.result.records
            //         // this.apComServerData.total = data.result.total
            //     }else{
            //         this.tableList = []
            //         // this.apComServerData.total = 0
            //     }
            //     this.dataLoading = false;
            // })
            },
        //查询
        getSearch(){},
        //重置
        getReset(formName){
             this.dataForm = {
                dataName:'',
                status:'',
                batch:''
            }
            this.$refs[formName].resetFields()
        },
        //查看
        detail(){
            this.detailShowVisible = true
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

        },

         //新增校验
        addClick(){
            this.ShowAddVisible = true;
            this.getDataList()
        },
        //新增校验teble
        getDataList(){
            // let DataQualityCheckVo = {
            //       ruleType:this.ruleType,
            //         dataQualityId:this.dataQualityId,
            //         projectId:this.projectId
            // }
            this.$http({
                url:this.$http.adornUrl('/dataQualityCheckPlan/dataQualityCheckAdd'),
                method: 'get',
                params: this.$http.adornParams({
                    ruleType:1,
                    dataQualityId:'a33b46ea-0400-4e01-ac0b-61cf5ac663da',
                    // projectId:this.projectId
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.addTableList = data.result
                    // this.apComServerData.total = data.result.total
                }else{
                    this.addTableList = []
                    // this.apComServerData.total = 0
                }
            })
        },

        //医院数据开始校验事件
        startsClick(){
            if(this.multipleSelection.length == 0 || this.multipleSelection.length > 1){
                 this.$confirm('请勾选一条数据','信息',{
                    confirmButtonText:'关闭',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    // this.$message({
                    //     type: 'success',
                    //     message: '校验成功!'
                    // });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消校验'
                    });
                })
            }else {
                this.$http({
                    url:this.$http.adornUrl('/dataQualityCheckPlan/dataQualityCheckExecute'),
                    method: 'get',
                    params: this.$http.adornParams({
                        ruleType:1,
                        dataQualityId:'a33b46ea-0400-4e01-ac0b-61cf5ac663da',
                        projectId:this.projectId
                    })
                }).then(({data}) =>{
                    if(data && data.code === 200){
                        this.addTableList = data.result
                        this.$message({
                        message: '新增成功',
                        type: 'success',
                        onClose: () => {
                            this.ShowAddVisible=false;
                            // this.getDataList();
                        }
                    })
                        // this.exportList = data.result
                        // this.$emit('exportList', this.exportList)
                        // this.apComServerData.total = data.result.total
                    }else{
                        this.addTableList = []
                        // this.apComServerData.total = 0
                    }
                })
            }
        },

        //多选
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        //查看
        edit(){},
        //确认合格
        determineClick(){

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
