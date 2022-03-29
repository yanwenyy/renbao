<template>
    <div class='threeData'>
        <el-form :inline="true" :model="dataForm">
            <el-form-item label="请选择导入数据类型：">
                <el-select v-model="dataForm.dataType" placeholder="请选择" @change='changeOption($event)'>
                    <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="float:right;padding:5px" >
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
                <el-table :data="tableList0" v-if="selectNum == 0" border style="100%"  :height="tableHeight" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="dataLoading">
                </el-table>
                <!-- 医保药品目录 -->
                <el-table :data="tableList" v-if="selectNum == 1" border style="100%" :height="tableHeight" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="dataLoading">
                    <template v-for="(item,index) in tableColumns">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip></el-table-column>
                    </template>

                </el-table>
                <!-- 医保诊疗项目目录 -->
                <el-table :data="tableList" v-if="selectNum == 2" border style="100%" :height="tableHeight" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                     <template v-for="(item,index) in tableColumns">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip></el-table-column>
                    </template>
                </el-table>
                <!-- 医保耗材目录 -->
                <el-table :data="tableList" v-if="selectNum == 3" border style="100%" :height="tableHeight" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                     <template v-for="(item,index) in tableColumns">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip></el-table-column>
                    </template>
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
                <el-form size="small" label-width="80px">
                    <el-form-item label="是否去重" prop="duplicateRemove"><el-checkbox v-model="duplicateRemove"></el-checkbox></el-form-item>
                    <el-form-item label="导入类型" prop="importType">
                        <el-select v-model="importType" placeholder="请选择">
                            <el-option  v-for="item in selectOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                <el-form-item label="导入文件" prop="ruleFile" style="margin-top:5px;">
                    <el-upload
                        class="upload-demo"
                        action=""
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        multiple
                        :limit="1"
                        :file-list="fileList"
                        :http-request="uploadFile" :on-remove="handleRemove" ref="ruleFileUpload" :on-change="handleChange">
                        <el-button size="small" type="primary" @click="handlePreview">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
                    </el-upload>
                 </el-form-item>
                </el-form>
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
            tableColumns:[],
            dataRuleList:{
                importType:[
                    { required: true, message: '请选择导入类型', trigger: 'blur' }
            ]},
            duplicateRemove:false,
            importType:''
        }
    },
    computed:{
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
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
            let arrDuplicate =''
            if(this.duplicateRemove == false){
                 arrDuplicate = 0
            }else if(this.duplicateRemove == true){
                 arrDuplicate = 1
            }
            if(this.importType.length == 0){
                this.$message({
                    message: "请选择要采集的文件！",
                    type: "error",
                });
                return;
            }
            let formData = new FormData()
            formData.append('file',this.fileList[0].raw)
            this.$http({
                url:this.$http.adornUrl('/threeCatalog/dataImportCommonMethod'),
                method: "post",
                data:formData,
                params :this.$http.adornParams({
                    catalogType:this.dataForm.dataType,
                    duplicateRemove:arrDuplicate,
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
        //文件列表移除文件时的钩子
        handleRemove(file, fileList) {
            // console.log(file, fileList);
            this.fileList = []
        },

        //导出
        exportData(){
            let url = this.$http.adornUrl('/threeCatalog/exportExcelFileCommon?catalogType='+this.dataForm.dataType+'&token=') + this.$cookie.get('token')
            window.open(url)
        },
        //导入数据
        ImportData(){
            this.addUploadVisible = true
            this.fileList = []
            this.duplicateRemove = false,
            this.importType = ''
        },
        //点击上传
        handlePreview(){
        },
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
.el-form-item{
    margin-bottom: 0;
}
</style>
