<template>
    <div class="Information">
        <el-form :inline="true" :model="ruleForm">
            <el-form-item label="选择目录:">
                <el-select v-model="ruleForm.dataType" placeholder="请选择" @change='changeOption'>
                    <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <div class='f_right'>                    
                <el-button size="mini" type="primary" @click="searchList">查询</el-button>
                <el-button size="mini" @click="reportList">导出</el-button>
            </div>
            <div class='ax_default'>
                <div @click="handleChange" >查询条件<i v-show="!show" class="el-icon-arrow-down" style="padding-left:5px"></i><i v-show="show" class="el-icon-arrow-up" style="padding-left:5px"></i></div>
                <transition name="sub-comments">
                    <vue-query-builder :rules="rules" class="mask" v-show="show" v-model="output"></vue-query-builder>
                </transition>
            </div>
            <el-table :data="tableList" v-if="selectNum == 1" border style="100%" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                    <template v-for="(item,index) in tableColumns">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip></el-table-column>
                    </template>
                </el-table>
                <el-table :data="tableList2" v-if="selectNum == 2" border style="100%" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                    <template v-for="(item,index) in tableColumns2">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                    </template>
                </el-table>
                <el-table :data="tableList3" v-if="selectNum == 3" border style="100%" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                    <template v-for="(item,index) in tableColumns3">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                    </template>
                </el-table>
                <el-table :data="tableList4" v-if="selectNum == 4" border style="100%" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                    <template v-for="(item,index) in tableColumns4">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                    </template>
                </el-table>
                <el-table :data="tableList5" v-if="selectNum == 5" border style="100%" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                    <template v-for="(item,index) in tableColumns5">
                        <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                    </template>
                </el-table> 
                <el-pagination small layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total"></el-pagination>
        </div>

    </div>
</template>
<script>
import VueQueryBuilder from './VueQueryBuilder.vue'
export default {
    name:'Information',
    components:{
        VueQueryBuilder
    },
    data(){
        return{
            ruleForm:{
                dataType:''
            },
            show:false,
            selectNum:1,
            //分页
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
                total:0,
            },
            dataListLoading: false,
            output:null,
            options: [
                {
                    value: '医保药品目录',
                    label: '医保药品目录'
                },{
                    value: '医保诊疗项目目录',
                    label: '医保诊疗项目目录'
                },{
                    value: '医保耗材目录',
                    label: '医保耗材目录'
                },{
                    value: '病种目录',
                    label: '病种目录'
                },{
                    value: '服务价格目录',
                    label: '服务价格目录'
            }],  
            rules:  [
                {
                type: "text",
                id: "药品编码",
                label: "药品编码 ",
                },{
                type: "text",
                id: "通用中文名称",
                label: "通用中文名称",
                },{
                type: "text",
                id: "药理分类",
                label: "药理分类",
                },{
                type: "text",
                id: "药品序号",
                label: "药品序号",
                },{
                type: "text",
                id: "收费类别",
                label: "收费类别",
                },{
                type: "text",
                id: "处方药标志",
                label: "处方药标志",
                },{
                type: "text",
                id: "助记码",
                label: "助记码",
                }, {
                type: "text",
                id: "剂量单位",
                label: "剂量单位",
                }],
                tableList2:[],
                tableList:[],
                tableList3:[],
                tableList4:[],
                tableList5:[],
                tableColumns2:[],
                tableColumns3:[],
                tableColumns4:[],
                tableColumns5:[],
                tableColumns:[]
        }
    },
    methods:{
        //选中事件
        changeOption(val){
            this.getDataList()
            if(val == 1){
                this.selectNum = val
            }else if(val == 2){
                this.selectNum = val
            }else if(val == 3){
                this.selectNum = val
            }else if(val == 4){
                this.selectNum = val
            }else if(val == 5){
                this.selectNum = val
            }
        },
        getDataList(){
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl("/threeCatalog/dataImportCommonMethod"),
                method: "post",
                params: this.$http.adornParams({
                    catalogType:this.ruleForm.dataType,
                    file:[]
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableList = data.result
                    this.apComServerData.total
                }else{
                    this.dataList = [];
                    this.apComServerData.total = 0; 
                }
                this.dataListLoading = false;
            })
        },
        searchList(){
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl("/threeCatalog/getThreeCatalogDataList"),
                method: "get",
                params: this.$http.adornParams({
                    catalogType:this.ruleForm.dataType,
                    complexWhere:this.output,
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableList = data.result
                    this.apComServerData.total
                }else{
                    this.dataList = [];
                    this.apComServerData.total = 0; 
                }
                this.dataListLoading = false;
            })
        },
        reportList(){},
        //查询条件事件
        handleChange(){
            this.show = !this.show
        }
    }
}
</script>
<style lang="scss" scoped>
.f_right{
    float: right;
    padding:5px;
}
.mask{
    width: 84.2%;
    padding-top: 23px;
    position: fixed;
    z-index: 998;
    overflow: hidden;
}
.sub-comments-leave-active,.sub-comments-enter-active {
    transition: all 1s ease;
}
.sub-comments-leave-active,.sub-comments-enter {
    height:0px !important;
}
.sub-comments-leave,.sub-comments-enter-active {
    height:500px;
}
</style>