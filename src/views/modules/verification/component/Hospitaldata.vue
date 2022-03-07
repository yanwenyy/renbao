<template>
    <div class='Hospitaldata'>
        <div class='listDisplay'>
             <el-button type="primary" @click="addClick()">新增校验</el-button>
        </div>
        <el-table :data="tableList" border stripe style="width: 100%">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column label="医院名称" align="center" prop="name"> </el-table-column>
            <el-table-column label="校验进度" align="center" prop="schedule">
                <template slot-scope="scope">
                    <el-progress :percentage="parseFloat(scope.row.schedule)"></el-progress>
                </template>
            </el-table-column>
            <el-table-column label="采集人" align="center" prop="floor"> </el-table-column>
            <el-table-column label="确认人" align="center" prop="spaceNum"></el-table-column>
            <el-table-column label="校验状态" align="center" prop="status">
                <template slot-scope="scope">
                    <div v-if="scope.row.status == '0'">已完成</div>
                    <div v-if="scope.row.status == '1'">进行中</div>
                </template> </el-table-column>
            <el-table-column label="日志" align="center" prop="startDate">
                  <template slot-scope="scope">
                    <el-button @click="edit(scope.row.id)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="批次" align="center" prop="batch"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button @click="determineClick(scope.row.id)"  type="text" size="small">确认合格</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pager'>
            <el-pagination small layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total"></el-pagination>
        </div>
        <el-dialog title="新增校验" :visible.sync="ShowAddVisible">
            <el-table :data="AddTableList" border @selection-change="handleSelectionChange" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" style="width: 100%;">
                <el-table-column  type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="tableName" align="center" label="医院名称"></el-table-column>
                <el-table-column prop="spaceSize" align="center" label="批次"></el-table-column>
                <el-table-column prop="status" align="center" label="采集状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == '0'">已完成</div>
                        <div v-if="scope.row.status == '1'">进行中</div>
                    </template> 
                </el-table-column>
            </el-table>
            <div class="itemBtn" slot="footer">
                <el-button type="primary" @click="startClick()">开始校验</el-button>
            </div>
         </el-dialog>
    </div>
</template>
<script>
export default {
    name:'Hospitaldata',
    data(){
        return{
            tableList:[
            //     {
            //     'name':'商洛市中心医院',
            //     'schedule':'50',
            //     'floor':'小红',
            //     'spaceNum':'',
            //     'status':'1',
            //     'startDate':'',
            //     'batch':'20220216'
            // },{
            //     'name':'商洛市中医院',
            //     'schedule':'78',
            //     'floor':'小红',
            //     'spaceNum':'',
            //     'status':'0',
            //     'startDate':'',
            //     'batch':'20220215'
            // }
            ],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
            },
            //新增校验
            AddTableList:[
            //     {
            //     'tableName':'商洛市中心医院',
            //     'status':'0',
            //     'spaceSize':'20220216'
            // },{
            //     'tableName':'商洛市中医院',
            //     'status':'0',
            //     'spaceSize':'20220215'
            // }
            ],
            ShowAddVisible:false,
            multipleSelection:[],
        }
    },
    methods:{
        //新增校验
        addClick(){
            this.ShowAddVisible = true;
        },
        //查看
        edit(){},
        //确认合格
        determineClick(){

        },
        //获取数据
        getList(){
            var that = this;
        },
        //多选
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        //开始校验
        startClick(){
            if(this.multipleSelection.length == 0  || this.multipleSelection.length > 1){
                this.$confirm('请勾选一条数据','信息',{
                    confirmButtonText:'关闭',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '校验成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消校验'
                    });
                })
            }     
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