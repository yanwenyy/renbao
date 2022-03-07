<template>
    <div class='eliminate'>
        <el-form :inline="true" :model="dataForm">
            <el-form-item label="项目名称:">
                <el-input v-model="dataForm.projectName" placeholder="请输入搜索内容" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getAllSearch()">查询</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <el-table :data="tableData" border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm" v-loading="listLoading">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="projectName" header-align="center" align="center" label="项目名称"></el-table-column>
                <el-table-column prop="status" header-align="center" align="center" width="150" label="状态"></el-table-column>
                <el-table-column prop="schedule" header-align="center" align="center" label="进度">
                    <template slot-scope="scope"><el-progress :percentage="parseFloat(scope.row.schedule)"></el-progress></template>
                </el-table-column>
                <el-table-column prop="modifier" header-align="center" align="center" label="修改人"></el-table-column>
                <el-table-column align="center" width="150" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="resetClick(scope.row.id)" type="text" size="small">清除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="数据清除" :visible.sync="showResetVisible">
            <div class='content'>
                <span>清除列表:</span>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="itemBtn" slot="footer">
                <el-button type="primary" @click="submitForm">确定</el-button>
                <el-button @click="showResetVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
const cityOptions = ['医保数据', '医院数据', '规则结果明细'];
export default {
    data(){
        return{
            dataForm:{
                projectName:''
            },
            listLoading:false,
            checkedCities:[],
            cities:cityOptions,
            tableData:[{
                'id':'0',
                'projectName':'呼和浩特市医疗保障局2021年“打击欺诈骗保”全覆盖',
                'status':'清除中',
                'schedule':'40',
                'modifier':'张吉惟'
            },{
                'id':'1',
                'projectName':'通辽市医疗保障局2021年“打击欺诈骗保”全覆盖',
                'status':'清除中',
                'schedule':'62',
                'modifier':'林国瑞'
            },{
                'id':'2',
                'projectName':'新疆自治区2022年医保基金监管飞行检查项目',
                'status':'清除中',
                'schedule':'23',
                'modifier':'林雅南'
            }],
            showResetVisible:false
        }
    },
    mounted() {
        this.getDataList()
    },
    methods:{
        // 初始化数据列表
        getDataList(){},
        //查询事件
        getAllSearch(){},
        //重置
        resetForm(){},
        //清除事件
        resetClick(){
           this.showResetVisible = true
        },
        handleCheckedCitiesChange(value){

        },
        //确定事件
        submitForm(){}
    }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
}
</style>