 <!-- 医院基本信息 -->
<template>
    <div class='threeData'>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item label="医院名称：">
                <el-input v-model="dataForm.hospitalName" placeholder="请输入搜索内容" clearable></el-input>
            </el-form-item>
             <el-form-item label="医院类别：">
                <el-select v-model="dataForm.hospitalType" placeholder="请输入搜索内容" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医保基金支付总金额：">
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
                <el-button size="mini" type="warning" @click="exportData">导出数据</el-button>
                <el-button size="mini" type="warning" @click="importData">导入数据</el-button>
            </div>
            <el-table :data="tableList" border style="100%" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="医院名称" header-align="center" align="center" label="医院名称"></el-table-column>
                <el-table-column prop="医院编码" header-align="center" align="center" label="医院编码"></el-table-column>
                <el-table-column prop="医院性质" header-align="center" align="center" label="医院性质"> </el-table-column>
                <el-table-column prop="医院类别" header-align="center" align="center" label="医院类别"></el-table-column>
                <el-table-column prop="医保基金支付总金额" header-align="center" align="center" label="医院基金支付总金额"></el-table-column>
            </el-table>
            <el-pagination 
                :page-size="apComServerData.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="apComServerData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="apComServerData.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                ></el-pagination>
        </div>
        <el-dialog title="导入数据" :visible.sync="importVisible">
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
            fileList:[]
        }
    },
    mounted(){
        this.getInitList()
    },
    methods:{
        //初始化数据列表
        getInitList(){
            this.dataListLoading = true;
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
                    this.tableList = data.result.records
                    this.apComServerData.total = data.result.total
                }else{
                    this.tableList = []
                    this.apComServerData.total = 0
                }
                this.dataListLoading = false;
            })
        },
        handleChange(file,fileList){
            this.fileList = fileList
            console.log(this.fileList)
        },
        uploadFile(itme){
            let formData = new FormData()
            formData.append('file',this.fileList[0].raw)
            this.$http({
                url:this.$http.adornUrl('/hospitalBasicInfo/dataImprot'),
                method: "post",
                data: formData
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
            var url ='/hospitalBasicInfo/excelDataExport?hospitalName='+this.dataForm.hospitalName+'&hospitalType='+this.dataForm.hospitalType+'&moneyEnd='+this.dataForm.moneyEnd+'&moneyStart='+this.dataForm.moneyStart;
            console.log(this.$http.adornUrl(url))
            window.open(this.$http.adornUrl(url))

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