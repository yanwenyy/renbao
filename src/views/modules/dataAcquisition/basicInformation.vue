<template>
    <div class='threeData'>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item label="医院名称：">
                <el-input v-model="dataForm.basicName" placeholder="请输入搜索内容" clearable></el-input>
            </el-form-item>
             <el-form-item label="医院类别：">
                <el-select v-model="dataForm.basicType" placeholder="请输入搜索内容" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医保基金支付总金额：">
                <el-col :span="11">
                <el-input placeholder="请输入搜索内容" v-model="dataForm.data1" style="width: 100%;"></el-input>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                <el-time-picker placeholder="请输入搜索内容" v-model="dataForm.data2" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataList()">查询</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <div class='f_right'>                    
                <el-button size="mini" type="primary" @click="exportData">导出数据</el-button>
                <el-button size="mini" type="primary" @click="importData">导入数据</el-button>
            </div>
            <el-table :data="tableList" border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="listLoading">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="basicName" header-align="center" align="center" label="医院名称"></el-table-column>
                <el-table-column prop="basicCode" header-align="center" align="center" label="医院编码"></el-table-column>
                <el-table-column prop="administration" header-align="center" align="center" label="医院性质"> </el-table-column>
                <el-table-column prop="basicType" header-align="center" align="center" label="医院类别"></el-table-column>
                <el-table-column prop="absicamount" header-align="center" align="center" label="医院基金支付总金额"></el-table-column>
            </el-table>
            <div class='pager'>
              <el-pagination 
                small
                :page-size="apComServerData.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="apComServerData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                ></el-pagination>
            </div>
        </div>
        <el-dialog title='导入数据' :close-on-click-modal="false" width="30%" :modal-append-to-body="false" :visible.sync="importVisible">
            <Import v-if="importVisible" @close="closeimportDrawer"  @ok="importSucceed"></Import></el-dialog>
    </div>
</template>
<script>
import Import from './component/import.vue'
export default {
    components: {
      Import
    },
    data(){
        return{
            dataForm:{
                basicName:'',
                basicType:'',
                data2:'',
                data1:''
            }, 
            //loading
            listLoading: false,
            importVisible:false,
            apComServerData:{
                current: 1,
                size: 10,
                pageNum:1,
                total:0,
            },
            tableList:[{
                'id':'0',
                'basicName':'商洛市中心医院',
                'basicCode':'1650000',
                'administration':'专科医院',
                'basicType':'三级甲等',
                'absicamount':'105468215.22',
            },
            {
                'id':'1',
                'basicName':'幼妇保健院',
                'basicCode':'1650000',
                'administration':'综合医院',
                'basicType':'三级甲等',
                'absicamount':'1224759234.53',
            }, //table表格
            {
                'id':'2',
                'basicName':'中医医院',
                'basicCode':'1650000',
                'administration':'专科医院',
                'basicType':'三级甲等',
                'absicamount':'105468215.22',
            },
            {
                'id':'3',
                'basicName':'商洛市中心医院',
                'basicCode':'1650000',
                'administration':'专科医院',
                'basicType':'三级甲等',
                'absicamount':'105468215.22',
            },
            {
                'id':'4',
                'basicName':'商洛康健精神病医院',
                'basicCode':'1650000',
                'administration':'综合医院',
                'basicType':'三级甲等',
                'absicamount':'45423465.78',
            }],
            tableColumns:[],
            options:[{
                value:'0',
                label:'三级甲等'
            },{
                value:'1',
                label:'三级乙等'
            },{
                value:'2',
                label:'三级丙等'
            }]
        }
    },
    mounted(){
        this.initList()
    },
    methods:{
        //初始化数据列表
        initList(){
            this.listLoading = true;
            // this.$http({
              
            // }).then(() =>{
            //     // this.listLoading =false
            // })
        },
        //导出数据
        reportList(){

        },
        //select时间
        changeOption(val){
            console.log(val)
        },
        //重置
        resetForm(){},
        //查询
        getDataList(){},
        //导入
        importData(){
            this.importVisible = true
        },
        //导出
        exportData(){},
        // 关闭弹窗确认
        importSucceed(){
            this.closeimportDrawer()
        },
        closeimportDrawer(){
            this.importVisible = false
        },
        // 页数
        handleSizeChange(val){
             this.apComServerData.size = val;
             this.initList()
        },
        //当前页
        handleCurrentChange(val){
            this.apComServerData.pageNum = val;
             this.initList()
        }

    }
}
</script>
<style lang="scss" scoped>
.f_right{
    float: right;
    padding:5px;
}
.line{
    text-align: center;
}
</style>