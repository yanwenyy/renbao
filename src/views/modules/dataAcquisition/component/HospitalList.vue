
<template>
    <div>
         <div class='listDisplay'>
             <el-button type="primary" @click="getStopCollection()">查看未导入医院</el-button>
        </div>
        <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column label="批次" align="center" prop="batch"> </el-table-column>
            <el-table-column label="医院名称" align="center" prop="pName"></el-table-column>
            <el-table-column label="采集数据文件路径" align="center" prop="floor"> </el-table-column>
            <el-table-column label="数据类型" align="center" prop="spaceNum"></el-table-column>
            <el-table-column label="采集人" align="center" prop="Collector"> </el-table-column>
            <el-table-column label="开始时间" align="center" prop="startDate"></el-table-column>
            <el-table-column label="结束时间" align="center" prop="endDate"> </el-table-column>
            <el-table-column label="状态" align="center" prop="spaceStatus">
                <template slot-scope="scope">
                    <div class="tac" v-if="scope.row.spaceStatus=='0'">已完成</div>
                    <div class="tac" v-if="scope.row.spaceStatus=='1'">进行中</div>
                    <div class="tac" v-if="scope.row.spaceStatus=='2'">失败</div>
                </template>
            </el-table-column>
            <el-table-column label="进度" align="center" prop="schedule">
                <template slot-scope="scope"><el-progress :percentage="parseFloat(scope.row.schedule)"></el-progress></template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row.id)" size="mini">查看进度</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pager'>
            <el-pagination small layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total"></el-pagination>
        </div>
        <!-- 查看未导入医院弹框-->
        <el-dialog title='查看未导入医院' :close-on-click-modal="false" width="50%" :modal-append-to-body="false" :visible.sync="notImportVisible">
            <NotImport v-if="notImportVisible" @close="closeImportDrawer" @ok="ImportSucceed"></NotImport>
        </el-dialog>
        <!-- 查看进度弹框-->
        <el-dialog title='查看进度' :close-on-click-modal="false" width="80%" :modal-append-to-body="false" :visible.sync="showViewVisible">
            <ViewProgress v-if="showViewVisible" @close="closeViewDrawer" @ok="viewSucceed"></ViewProgress>
        </el-dialog>
    </div>
</template>
<script>
import NotImport from './notImport.vue'
import ViewProgress from './viewProgress.vue'
export default {
    name:'HospitalList',
    components:{
        NotImport,
        ViewProgress
    },
    data(){
        return{
            tableData:[{
                'batch':'20220217',
                'pName':'妇幼保健院',
                'floor':'全部文件/医院数据/幼妇保健院',
                'spaceNum':'医院数据',
                'Collector':'小明',
                'endDate':'2022-2-17 13:45',
                'startDate':'',
                'spaceStatus':'1',
                'schedule':'10'
            },{
                'batch':'20220216',
                'pName':'商洛市中医院',
                'floor':'全部文件/医保数据/商洛市中医院',
                'spaceNum':'医院数据',
                'Collector':'小红',
                'endDate':'2022-2-17 13:45',
                'startDate':'',
                'spaceStatus':'0',
                'schedule':'30'
            },{
                'batch':'20220215',
                'pName':'商洛市中心医院',
                'floor':'全部文件/医保数据/商洛市中心医院',
                'spaceNum':'医院数据',
                'Collector':'小莉',
                'startDate':'2022-2-17 13:45',
                'endDatestartDate':'2022-2-15 14:58',
                'spaceStatus':'2',
                'schedule':'14'
            }],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
                total:0,
            },
            notImportVisible:false,
            showViewVisible:false
        }
    },
    methods:{
        getList(){},
        //查看进度
        edit(){
            this.showViewVisible = true
        },
        //进度条
        format(percentage) {
           return percentage === 100 ? '满' : `${percentage}%`;
        },
        //查看未导入数据
        getStopCollection(){
            this.notImportVisible = true
        },
        ImportSucceed(){
            this.closeImportDrawer()
        },
        closeImportDrawer(){
            this.notImportVisible = false
        },
        viewSucceed(){
            this.closeViewDrawer()
        },
        closeViewDrawer(){
            this.showViewVisible = false
        }
    }
}
</script>
<style lang="scss" scoped>
.listDisplay{
    text-align: right;
    margin-bottom: 10px;
}
</style>
