<!-- 数据备份管理 -->
<template>
    <div class='dataBackUp'>
        <el-form :inline="true" :model="dataForm" ref="ruleForm">
            <el-form-item label="文件名称:">
                <el-input v-model="dataForm.fileName" placeholder="请输入搜索内容" clearable></el-input>
            </el-form-item>
             <el-form-item label="时间:">
                <el-input v-model="dataForm.formDate" placeholder="请输入搜索内容" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataList()">查询</el-button>
                <el-button @click="resetForm('dataForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <div class='f_right'>
                <el-button size="mini" type="primary" @click="backupsClick">备份</el-button>
                <el-button size="mini" type="primary" @click="reductionClick">还原</el-button>
            </div>
            <el-table :data="tableList" border  :height="tableHeight-45" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="listLoading">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="fileName" header-align="center" align="center" label="文件名称"></el-table-column>
                <el-table-column prop="formDate" header-align="center" align="center" label="时间"></el-table-column>
                <el-table-column prop="fileRoute" header-align="center" align="center" label="路径"> </el-table-column>
                <el-table-column prop="fileType" header-align="center" align="center" label="类型"></el-table-column>
                <el-table-column prop="status" header-align="center" align="center" label="状态">
                    <template slot-scope="scope">
                    <div class="tac" v-if="scope.row.stauts=='0'">已完成</div>
                    <div class="tac" v-if="scope.row.stauts=='1'">进行中</div>
                    <div class="tac" v-if="scope.row.stauts=='2'">备份失败</div>
                    </template>
                </el-table-column>
                <el-table-column prop="schedule" header-align="center" align="center" label="进度">
                    <template slot-scope="scope"><el-progress :percentage="parseFloat(scope.row.schedule)"></el-progress></template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="detailClick(scope.row.id)" type="text" size="small">查看日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="apComServerData.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="apComServerData.pageSize"
            :total="apComServerData.total"
            layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <el-dialog title="日志" :visible.sync="showDetailVisible">
            <el-table :data="tableData" border :height="tableHeight-45" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                <el-table-column prop="verSteps" min-width='150px' align="center" label="校验步骤"></el-table-column>
                <el-table-column prop="verStatus" align="center" label="校验状态">
                    <template slot-scope="scope">
                        <div class="tac" v-if="scope.row.verStatus=='0'">已完成</div>
                        <div class="tac" v-if="scope.row.verStatus=='1'">执行中</div>
                        <div class="tac" v-if="scope.row.verStatus=='2'">待执行</div>
                    </template>
                </el-table-column>
                <el-table-column prop="verResult" align="center" label="校验结果">
                      <template slot-scope="scope">
                        <div class="tac" v-if="scope.row.verResult=='0'">通过</div>
                        <div class="tac" v-if="scope.row.verResult=='1'">不通过</div>
                    </template>
                </el-table-column>
            </el-table>
             <div class="itemBtn" slot="footer">
                <el-button type="primary" @click="showDetailVisible = false">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog title="备份" :visible.sync="ShowAddVisible">
            <el-form :model="addMemberForm" ref="addMemberForm" label-width="150px">
                 <el-form-item label="备份名:">
                    <el-input class="input-hasBtn" v-model="addMemberForm.dataName" placeholder="请输入备份名" style="width:75%"></el-input>
                </el-form-item>
                <el-form-item label="备份路径:">
                    <el-input class="input-hasBtn" v-model="addMemberForm.dataAmount" placeholder="选择" style="width:75%"></el-input>
                    <el-button type="primary" @click="chooseListVisible=true" style="margin-left:10px">选择</el-button>
                </el-form-item>
            </el-form>
            <div style='text-align:center'>
                <el-button @click="ShowAddVisible = false">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="还原" :visible.sync="ShowRestoreVisible">
            <el-form :model="addRestoreForm" ref="addMemberForm" label-width="150px">
                <el-form-item label="选择文件:">
                    <el-input class="input-hasBtn" v-model="addRestoreForm.dataAmount" placeholder="选择" style="width:75%"></el-input>
                    <el-button type="primary" @click="chooseListVisible=true" style="margin-left:10px">选择</el-button>
                </el-form-item>
            </el-form>
            <div style='text-align:center'>
                <el-button @click="ShowRestoreVisible = false">取消</el-button>
                <el-button type="primary" @click="SubmitClick()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dataForm:{
                formDate:'',
                fileName:''
            },
            addMemberForm:{
                dataAmount:'',
                dataName:''
            },
            addRestoreForm:{},  //还原
            tableList:[{
                'id':'0',
                'fileName':'备份01',
                'fileRoute':'c:\test\test',
                'fileType':'备份',
                'formDate':'2022-2-6',
                'stauts':'0',
                'schedule':'100'
            },{
                'id':'1',
                'fileName':'还原01',
                'fileRoute':'c:\test\test',
                'fileType':'还原',
                'formDate':'2022-2-10',
                'stauts':'0',
                'schedule':'100'
            },{
                'id':'2',
                'fileName':'还原03',
                'fileRoute':'d:\list',
                'fileType':'还原',
                'formDate':'2022-2-18',
                'stauts':'1',
                'schedule':'42'
            }],
            listLoading:false,
            apComServerData:{
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            showDetailVisible:false,
            ShowAddVisible:false, //备份弹框
            ShowRestoreVisible:false,//还原弹框
            //查看日志
            tableData:[{
                'verSteps':'1、导出项目信息（包含项目执行中的规则、疑点等数据）',
                'verStatus':'0',
                'verResult':'0'
            },{
                'verSteps':'2、导出医院数据',
                'verStatus':'0',
                'verResult':'1'
            }]
        }
    },
  computed:{
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
  },
    mounted() {
        this.initDataList()
    },
    methods:{
        //初始化列表数据
        initDataList(){},
        ///查询
        getDataList(){},
        //重置
        resetForm(formName){
            this.dataForm = {
                formDate:'',
                fileName:''
            }
            this.$refs[formName].resetFields()
        },
        //备份事件
        backupsClick(){
            this.ShowAddVisible = true
        },
        //还原事件
        reductionClick(){
            this.ShowRestoreVisible = true
        },
        // 每页数
        handleSizeChange(val){
            this.pageSize = val
            this.currentPage = 1
            this.getAllList()
        },
        // 当前页
        handleCurrentChange (val) {
            this.currentPage = val
            this.getAllList()
        },
        //查看日志
        detailClick(){
            this.showDetailVisible = true
        },
        dataFormSubmit(){},
        //还原确定事件
        SubmitClick(){}
    }
}
</script>
<style lang="scss" scoped>
.f_right{
    float: right;
    padding:5px;
}
.itemBtn{
    text-align: center;
}
</style>
