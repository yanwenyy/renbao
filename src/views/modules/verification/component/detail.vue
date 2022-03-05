<template>
    <div class='Detail'>
        <div class='listDisplay' style='text-align:center'>
             <h2 type="primary">数据质量报告</h2>
        </div>
        <el-table :data="tableList" border height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column label="校验规则" align="center" prop="ValidateRules"></el-table-column>
            <el-table-column label="校验状态" align="center" prop="ValidateStatus">
                <template slot-scope="scope">
                    <div v-if="scope.row.ValidateStatus == '0'">校验完成</div>
                    <div v-if="scope.row.ValidateStatus == '1'">校验中</div>
                    <div v-if="scope.row.ValidateStatus == '2'">待校验</div>
                </template>
            </el-table-column>
            <el-table-column label="校验结果" align="center" prop="ValidateResult"></el-table-column>
        </el-table>
        <div class="itemBtn">
            <el-button type="primary" @click="downloadClick">下载报告</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:"Detail",
    data(){
        return{
            tableList:[
                // {
            //     'id':'0',
            //     'ValidateRules':'1.根据导出模板，检查必录字段是否为空。',
            //     'ValidateStatus':'0',
            //     'ValidateResult':'通过'
            // },{
            //     'id':'0',
            //     'ValidateRules':'2.查询数据结算时间范围是否是要提取的数据时间范围。',
            //     'ValidateStatus':'1',
            //     'ValidateResult':'通过'
            // },{
            //     'id':'0',
            //     'ValidateRules':'3. 通过对比医院数据和医院数据使用基金总金额、主单中使用基金人次，定位医院和医院数据相差情况。。',
            //     'ValidateStatus':'2',
            //     'ValidateResult':'通过'
            // }
            ]
        }
    },
    methods:{
        //关闭
        downloadClick(){
          
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
