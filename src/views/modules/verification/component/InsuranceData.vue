<template>
    <div class='InsuranceData'>
        <div class='listDisplay'>
             <el-button type="primary" @click="startClick()">开始校验</el-button>
        </div>
        <el-table :data="tableList" border stripe style="width: 100%">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column label="批次" align="center" prop="batch"></el-table-column>
            <el-table-column label="校验进度" align="center" prop="pName">
                <template slot-scope="scope">
                     <el-progress :percentage="parseFloat(scope.row.pName)"></el-progress>
                </template>
            </el-table-column>
            <el-table-column label="采集人" align="center" prop="floor"></el-table-column>
            <el-table-column label="确认人" align="center" prop="spaceNum"></el-table-column>
            <el-table-column label="校验状态" align="center" prop="status">
                <template slot-scope="scope">
                    <div v-if="scope.row.status == '0'">已完成</div>
                    <div v-if="scope.row.status == '1'">进行中</div>
                </template>
            </el-table-column>
            <el-table-column label="日志" align="center" prop="startDate">
                  <template slot-scope="scope">
                    <el-button @click="detail(scope.row.id)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button @click="determineClick(scope.row.id)" v-if='btnQualified == true' type="text" size="small">确认合格</el-button>
                    <el-button v-if='btnQualified == false' type="text" size="small">已确认合格</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pager'>
            <el-pagination small layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total"></el-pagination>
        </div>
         <!-- 查看弹框-->
        <el-dialog :close-on-click-modal="false" width="50%" :modal-append-to-body="false" :visible.sync="detailShowVisible">
            <Detail v-if="detailShowVisible" @close="closeDetailDrawer" @ok="DetailSucceed"></Detail>
        </el-dialog>
    </div>
</template>
<script>
import Detail from './detail.vue'
export default {
    name:'InsuranceData',
    components:{
       Detail 
    },
    data(){
        return{
            tableList:[
            //     {
            //    'id':'0',
            //    'batch':'20220216' ,
            //    'pName':'50',
            //    'floor':'小华',
            //    'spaceNum':'',
            //    'status':'1'
            // },{
            //    'id':'1',
            //    'batch':'20220215' ,
            //    'pName':'30',
            //    'floor':'小明',
            //    'spaceNum':'',
            //    'status':'0'
            // }
            ],
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
            },
            detailShowVisible:false,
            btnQualified:true
        }
    },
    methods:{
        //开始校验
        startClick(){

        },
        //查看
        detail(){
            this.detailShowVisible = true
        },
        //确认合格
        determineClick(){
            // if(status == '0'){
            //      this.btnQualified = false
            // }
        },
        getList(){
            var that = this;
        },
        //弹框按钮事件
        DetailSucceed(){
            this.closeDetailDrawer()
        },
        closeDetailDrawer(){
            this.detailShowVisible = false
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