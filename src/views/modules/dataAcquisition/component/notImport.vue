<template>
    <div class='notImport'>
        <el-table :data="tableList" border :height="$tableHeight-75" :header-cell-style="{textAlign:'center'}" style="width: 100%">
             <template v-for="(item,index) in columnList">
                    <el-table-column :prop="item" :label="item" :key="index"  width show-overflow-tooltip/>
             </template>
        </el-table>
        <el-pagination 
                :page-size="apComServerData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="apComServerData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="apComServerData.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                ></el-pagination>
        <div class="itemBtn">
            <el-button  @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:"notImport",
    data(){
        return{
            tableList:[],
            columnList:[],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
                total:0,
                pageIndex:1
            },
        }
    },
    mounted() {
        this.getInitList();
    },
    methods:{
        //初始化数据
        getInitList(){
            this.$http({
                url: this.$http.adornUrl('/hospitalCollectPlan/getUnImportHospitalList'),
                method: "get",
                params: this.$http.adornParams({
                    pageNo :this.apComServerData.pageIndex,
                    pageSize:this.apComServerData.pageSize,
                })
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    debugger
                    this.tableList = data.result.result
                    this.columnList = data.result.columns
                    this.apComServerData.total = data.result.pagination.dataCount
                }else{
                    this.tableList = []
                }
            })
        },
        //关闭
        close(){
          this.$emit('close')
        },
        // 页数
        handleSizeChange(val){
            this.apComServerData.pageSize = val;
            this.apComServerData.pageIndex = 1
            this.getInitList()
        },
        //当前页
        handleCurrentChange(val){
            this.apComServerData.pageIndex = val;
            this.getInitList()
        },
    }
}
</script>
<style lang="scss" scoped>

.itemBtn{
    text-align: center;
    margin-top: 10px;
}
</style>
