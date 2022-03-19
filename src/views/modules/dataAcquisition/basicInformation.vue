 <!-- 医院基本信息 -->
<template>
    <div class='threeData'>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item label="医疗机构名称：">
                <el-input v-model="dataForm.hospitalName" placeholder="请输入搜索内容" clearable></el-input>
            </el-form-item>
             <el-form-item label="医疗机构类别：">
                <el-select v-model="dataForm.hospitalType" placeholder="请输入搜索内容" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年度医保基金支付总金额：">
                <el-col :span="11">
                <el-input placeholder="请输入搜索内容" v-model="dataForm.moneyStart" style="width: 100%;"></el-input>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                <el-input placeholder="请输入搜索内容" v-model="dataForm.moneyEnd" style="width: 100%;"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataList()">查询</el-button>
                <el-button @click="resetForm('dataForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <div class='f_right'>         
                <el-button size="mini" type="warning" @click="templateExport">下载模板</el-button>           
                <el-button size="mini" type="warning" @click="exportData">导出数据</el-button>
                <el-button size="mini" type="warning" @click="importData">导入数据</el-button>
            </div>
            <el-table ref="multipleTable" :data="tableList" border style="100%" height="60vh" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading='tableLoading' @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <template v-for="(item,index) in tableColumns" width="55">
                    <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                </template>
            </el-table>
            <!-- <el-pagination 
                :page-size="apComServerData.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="apComServerData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="apComServerData.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                ></el-pagination> -->
        </div>
        <el-dialog title="导入数据" :visible.sync="importVisible">
            <div style="padding-bottom:10px;">
                <span>导入类型</span>
                <el-select v-model="importType" placeholder="请选择" style="margin-left:10px;">
                        <el-option  v-for="item in selectOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <el-upload
                class="upload-demo"
                action=""
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :http-request="uploadFile"
                multiple
                :limit="1"
                :file-list="fileList" :on-change="handleChange">
                <el-button size="small" type="primary" @click="handlePreview">选择文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
            </el-upload>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dataForm:{
                hospitalName:'',
                hospitalType:'',
                moneyEnd:'',
                moneyStart:''
            }, 
            tableLoading:false,
            //loading
            dataListLoading: false,
            importVisible:false,
            apComServerData:{
                current: 1,
                size: 10,
                pageNum:1,
                total:0,
                pageIndex:1,
            },
            tableList:[],
            tableColumns:[],
            options:[{
                value:'三级甲等',
                label:'三级甲等'
            },{
                value:'三级乙等',
                label:'三级乙等'
            },{
                value:'三级丙等',
                label:'三级丙等'
            }],
            fileList:[],
            importType:'',
            selectOption:[{
                    value: '0',
                    label: '全量'
                },{
                    value: '1',
                    label: '增量'
            }],
            catalogType:10,
            multipleSelection:'',
            
        }
    },
     created(){
        this.token = this.$cookie.get("token");
    },
    mounted(){
        this.getInitList()
    },
    methods:{
        //初始化数据列表
        getInitList(){
            this.tableLoading = true;
            this.$http({
                url:this.$http.adornUrl('/hospitalBasicInfo/getPageList'),
                method: 'get',
                params: this.$http.adornParams({
                    'hospitalName':this.dataForm.hospitalName,
                    'hospitalType':this.dataForm.hospitalType,
                    'moneyEnd':this.dataForm.moneyEnd,
                    'moneyStart':this.dataForm.moneyStart,
                    'pageCount':this.apComServerData.current,
                    'pageNum':this.apComServerData.pageIndex,
                    'pageSize':this.apComServerData.size,
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableList = data.result.result
                    this.tableColumns = data.result.columns
                    // this.apComServerData.total = data.result.pagination.dataCount
                }else{
                    this.tableList = []
                    this.apComServerData.total = 0
                }
                this.tableLoading = false;
            })
        },
          //多选
        handleSelectionChange(val){
             this.multipleSelection = val
        },
        //上传文件事件
        handleChange(file,fileList){
            this.fileList = fileList
            console.log(this.fileList)
        },
        uploadFile(itme){
            let formData = new FormData()
            formData.append('file',this.fileList[0].raw)
            this.$http({
                url:this.$http.adornUrl('/threeCatalog/dataImportCommonMethod'),
                method: "post",
                data: formData,
                params :this.$http.adornParams({
                    importType:this.importType,
                    catalogType:10,
                })
                }).then(({data})=>{
                    if(data && data.code === 200){
                        this.$message({
                            message: '导入成功',
                            type: 'success',
                            onClose: () => {
                                this.importVisible=false;
                                this.getInitList();
                            }
                        })
                    }else{
                        this.$message.error(data.message)
                    }
                })
        },
        handlePreview(){
            this.fileList = []
        },
        //重置
        resetForm(formName){
            this.dataForm = {
                hospitalName:'',
                hospitalType:'',
                moneyEnd:'',
                moneyStart:''
            }
            this.$refs[formName].resetFields()
        },
        //查询
        getDataList(){
            this.getInitList()
        },
        //导入
        importData(){
            this.importVisible = true
        },
        //导出
        exportData(){
            let url = this.$http.adornUrl('/threeCatalog/excelDataExport?catalogType='+this.catalogType+'&token=')+ this.$cookie.get('token')
            window.open(url)
        },
        //模板导出
        templateExport(){
            let url = this.$http.adornUrl('/threeCatalog/exportExcelFileCommon?catalogType='+this.catalogType+'&token=')+ this.$cookie.get('token')
            window.open(url)
        },
        
        // 关闭弹窗确认
        importSucceed(){
            this.closeimportDrawer()
        },
        closeimportDrawer(){
            this.importVisible = false
        },
        // 页数
        handleSizeChange(val){
            this.apComServerData.size = val;
            this.apComServerData.pageIndex = 1
            this.getInitList()
        },
        //当前页
        handleCurrentChange(val){
            this.apComServerData.pageIndex = val;
            this.getInitList()
        },
        // 重置医院页面
        reSetHospital () {
            this.resetForm('dataForm');
            this.multipleSelection = [];
            this.$refs.multipleTable.clearSelection(this.multipleSelection); 

        }
    }
}
</script>
<style lang="scss" scoped>
.f_right{
    float: right;
    padding:5px;
}
.line{
    text-align: center;
}
</style>