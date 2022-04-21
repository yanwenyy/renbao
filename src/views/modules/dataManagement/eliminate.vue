<!-- 数据清除 -->
<template>
    <div class='eliminate'>
        <el-form :inline="true" :model="dataForm">
            <el-form-item label="项目名称:">
                <el-input v-model="dataForm.projectName" placeholder="请输入搜索内容" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAllSearch()">查询</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
            <!-- <el-form-item style="float:right">
                <el-button type="primary" @click="getConfirm()">确认</el-button>
            </el-form-item> -->
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <el-table :data="tableData" border style="100%" :height="tableHeight-10" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="listLoading">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="projectName" header-align="center" align="center" label="项目名称"></el-table-column>
                <el-table-column prop="status" header-align="center" align="center" width="150" label="状态">
                   <template slot-scope="scope">
                    <div class="tac" v-if="scope.row.status=='0'">未执行清除</div>
                    <div class="tac" v-if="scope.row.status=='1'">清除中</div>
                    <div class="tac" v-if="scope.row.status=='2'">清除完成</div>
                    <div class="tac" v-if="scope.row.status=='3'">清除失败</div>
                   </template>
                </el-table-column>
                <el-table-column prop="progress" header-align="center" align="center" label="进度">
                      <template slot-scope="scope"><el-progress :percentage="parseFloat(scope.row.progress)"></el-progress></template>
                    <!-- <template slot-scope="scope">
                        <el-progress v-if="scope.row.status=='0'" :percentage="0"></el-progress>
                        <el-progress v-if="scope.row.status=='1'" :percentage="50"></el-progress>
                        <el-progress v-if="scope.row.status=='2'" :percentage="100"></el-progress>
                        <el-progress v-if="scope.row.status=='3'" :percentage="0"></el-progress>
                    </template> -->
                </el-table-column>
                <el-table-column prop="updateUserName" header-align="center" align="center" label="修改人"></el-table-column>
                <el-table-column align="center" width="150" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="resetClick(scope.row.projectId)" type="text" size="small">清除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
         <el-pagination
                :page-size="apComServerData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="apComServerData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="apComServerData.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                ></el-pagination>
        <!-- <el-dialog title="数据清除" :visible.sync="showResetVisible">
            <div class='content'>
                <span>清除列表:</span>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="itemBtn" slot="footer">
                <el-button type="primary" @click="submitForm">确定</el-button>
                <el-button @click="showResetVisible = false">取消</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>
<script>
const cityOptions = ['医保数据', '医院数据', '规则结果明细'];
export default {
    data(){
        return{
            dataForm:{
                projectName:''
            },
            listLoading:false,
            checkedCities:[],
            cities:cityOptions,
            tableData:[],
            showResetVisible:false,
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageIndex:1,
                total:0,
            },
        }
    },
  computed:{
    tableHeight: {
      get () { return this.$store.state.common.tableHeight}
    },
  },
    mounted() {
        this.getDataList()
    },
    methods:{
        // 初始化数据列表
        getDataList(){
            this.tableLoading = true;
            this.$http({
                url:this.$http.adornUrl('/projectDump/selectPageList'),
                method: 'get',
                params: this.$http.adornParams({
                    projectName: this.dataForm.projectName,
                    pageSize:this.apComServerData.pageSize,
                    pageNo:this.apComServerData.pageIndex,
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableData = data.result.records
                    this.apComServerData.total = data.result.total
                }else{
                    this.tableData = []
                    // this.apComServerData.total = 0
                }
                this.tableLoading = false;
            })
        },
        //查询事件
        getAllSearch(){
            this.getDataList()
        },
        //重置
        resetForm(){
            this.dataForm.projectName = ''
        },
        //清除事件
        resetClick(id){
            this.$confirm('确认要清除此项目！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                this.$http({
                    url:this.$http.adornUrl('/projectDump/dumpProjectById'),
                    method: 'get',
                    params: this.$http.adornParams({
                        projectId: id,
                    })
                }).then(({data}) =>{
                    if(data && data.code === 200){
                        this.getDataList()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消清除'
                });
            })
        },
        // 页数
        handleSizeChange(val){
            this.apComServerData.pageSize = val;
            this.apComServerData.pageIndex = 1
            this.getDataList()
        },
        //当前页
        handleCurrentChange(val){
            this.apComServerData.pageIndex = val;
            this.getDataList()
        },
    }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
}
</style>
