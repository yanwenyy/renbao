
<template>
    <div>
        <el-table :data="tableList" border height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column prop="batch" label="批次" align="center"></el-table-column>
            <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
            <el-table-column label="采集数据文件路径" align="center" prop="filepath"></el-table-column>
            <el-table-column label="数据类型" align="center" prop="dataType"></el-table-column>
            <el-table-column label="采集人" align="center" prop="Collector"></el-table-column>
            <el-table-column label="开始时间" align="center" prop="startDate"></el-table-column>
            <el-table-column label="结束时间" align="center" prop="endDate"></el-table-column>
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
            <el-table-column align="center" label="日志">
                <template slot-scope="scope">
                    <el-button @click="editClick(scope.row.id)" size="mini">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pager'>
            <el-pagination small layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total"></el-pagination>
        </div>
        <!-- 查看弹框-->
        <el-dialog title='查看日志' :close-on-click-modal="false" width="50%" :modal-append-to-body="false" :visible.sync="editShowVisible">
            <Edit v-if="editShowVisible" @close="closeEditDrawer" @ok="EditSucceed"></Edit>
        </el-dialog>
    </div>
</template>
<script>
import Edit from './edit.vue'
export default {
    components:{
        Edit
    },
    name:'InsuranceList',
    data(){
        return{
            tableList:[{
                'id':'0',
                'batch':'20220217',
                'fileName':'北京部分医保数据.xls',
                'filepath':'全部文件/医保数据/通辽医保数据/北京部分医保数据.xls',
                'dataType':'医保数据',
                'Collector':'小明',
                'startDate':'2022-2-17 13:45',
                'endDate':'2022-2-16 14:45',
                'stauts':'1',
                'schedule':'90'
            },{
                'id':'1',
                'batch':'20220216',
                'fileName':'北京部分医保数据.csv',
                'filepath':'全部文件/医保数据/通辽医保数据/北京部分医保数据.csv',
                'dataType':'医保数据',
                'Collector':'小红',
                'startDate':'2022-2-17 13:45',
                'endDate':'-',
                'stauts':'1',
                'schedule':'10'
            },{
                'id':'2',
                'batch':'20220214',
                'fileName':'slybdata20210707.xls',
                'filepath':'全部文件/医保数据/通辽医保数据/北京部分医保数据.xls',
                'dataType':'医保数据',
                'Collector':'小明',
                'startDate':'2022-2-17 13:45',
                'endDate':'-',
                'stauts':'0',
                'schedule':'50'
            }],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
                total:0,
            },
            editShowVisible:false  //弹框显示

        }
    },
    methods:{
        getList(){
            var that = this;
        },
       
        //查看
        editClick(){
            this.editShowVisible = true
        },
        //进度条
        format(percentage) {
           return percentage === 100 ? '满' : `${percentage}%`;
        },
        EditSucceed(){
            this.closeEditDrawer()
        },
        closeEditDrawer(){
            this.editShowVisible = false
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
