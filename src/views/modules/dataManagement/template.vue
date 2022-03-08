<!-- 采集模板导出 -->
<template>
    <div class='template'>
        <el-table :data="tableData" border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="listLoading">
            <el-table-column prop="templateName" align="center" label="模板名称"></el-table-column>
            <el-table-column prop="Uploadtime" align="center" label="上传时间"></el-table-column>
            <el-table-column prop="Uploader" align="center" label="上传人"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="getImportclick(scope.row)">导入模板</el-button>
                    <el-button size="small" type="text" @click="getExportClick(scope.row)">导出模板</el-button>
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
        <el-dialog title="导入" :visible.sync="showImportVisible">
            <el-button size="mini" type="primary" @click="chooseClick">选择文件</el-button>
            <div class="itemBtn" slot="footer">
                <el-button type="primary" @click="showImportVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            tableData:[{
               'id':'0',
               'templateName':'医保数据模板',
               'Uploadtime':'2022-2-23',
               'Uploader':'系统管理员'
            },{
               'id':'1',
               'templateName':'医保数据模板',
               'Uploadtime':'2022-2-25',
               'Uploader':'系统管理员'
            },{
               'id':'2',
               'templateName':'医院基本信息模板',
               'Uploadtime':'2022-2-27',
               'Uploader':'系统管理员'
            }],
            listLoading:false,
            showImportVisible:false,
            apComServerData:{
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
        }
    },
    mounted() {
        this.initData()
    },
    methods:{
        //初始化数据
        initData(){

        },
        //导入模板
        getImportclick(){
            this.showImportVisible = true
        },
        //导出模板
        getExportClick(){},
        // 每页数
        handleSizeChange(val){
            this.pageSize = val
            this.currentPage = 1
            this.initData()
        }, 
        // 当前页
        handleCurrentChange (val) {
            this.currentPage = val
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