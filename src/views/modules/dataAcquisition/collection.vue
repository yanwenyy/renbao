<template>
    <div class='collection'>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item label="文件名：">
                <el-input v-model="dataForm.fileName" placeholder="请输入文件名"></el-input>
            </el-form-item>
            <el-form-item label="文件路径：">
                <el-input v-model="dataForm.filePath" placeholder="请输入文件路径"></el-input>
            </el-form-item>
             <el-form-item label="采集状态：">
                <el-select v-model="dataForm.collectionStatus" placeholder="已完成" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间：">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="dataForm.timeStart" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-time-picker placeholder="选择日期" v-model="dataForm.timeEnd" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getSearch()">查询</el-button>
                <el-button @click="getReset()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class='listDisplay'>
             <el-button type="danger" @click="getStopCollection()">停止采集</el-button>
        </div>
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <!--医保数据-->
        <el-tab-pane label="医保数据" name="audit">
            <InsuranceList  v-if="activeName == 'audit'" ref="audit"></InsuranceList>
        </el-tab-pane>
         <!--医院数据-->
        <el-tab-pane label="医院数据" name="pass">
            <HospitalList v-if="activeName == 'pass'" ref="pass"></HospitalList></el-tab-pane>
        <!--医院基本信息-->
        <el-tab-pane label="医院基本信息" name="noPass">
            <InformationList v-if="activeName == 'noPass'" ref="noPass"></InformationList>
        </el-tab-pane>
         </el-tabs>
    </div>
</template>
<script>
import InsuranceList from './component/InsuranceList.vue'
import HospitalList from './component/HospitalList.vue'
import InformationList from './component/InformationList.vue'
export default {
    components:{
        InsuranceList,
        HospitalList,
        InformationList,
    },
    data(){
        return{
            dataForm:{
                fileName:'',
                filePath:'',
                collectionStatus:'',
                timeEnd:'',
                timeStart:''
            },
            options:[{
                value:'0',
                label:'已完成'
            },{
                value:'1',
                label:'进行中'
            },{
                value:'2',
                label:'失败'
            }],
            activeName:'audit',
            tableList:[],
            tableColumns:[]
        }
    },
    mounted(){
        this.onQuery()
    },
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

        //停止采集
        getStopCollection(){
            this.$confirm('请勾选一条数据','信息',{
                confirmButtonText:'关闭',
                type: 'warning',
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.line{
    text-align: center;
}
.listDisplay{
    text-align: right;
    margin-bottom: 10px;
}
.line{
    text-align: center;
}
</style>