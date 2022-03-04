<template>
    <div class='Edit'>
        <el-table :data="tableList" border height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column label="校验规则" align="center" prop="ValidateRules"></el-table-column>
            <el-table-column label="校验状态" align="center" prop="ValidateStatus"></el-table-column>
            <el-table-column label="校验结果" align="center" prop="ValidateResult"></el-table-column>
        </el-table>
        <div class="itemBtn">
            <el-button type="primary" @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:"Edit",
    data(){
        return{
            tableList:[{
                'id':'0',
                'ValidateRules':'1.开始校验表名是否合格',
                'ValidateStatus':'校验完成',
                'ValidateResult':'1'
            },{
                'id':'0',
                'ValidateRules':'2.开始校验表结构是否合格',
                'ValidateStatus':'校验完成',
                'ValidateResult':'0'
            },{
                'id':'0',
                'ValidateRules':'3.开始采集数据',
                'ValidateStatus':'采集中',
                'ValidateResult':'1'
            }]
        }
    },
    methods:{
        //关闭
        close(){
          this.$emit('close')
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
