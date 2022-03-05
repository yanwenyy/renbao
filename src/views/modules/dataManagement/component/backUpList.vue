<template>
    <div class='backUpList'>
        <el-table :data="tableList" border :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column prop="backupName" label="项目备份名称" min-width="150px" align="center"></el-table-column>
            <el-table-column label="备份时间" align="center" prop="backupDate"></el-table-column>
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
            tableList:[]
        }
    },
    methods:{
        //关闭
        close(){
          this.$emit('close')
        },
        //还原
        restoreClick(){}
    }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
    margin-top: 10px;
}
</style>
