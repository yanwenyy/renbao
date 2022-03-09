<template>
    <div class='backUpList'>
        <el-table :data="tableList" border :header-cell-style="{textAlign:'center'}" style="width: 100%" @selection-change="selectionChangeHandle">
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column prop="projectName" label="项目备份名称" min-width="150px" align="center"></el-table-column>
            <el-table-column label="备份时间" align="center" prop="projectPeriodBenig"></el-table-column>
        </el-table>
         <div class="itemBtn">
            <el-button type="primary" @click="restoreClick">还原</el-button>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'backUpList',
    data(){
        return{
            tableList:[],
            dataListSelections: [],
        }
    },
    mounted(){
        this.getInitList()
    },
    methods:{
        getInitList(){
            this.$http({
                url: this.$http.adornUrl('xmProject/projectList'),
                method: 'get',
                }).then(({data}) => {
                if (data && data.code === 200) {
                    this.tableList = data.result
                } else {
                    this.tableList = []
                }
                })
        },
        //关闭
        close(){
          this.$emit('close')
        },
        // 多选
        selectionChangeHandle (val) {
            this.dataListSelections = val
        },
        //还原
        restoreClick(){
            if(this.dataListSelections.length == 0 || this.dataListSelections.length > 1){
                this.$confirm('请勾选一条数据', '信息', {
                    confirmButtonText: '关闭',
                    type: 'warning',
                }).then(() =>{
                  
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消',
                    })  
                })
            }else{
                this.$emit('satDatalist',this.dataListSelections); // 回显医院名称
                this.$emit('close')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
    margin-top: 10px;
}
</style>
