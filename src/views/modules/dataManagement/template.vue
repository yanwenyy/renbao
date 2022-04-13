<!-- 采集模板导出 -->
<template>
    <div class='template'>
        <el-table :data="tableData" border style="100%" :header-cell-style="{textAlign:'center'}" :height="tableHeight+60" class="demo-ruleForm" v-loading="listLoading">
            <el-table-column prop="templateName" align="center" label="模板名称"></el-table-column>
            <el-table-column align="center" label="上传时间">
                 <template slot-scope="scope">{{scope.row.uploadTime | datetimeformat}}</template>
            </el-table-column>
            <el-table-column prop="uploadUserName" align="center" label="上传人"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" v-if="userName== '管理员'" @click="getImportclick(scope.row)">导入模板</el-button>
                    <el-button size="small" type="text" v-if="userName !== 'admin'" @click="getExportClick(scope.row.attachmentId,scope.row.templateName)">导出模板</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="apComServerData.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="apComServerData.pageSize"
        :total="apComServerData.total"
        layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <el-dialog title="导入" :visible.sync="showImportVisible">
               <el-upload
                    class="upload-demo"
                    action=""
                    accept=""
                    multiple
                    :limit="1"
                    :file-list="fileList"
                    :http-request="uploadFile" :on-change="handleChange">
                    <el-button size="small" type="primary" @click="chooseClick">选择文件</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传Excel文件</div> -->
                </el-upload>
            <div class="itemBtn" slot="footer">
                <el-button type="primary" @click="showImportVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// import { exportZip } from "@/utils";
export default {
//     components: {
//     exportZip,
//  },
    data(){
        return{
            tableData:[],
            listLoading:false,
            showImportVisible:false,
            apComServerData:{
                current: 1,
                pageSize: 10,
                total: 0,
                pageIndex:1
            },
            fileList:[],
            token:'',
            fileInfoId:'',
            fileId:'',
            importId:'',
            dataForm1: {
                fileInfoId: "",
            },
            userName:'',
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
    mounted() {
        //获取当前登录人信息
        this.getUserInfo()
        this.initData()
    },
    methods:{
         getUserInfo() {
            this.$http({
                url: this.$http.adornUrl("/sys/currentUser"),
                method: "get",
                params: this.$http.adornParams()
            }).then(({ data }) => {
                if (data && data.code === 200) {
                this.userName = data.result.userName;
                console.log(this.userName)
                }
            });
            },
        //初始化数据
        initData(){
            this.listLoading = true;
            this.$http({
                url: this.$http.adornUrl("/collectTemplate/selectPage"),
                method: "get",
                params: this.$http.adornParams({
                    // 'catalogType':this.dataForm.dataType,
                    // 'complexWhere':  '',
                    'pageSize':this.apComServerData.pageSize,
                    'pageNum':this.apComServerData.pageIndex,
                    // 'pageCount':this.apComServerData.current,
                    // 'dataCount':this.dataCount || ''
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableData = data.result.records,
                    this.apComServerData.total = data.result.total
                }else{
                    this.tableData = [];
                    this.apComServerData.total = 0;
                }
                this.listLoading = false;
            })
        },
        handleChange(file,fileList){
            this.fileList = fileList
        },

        //上传文件 导入
        uploadFile(data){
            let formData = new FormData()
            formData.append('file',this.fileList[0].raw)
            this.$http({
                url:this.$http.adornUrl('/fileInfo/pa/fileInfo/adds'),
                method: "post",
                data:formData,
                }).then(({data})=>{
                    if(data && data.code === 200){
                        this.fileId = data.result.fileInfoId
                        console.log( this.fileId )
                        this.$message({
                            message: '导入成功',
                            type: 'success',
                            onClose: () => {
                                this.showImportVisible=false;
                                this.initDataList()

                            }
                        })
                        // this.initData()
                }else{
                     this.$message.error(data.message)
                }
            })
        },
        initDataList(){
            this.$http({
                url:this.$http.adornUrl('/collectTemplate/importTemplate'),
                method: "post",
                params: this.$http.adornParams({
                    collectTemplateId:this.importId,
                    fileInfoId:this.fileId,
                })
                }).then(({data})=>{
                    if(data && data.code === 200){
                        // this.tableData = data.result
                        this.$message({
                            message: '导入成功',
                            type: 'success',
                            onClose: () => {
                                // this.showImportVisible=false;
                                this.initData()

                            }
                        })
                        // this.initData()
                    }else{
                        this.$message.error(data.message)
                    }
                })
        },
        //导入模板
        getImportclick(data){
            this.importId  = data.collectTemplateId
            this.showImportVisible = true
        },
        //导出模板
        getExportClick(id,name){
          this.dataForm1.fileInfoId = id;
            if(id){
                this.$http({
                    url:this.$http.adornUrl('/fileInfo/pa/fileIfor/download'),
                    method: "get",
                    headers: {
                    token: this.$cookie.get('token')
                    },
                    responseType: "blob",
                    params: this.$http.adornParams({
                    fileInfoId:id,
                    token:this.$cookie.get('token')
                    })
                }).then(({data}) =>{
                    console.log(data)
                    // if (data.code == 200) {
                        // 文件下载
                        const blob = new Blob([data], {
                        type: "application/vnd.ms-excel"
                        });
                        let link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.setAttribute('download',name + '.xlsx');
                        link.click();
                        link = null;
                        this.$message.success('导出成功');
                    // } else {
                    //     debugger
                    //     // 返回json
                    //     this.$message.warning(data.message);
                    //     }
                }).catch(data => {
                    this.$message.error("下载失败");
                    this.$message({
                    message: '请先导入模板在进行导出模板',
                    type: 'success',
                })
                });   
            }else{
                this.$message({
                    message: '请先导入模板在进行导出模板',
                    type: 'success',})
            }      
            // if(id){
            //     let url = this.$http.adornUrl('/fileInfo/pa/fileIfor/download?fileInfoId='+id +'&token=') + this.$cookie.get('token')
            //     // console.log(url)
            //     window.open(url)
            // }else{
            //     this.$message({
            //         message: '请先导入模板在进行导出模板',
            //         type: 'success',})
            // }
        },

        // 每页数
        handleSizeChange(val){
            this.apComServerData.pageSize = val
            this.apComServerData.pageIndex = 1
            this.initData()
        },
        // 当前页
        handleCurrentChange (val) {
            this.apComServerData.pageIndex = val
            this.initData()
        },
        //选择文件
        chooseClick(){}
        }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
}
</style>
