<template>
    <div class='notImport'>
        <el-table :data="tableList" border height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column label="医院名称" align="center" prop="HospitalName"></el-table-column>
            <el-table-column label="医院编码" align="center" prop="HospitalCode"></el-table-column>
            <el-table-column label="医院性质" align="center" prop="HospitalNature"></el-table-column>
            <el-table-column label="医院类别" align="center" prop="HospitalType"></el-table-column>
            <el-table-column label="医院基金支付总金额" align="center" prop="HospitalAmount"></el-table-column>
        </el-table>
        <div class='pager'>
            <el-pagination small layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total"></el-pagination>
        </div>
        <div class="itemBtn">
            <el-button type="primary" @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:"notImport",
    data(){
        return{
            tableList:[{
                'id':'0',
                'HospitalName':'商洛市中医医院',
                'HospitalCode':'1760000',
                'HospitalNature':'综合医院',
                'HospitalType':'三级甲等',
                'HospitalAmount':'23241234.35'
            },{
                'id':'0',
                'HospitalName':'商洛康健精神病医院',
                'HospitalCode':'1450000',
                'HospitalNature':'综合医院',
                'HospitalType':'三级甲等',
                'HospitalAmount':'45423465.78'
            },{
                'id':'0',
                'HospitalName':'柞水祥瑞医院',
                'HospitalCode':'1250000',
                'HospitalNature':'专科医院',
                'HospitalType':'三级甲等',
                'HospitalAmount':'4547786.43'
            }],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
                total:0,
            },
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
