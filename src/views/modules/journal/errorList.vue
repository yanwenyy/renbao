<template>
    <div class='errorList'>
        <el-form :inline="true" :model="dataForm">
            <el-form-item label="操作人名称:">
                <el-input v-model="dataForm.operator" placeholder="请输入搜索内容" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAllSearch()">查询</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
            <el-form-item style="float:right">
                <el-button type="primary" @click="getChooseExport()">选择导出</el-button>
                <el-button type="primary" @click="getExportClick()">全部导出</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <el-table :data="tableData" border style="100%" :height="tableHeight-10" @selection-change="handleSelectionChange" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="listLoading">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
                <el-table-column prop="appCode" header-align="center" align="center" label="应用编码"></el-table-column>
                <el-table-column prop="module" header-align="center" align="center" width="150" label="模块">
                </el-table-column>
                <el-table-column prop="logType" header-align="center" align="center" label="日志类型">
                </el-table-column>
                <el-table-column prop="remoteIp" header-align="center" align="center" label="操作ip地址">
                </el-table-column>
                <el-table-column prop="operateType" header-align="center" align="center" label="操作类型">
                </el-table-column>
                <el-table-column prop="operator" header-align="center" align="center" label="操作人">
                </el-table-column>
                <el-table-column prop="browser" header-align="center" align="center" label="浏览器类型"></el-table-column>
                <el-table-column prop="os" header-align="center" align="center" label="操作系统"></el-table-column>
                <el-table-column prop="infos" header-align="center" align="center" label="操作明细"></el-table-column>
                <el-table-column prop="params" header-align="center" align="center" label="请求参数"></el-table-column>
                <el-table-column prop="result" header-align="center" align="center" label="异常信息"></el-table-column>
                <el-table-column prop="createId" header-align="center" align="center" label="创建人"></el-table-column>
                <el-table-column prop="createTimeStr" header-align="center" align="center" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="getDetailClick(scope.row)">查看明细</el-button>
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
        </div>
         <el-dialog title="操作明细" :visible.sync="showDetailVisible" v-if="showDetailVisible" width="80%" :close-on-click-modal="false">
            <el-form style="height:550px;overflow-y:auto" :model="dataListForm" ref="dataListForm" label-width="160px">
                <el-row>
                    <el-col :span="12">
                    <el-form-item prop="appCode" label-width="150px" label="应用编码">
                        <el-input v-model="dataListForm.appCode" placeholder="证据名称"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="module" label-width="150px" label="模块">
                        <el-input v-model="dataListForm.module" placeholder="模块"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="logType" label-width="150px" label="日志类型">
                        <el-input v-model="dataListForm.logType" placeholder="日志类型"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="remoteIp" label-width="150px" label="操作ip地址">
                        <el-input v-model="dataListForm.remoteIp" placeholder="操作ip地址"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="operateType" label-width="150px" label="操作类型">
                        <el-input v-model="dataListForm.operateType" placeholder="操作类型"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="operator" label-width="150px" label="操作人">
                        <el-input v-model="dataListForm.operator" placeholder="操作人"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="browser" label-width="150px" label="浏览器类型">
                        <el-input v-model="dataListForm.browser" placeholder="浏览器类型"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="os" label-width="150px" label="操作系统">
                        <el-input v-model="dataListForm.os" placeholder="操作系统"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="infos" label-width="150px" label="操作明细">
                        <el-input v-model="dataListForm.infos" placeholder="操作明细"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item prop="params" label-width="150px" label="请求参数">
                        <el-input v-model="dataListForm.params" type="textarea" placeholder="请求参数"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item prop="result" label-width="150px" label="响应参数">
                        <el-input v-model="dataListForm.result" type="textarea" placeholder="响应参数"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="createId" label-width="150px" label="创建人ID">
                        <el-input v-model="dataListForm.createId" placeholder="创建人ID"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item prop="createTimeStr" label-width="150px" label="创建时间">
                        <el-input v-model="dataListForm.createTimeStr" placeholder="创建时间"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col>
                    <div class="itemBtn" style="text-align:right">
                        <el-button type="primary" @click="showDetailVisible = false">关闭</el-button>
                    </div>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'behaviorList',
    data(){
        return{
            dataForm:{
                operator:''
            },
            tableData:[],
            seleteLengthData: [],
            listLoading:false,
            pageSize: 10,
            pageIndex:1,
            total:1,
            token:'',
            showDetailVisible:false,
            dataListForm:{
            },
            selectByUuid:'',
            exportAll:1
        }
    },
    computed:{
        tableHeight: {
        get () { return this.$store.state.common.tableHeight}
        },
    },
    mounted(){
        this.initDataList()
    },
    methods:{
         //多选事件
        handleSelectionChange(val) {
            this.seleteLengthData = val;
        },
        //初始化
        initDataList(){
            this.$http({
                url:this.$http.adornUrl('/errorLog/selectPage'),
                method: 'post',
                params: this.$http.adornParams({
                    operator: this.dataForm.operator,
                    pageSize:this.pageSize,
                    pageNo:this.pageIndex,
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableData = data.result.records
                    this.total = data.result.total
                }else{
                    this.tableData = []
                }
                this.tableLoading = false;
            })
        },
        //查询
        getAllSearch(){
           this.initDataList()
        },
        // 页数
        handleSizeChange(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.initDataList();
        },
        //当前页
        handleCurrentChange(val) {
            this.pageIndex = val;
            this.initDataList();
        },
        //重置
        resetForm(){
            this.dataForm.operator = ''
        },
        //选择导出
        getChooseExport(){
            var exportList = []
            let seleteIds = ''
            if(this.seleteLengthData.length != 1){
                this.seleteLengthData.forEach(item => {
                    exportList.push(item.id);
                });
                seleteIds = exportList.join(',')
                window.location.href = this.$http.adornUrl("/errorLog/logDataExport?token=") + this.$cookie.get("token") + "&idString=" + seleteIds;
            }else{
                this.$message({
                    message: "请选择至少一条数据",
                    type: "warning"
                });
            }
        },
        //全部导出
        getExportClick(){
            window.location.href = this.$http.adornUrl("/errorLog/logDataExport?token=") + this.$cookie.get("token") + "&exportAll=" + this.exportAll;
        },
       getDetailClick(row){
            this.showDetailVisible = true
            this.selectByUuid = row.id
            this.getInitFrom()
        },
        getInitFrom(){
            this.$http({
                url:this.$http.adornUrl(`/errorLog/selectByUuid/${this.selectByUuid}`),
                method: 'get',
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.dataListForm = data.result
                    // this.total = data.result.total
                }else{
                    this.tableData = []
                }
                this.tableLoading = false;
            })
        },

    }
}
</script>
