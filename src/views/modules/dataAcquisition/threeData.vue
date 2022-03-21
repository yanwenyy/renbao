<template>
    <div class='threeData'>
        <el-form :inline="true" :model="dataForm">
            <el-form-item label="请选择导入数据类型：">
                <el-select v-model="dataForm.dataType" placeholder="请选择" @change='changeOption($event)'>
                    <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="float:right">
                <el-button type="warning" v-show="isShow" @click="exportData">下载模板</el-button> 
                <el-button type="warning"  @click="ImportData">导入数据</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <!-- <div class='f_right'>             
                <el-button size="mini" type="warning" v-show="isShow" @click="exportData">下载模板</el-button>       
                <el-button size="mini" type="warning"  @click="ImportData">导入数据</el-button>
            </div> -->
                <el-table :data="tableList0" v-if="selectNum == 0" border style="100%" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="dataLoading">
                </el-table>
                <!-- 医保药品目录 -->
                <el-table :data="tableList" v-if="selectNum == 1" border style="100%" height="60vh" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="dataLoading">
                    <template v-for="(item,index) in tableColumns">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                    </template>
                    <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                    <el-table-column prop="一级医院最高价格" header-align="center" align="center" label="一级医院最高价格"></el-table-column>
                    <el-table-column prop="三级医院最高价格" header-align="center" align="center" label="三级医院最高价格"></el-table-column>
                    <el-table-column prop="二级医院最高价格" header-align="center" align="center" label="二级医院最高价格"> </el-table-column>
                    <el-table-column prop="住院自付比例" header-align="center" align="center" label="住院自付比例"></el-table-column>
                    <el-table-column prop="剂型" header-align="center" align="center" label="剂型"></el-table-column>
                    <el-table-column prop="医保药品名称" header-align="center" align="center" label="医保药品名称"></el-table-column>
                    <el-table-column prop="医保药品编码" header-align="center" align="center" label="医保药品编码"></el-table-column>
                    <el-table-column prop="国家医保贯标目录编码" header-align="center" align="center" label="国家医保贯标目录编码"> </el-table-column>
                    <el-table-column prop="备注" header-align="center" align="center" label="备注"></el-table-column>
                    <el-table-column prop="工伤自付比例" header-align="center" align="center" label="工伤自付比例"></el-table-column>
                    <el-table-column prop="支付单位" header-align="center" align="center" label="支付单位"></el-table-column>
                    <el-table-column prop="支付类别" header-align="center" align="center" label="支付类别"> </el-table-column>
                    <el-table-column prop="最高限价" header-align="center" align="center" label="最高限价"></el-table-column>
                    <el-table-column prop="生效日期" header-align="center" align="center" label="生效日期"></el-table-column>
                    <el-table-column prop="生育自付比例" header-align="center" align="center" label="生育自付比例"></el-table-column>
                    <el-table-column prop="用法" header-align="center" align="center" label="用法"></el-table-column>
                    <el-table-column prop="用量" header-align="center" align="center" label="用量"></el-table-column>
                    <el-table-column prop="离休价格" header-align="center" align="center" label="离休价格"></el-table-column>
                    <el-table-column prop="终止日期" header-align="center" align="center" label="终止日期"></el-table-column>
                    <el-table-column prop="规格" header-align="center" align="center" label="规格"></el-table-column>
                    <el-table-column prop="门诊住院用药标识" header-align="center" align="center" label="门诊住院用药标识"></el-table-column>
                    <el-table-column prop="门诊自付比例" header-align="center" align="center" label="门诊自付比例"></el-table-column> -->
                </el-table>
                <!-- 医保诊疗项目目录 -->
                <el-table :data="tableList" v-if="selectNum == 2" border style="100%" height="60vh" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                     <template v-for="(item,index) in tableColumns">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                    </template>
                    <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                    <el-table-column prop="一级医院最高价格" header-align="center" align="center" label="一级医院最高价格"></el-table-column>
                    <el-table-column prop="三级医院最高价格" header-align="center" align="center" label="三级医院最高价格"></el-table-column>
                    <el-table-column prop="二级医院最高价格" header-align="center" align="center" label="二级医院最高价格"> </el-table-column>
                    <el-table-column prop="住院自付比例" header-align="center" align="center" label="住院自付比例"></el-table-column>
                    <el-table-column prop="医保目录除外内容" header-align="center" align="center" label="医保目录除外内容"></el-table-column>
                    <el-table-column prop="医保项目内涵" header-align="center" align="center" label="医保项目内涵"></el-table-column>
                    <el-table-column prop="医保药品名称" header-align="center" align="center" label="医保药品名称"></el-table-column>
                    <el-table-column prop="医保药品编码" header-align="center" align="center" label="医保药品编码"> </el-table-column>
                    <el-table-column prop="国家医保贯标目录编码" header-align="center" align="center" label="国家医保贯标目录编码"> </el-table-column>
                    <el-table-column prop="备注" header-align="center" align="center" label="备注"></el-table-column>
                    <el-table-column prop="工伤自付比例" header-align="center" align="center" label="工伤自付比例"></el-table-column>
                    <el-table-column prop="支付单位" header-align="center" align="center" label="支付单位"></el-table-column>
                    <el-table-column prop="支付类别" header-align="center" align="center" label="支付类别"> </el-table-column>
                    <el-table-column prop="最高限价" header-align="center" align="center" label="最高限价"></el-table-column>
                    <el-table-column prop="生效日期" header-align="center" align="center" label="生效日期"></el-table-column>
                    <el-table-column prop="生育自付比例" header-align="center" align="center" label="生育自付比例"></el-table-column>
                    <el-table-column prop="用法" header-align="center" align="center" label="用法"></el-table-column>
                    <el-table-column prop="离休价格" header-align="center" align="center" label="离休价格"></el-table-column>
                    <el-table-column prop="终止日期" header-align="center" align="center" label="终止日期"></el-table-column>
                    <el-table-column prop="规格" header-align="center" align="center" label="规格"></el-table-column>
                    <el-table-column prop="门诊自付比例" header-align="center" align="center" label="门诊自付比例"></el-table-column> -->
                </el-table>
                <!-- 医保耗材目录 -->
                <el-table :data="tableList" v-if="selectNum == 3" border style="100%" height="60vh" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                     <template v-for="(item,index) in tableColumns">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                    </template>
                    <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                    <el-table-column prop="一级医院最高价格" header-align="center" align="center" label="一级医院最高价格"></el-table-column>
                    <el-table-column prop="三级医院最高价格" header-align="center" align="center" label="三级医院最高价格"></el-table-column>
                    <el-table-column prop="二级医院最高价格" header-align="center" align="center" label="二级医院最高价格"> </el-table-column>
                    <el-table-column prop="住院自付比例" header-align="center" align="center" label="住院自付比例"></el-table-column>
                    <el-table-column prop="医保目录除外内容" header-align="center" align="center" label="医保目录除外内容"></el-table-column>
                    <el-table-column prop="医保项目内涵" header-align="center" align="center" label="医保项目内涵"></el-table-column>
                    <el-table-column prop="医保项目名称" header-align="center" align="center" label="医保项目名称"></el-table-column>
                    <el-table-column prop="医保项目编码" header-align="center" align="center" label="医保项目编码"> </el-table-column>
                    <el-table-column prop="国家医保贯标目录编码" header-align="center" align="center" label="国家医保贯标目录编码"> </el-table-column>
                    <el-table-column prop="备注" header-align="center" align="center" label="备注"></el-table-column>
                    <el-table-column prop="工伤自付比例" header-align="center" align="center" label="工伤自付比例"></el-table-column>
                    <el-table-column prop="支付单位" header-align="center" align="center" label="支付单位"></el-table-column>
                    <el-table-column prop="支付类别" header-align="center" align="center" label="支付类别"> </el-table-column>
                    <el-table-column prop="最高限价" header-align="center" align="center" label="最高限价"></el-table-column>
                    <el-table-column prop="生效日期" header-align="center" align="center" label="生效日期"></el-table-column>
                    <el-table-column prop="生育自付比例" header-align="center" align="center" label="生育自付比例"></el-table-column>
                    <el-table-column prop="终止日期" header-align="center" align="center" label="终止日期"></el-table-column>
                    <el-table-column prop="规格" header-align="center" align="center" label="规格"></el-table-column>
                    <el-table-column prop="门诊自付比例" header-align="center" align="center" label="门诊自付比例"></el-table-column> -->
                </el-table>
                <!-- 病种目录 -->
                <!-- <el-table :data="tableList" v-if="selectNum == 4" border style="100%" height="600" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                </el-table> -->
                <!-- 服务价格目录 -->
                <!-- <el-table :data="tableList" v-if="selectNum == 5" border style="100%" height="600" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                </el-table>   -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="apComServerData.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="apComServerData.size"
                :total="apComServerData.total"
                layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            <el-dialog title="导入数据" :visible.sync="addUploadVisible">
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
                    multiple
                    :limit="1"
                    :file-list="fileList"
                    :http-request="uploadFile" :on-change="handleChange">
                    <el-button size="small" type="primary" @click="handlePreview">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
                </el-upload>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import VueQueryBuilder from './VueQueryBuilder.vue'
export default {
    name:'threeData',
    components:{
        VueQueryBuilder
    },
    data(){
        return{
            dataForm:{
                dataType:'',
            }, 
            selectNum:0,
            //列表加载
            dataLoading: false,
            addUploadVisible:false,
            //分页
            apComServerData:{
                current: 1,
                size: 10,
                pageNum:1,
                total:0,
                pageIndex:1
            },
            fileName: "",
            activeKey:[],
            activeNames: ['1'],
            radio:'1',
            output:null,
            show:false,
            isShow:false,
            importType: '',
            options: [
                {
                    value: '0',
                    label: '请选择'
                },{
                    value: '1',
                    label: '医保药品目录'
                },{
                    value: '2',
                    label: '医保诊疗项目目录'
                },{
                    value: '3',
                    label: '医保耗材目录'
                },
                // {
                //     value: '4',
                //     label: '病种目录'
                // },{
                //     value: '5',
                //     label: '服务价格目录'
                // }
                ],
            selectOption:[{
                    value: '0',
                    label: '删除现有数据'
                },{
                    value: '1',
                    label: '保留现有数据'
                }],
            tableList:[],
            tableList0:[],
            fileList:[],
            exportFilelist: [],
            fileLists:[],
            token:'',
            dataCount:'',
            tableColumns:[]
        }
    },
    created(){
        // this.getDataList();
        this.token = this.$cookie.get("token");
    },
    methods:{
        // 获取数据列表
        getDataList(val){
            this.dataLoading = true;
            this.$http({
                url: this.$http.adornUrl("/threeCatalog/getThreeCatalogDataList"),
                method: "get",
                params: this.$http.adornParams({
                    'catalogType':this.dataForm.dataType,
                    // 'complexWhere':  '',
                    'pageSize':this.apComServerData.size,
                    'pageNum':this.apComServerData.pageIndex,
                    'pageCount':this.apComServerData.current,
                    // 'dataCount':this.dataCount || ''
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableList = data.result.result
                    this.tableColumns = data.result.columns
                    this.apComServerData.total = data.result.pagination.dataCount
                }else{
                    this.dataList = [];
                    this.apComServerData.total = 0; 
                }
                this.dataLoading = false;
            })
        },

        handleChange(file,fileList){
            this.fileList = fileList
            console.log(this.fileList)
        },
  
        //上传文件 导入
        uploadFile(){
            let formData = new FormData()
            formData.append('file',this.fileList[0].raw)
            this.$http({
                url:this.$http.adornUrl('/threeCatalog/dataImportCommonMethod'),
                method: "post",
                data:formData,
                params :this.$http.adornParams({
                    catalogType:this.dataForm.dataType,
                    importType:this.importType
                })
                }).then(({data})=>{
                    if(data && data.code === 200){
                        this.$message({
                            message: '导入成功',
                            type: 'success',
                            onClose: () => {
                                this.addUploadVisible=false;
                                this.getDataList();
                            }
                        })
                    }else{
                        this.$message.error(data.message)
                    }
                })
        },
        //导出
        exportData(){
            let url = this.$http.adornUrl('/threeCatalog/exportExcelFileCommon?catalogType='+this.dataForm.dataType+'&token=') + this.$cookie.get('token')
            window.open(url)
            // this.$http({
            //     url:this.$http.adornUrl('/threeCatalog/exportExcelFileCommon'),
            //     method: "get",
            //     responseType: 'blob',//解决乱码问题
            //     params :this.$http.adornParams({
            //         catalogType:this.dataForm.dataType,
            //     })
            // }).then(({data})=>{
            //     console.log(data)
            //     const blob =  new Blob([data]);
            //     let fileName = this.fileName + '.xls';
            //     if("download" in document.createElement("a")){
            //         const elink = document.createElement("a")
            //         elink.download = fileName;
            //         elink.style.display = "none";
            //         elink.href = URL.createObjectURL(blob);  // 创建下载的链接
            //         document.body.appendChild(elink)
            //         elink.click(); // 点击下载
            //         URL.revokeObjectURL(elink.href);// 释放掉blob对象
            //         document.body.removeChild(elink)// 下载完成移除元素
            //     }else{
            //         navigator.msSaveBlob(blob,fileName)
            //     }
            // })
        },
        //导入数据
        ImportData(){
            this.addUploadVisible = true
        },
        //点击上传
        handlePreview(){},
        //select时间
        changeOption(val){
            if(val == 1){
                this.isShow = true
                this.fileName = '医保药品目录'
                this.selectNum = val
                this.getDataList(val)
            }else if(val == 2){
                this.exports = true
                this.fileName = '医保诊疗项目目录'
                this.selectNum = val
                this.getDataList(val)
            }else if(val == 3){
                this.exports = true
                this.fileName = '医保耗材目录'
                this.selectNum = val
                this.getDataList(val)
            }
            // else if(val == 4){
            //     this.selectNum = val
            //     this.getDataList(val)
            // }else if(val == 5){
            //     this.selectNum = val
            //     this.getDataList(val)
            // }
            else if(val == 0){
                this.isShow = false
                this.selectNum = val
                this.apComServerData.total = 0; 
            }
        },
       
         // 页数
        handleSizeChange(val){
            this.apComServerData.size = val;
            this.apComServerData.pageIndex = 1
            this.getDataList()
        },
        //当前页
        handleCurrentChange(val){
            this.apComServerData.pageIndex = val;
            this.getDataList()
        }
    }
}
</script>
<style lang="scss" scoped>
.f_right{
    float: right;
    padding:5px;
}
.mask{
    width: 84.2%;
    padding-top: 23px;
    position: fixed;
    z-index: 998;
    overflow: hidden;
}
.sub-comments-leave-active,.sub-comments-enter-active {
    transition: all 1s ease;
}
.sub-comments-leave-active,.sub-comments-enter {
    height:0px !important;
}
.sub-comments-leave,.sub-comments-enter-active {
    height:500px;
}
.threeData{
    width: 100%;
    // display: flex;
    // min-width: 800px;
}
</style>