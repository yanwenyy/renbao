<template>
    <div class='viewProgress'>
        <el-table :data="tableList" border height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" style="width: 100%">
            <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
            <el-table-column label="采集数据文件路径" align="center" prop="filepath"></el-table-column>
            <el-table-column label="文件类型" align="center" prop="fileType"></el-table-column>
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
                <template slot-scope="scope"><el-progress v-if="scope.row.schedule>0" :percentage="50"></el-progress></template>
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
        <div class="itemBtn">
            <el-button type="primary" @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:"viewProgress",
    data(){
        return{
            tableList:[{
                'id':'0',
                'fileName':'syldata20207071.txt',
                'filepath':'全部文件/医院数据/幼妇保健院/syldata20207071.txt',
                'fileType':'医院数据',
                'Collector':'小明',
                'startDate':'2022-2-17 13:45',
                'endDate':'-',
                'schedule':'',
                'stauts':'1',
                'HospitalAmount':'23241234.35'
            },{
                'id':'0',
                'fileName':'全部文件/医院数据/幼妇保健院/syldata20207071.dmp',
                'filepath':'1450000',
                'fileType':'医院数据',
                'Collector':'小明',
                'startDate':'2022-2-17 13:45',
                'endDate':'2022-2-17 14:45',
                'schedule':'',
                'stauts':'0',
                'HospitalAmount':'45423465.78'
            },{
                'id':'0',
                'fileName':'syldata20207071.xls',
                'filepath':'全部文件/医院数据/幼妇保健院/syldata20207071.xls',
                'fileType':'医院数据',
                'Collector':'小明',
                'startDate':'2022-2-17 13:45',
                'endDate':'2022-2-17 14:45',
                'schedule':'',
                'stauts':'2',
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
