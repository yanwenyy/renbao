<template>
    <div class="dataExport">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item label="数据名称：">
                <el-select v-model="dataForm.dataName" placeholder="请选择" clearable>
                    <el-option v-for="item in dataOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="批次：">
                <el-input v-model="dataForm.batch" placeholder="请输入文件路径"></el-input>
            </el-form-item>
             <el-form-item label="校验状态：">
                <el-select v-model="dataForm.status" placeholder="已完成" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getSearch()">查询</el-button>
                <el-button @click="getReset()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <!--医保数据-->
            <el-tab-pane label="医保数据" name="insurance">
                <InsuranceData  v-if="activeName == 'insurance'" ref="insurance"></InsuranceData>
            </el-tab-pane>
            <!--医院数据-->
            <el-tab-pane label="医院数据" name="hospital">
                <Hospitaldata v-if="activeName == 'hospital'" ref="hospital"></Hospitaldata>
            </el-tab-pane>
         </el-tabs>
    </div>
</template>
<script>
import InsuranceData from './component/InsuranceData.vue'
import Hospitaldata from './component/Hospitaldata.vue'
export default {
    components:{
        Hospitaldata,
        InsuranceData
    },
    data(){
        return{
            dataForm:{
                dataName:'',
                status:'',
                batch:''
            },
            dataOptions:[{
                value:'0',
                label:'北京部分医保数据.csv'
            },{
                value:'1',
                label:'slybdata20210707.dmp'
            }],
            options:[{
                value:'0',
                label:'已完成'
            },{
                value:'1',
                label:'进行中'
            }],
            activeName:'insurance',
        }
    },
    mounted(){this.onQuery()},
    methods:{
        //tab事件
        handleClick(tab,event){
            this.activeName = tab.name;
            var that = this;
            setTimeout(function(){
                that.onQuery()
            })
        },
        onQuery(){
            this.$refs[this.activeName].getList()
        },
    }
}
</script>
<style>

</style>