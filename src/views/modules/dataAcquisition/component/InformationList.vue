
<template>
    <div>
        <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column type="selection"  header-align="center" align="center" width="50"></el-table-column>
            <el-table-column label="批次" align="center" prop="pName"> </el-table-column>
            <el-table-column label="文件名" align="center" prop="fileName"></el-table-column>
            <el-table-column label="采集数据文件路径" align="center" prop="floor"> </el-table-column>
            <el-table-column label="采集人" align="center" prop="Collector"> </el-table-column>
            <el-table-column label="开始时间" align="center" prop="startDate"></el-table-column>
            <el-table-column label="结束时间" align="center" prop="endDate"> </el-table-column>
            <el-table-column label="状态" align="center" prop="stauts">
                <template slot-scope="scope">
                    <div class="tac" v-if="scope.row.stauts=='0'">已完成</div>
                    <div class="tac" v-if="scope.row.stauts=='1'">进行中</div>
                    <div class="tac" v-if="scope.row.stauts=='2'">失败</div>
                </template>
            </el-table-column>
            <el-table-column label="进度" align="center" prop="schedule">
                <template slot-scope="scope"><el-progress :percentage="parseFloat(scope.row.schedule)"></el-progress></template>
            </el-table-column>
            <el-table-column align="center"  label="操作">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row.id)" size="mini">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pager'>
            <el-pagination small layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total"></el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name:'InformationList',
    data(){
        return{
            tableData:[{
                'id':'0',
                'pName':'20220217',
                'fileName':'妇幼保健院',
                'floor':'全部文件/医院数据/幼妇保健院/门诊明细.xls',
                'Collector':'小明',
                'startDate':'2022-2-17 13:45',
                'endDate':'2022-2-16 14:45',
                'stauts':'1',
                'schedule':'60'
            },{
                'id':'1',
                'pName':'20220216',
                'fileName':'北京部分医保数据.xls',
                'floor':'全部文件/医保数据/北京医保数据/门诊明细.xls',
                'Collector':'小红',
                'startDate':'2022-2-16 13:45',
                'endDate':'2022-2-16 14:45',
                'stauts':'0',
                'schedule':'33'
            },{
                'id':'2',
                'pName':'20220215',
                'fileName':'slybdata20210707.xls',
                'floor':'全部文件/医保数据/通辽医保数据/门诊明细.xls',
                'Collector':'小华',
                'startDate':'2022-2-14 13:45',
                'endDate':'',
                'stauts':'2',
                'schedule':'20'

            }],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
                total:0,
            }
        }
    },
    methods:{
        getList(){},
        edit(){},
        //进度条
        format(percentage) {
           return percentage === 100 ? '满' : `${percentage}%`;
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
