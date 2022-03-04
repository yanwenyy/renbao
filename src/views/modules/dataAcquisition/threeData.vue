<template>
    <div class='threeData'>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item label="请选择导入数据类型：">
                <el-select v-model="dataForm.dataType" placeholder="请选择" @change='changeOption'>
                    <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <div class='f_right'>                    
                <el-button size="mini" type="primary" @click="searchList">查询条件</el-button>
                <el-button size="mini" @click="reportList">导出</el-button>
            </div>
            <!-- <div> -->
                <!-- <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item title="查询条件" name="1">
                         <el-radio v-model="radio" label="1">是</el-radio>
                         <el-radio v-model="radio" label="2">否</el-radio> -->
                    <!-- 表格 -->
                     <!-- <div>111</div> -->
                     <!-- </el-collapse-item> -->
                      <el-table :data="tableList" v-if="selectNum == 0" border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                    </el-table>
                    <el-table :data="tableList" v-if="selectNum == 1" border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                        <template v-for="(item,index) in tableColumns">
                            <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip></el-table-column>
                        </template>
                    </el-table>
                    <el-table :data="tableList2" v-if="selectNum == 2" border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                        <template v-for="(item,index) in tableColumns2">
                            <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                        </template>
                    </el-table>
                    <el-table :data="tableList3" v-if="selectNum == 3" border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                        <template v-for="(item,index) in tableColumns3">
                            <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                        </template>
                    </el-table>
                    <el-table :data="tableList4" v-if="selectNum == 4" border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                        <template v-for="(item,index) in tableColumns4">
                            <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                        </template>
                    </el-table>
                    <el-table :data="tableList5" v-if="selectNum == 5" border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                        <template v-for="(item,index) in tableColumns5">
                            <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip ></el-table-column>
                        </template>
                    </el-table>
            <!-- </el-collapse> -->
            <!-- </div> -->
            <div class='pager'>
                <el-pagination small layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dataForm:{
                dataType:'',
            }, 
            selectNum:0,
            apComServerData:{
                current: 1,
                pageSize: 10,
                pageNum:1,
                total:0,
            },
            activeKey:[],
            activeNames: ['1'],
            radio:'1',
            options: [
                {
                    value: '0',
                    label: '请选择'
                },
                {
                    value: '1',
                    label: '医保药品目录'
                },{
                    value: '2',
                    label: '医保诊疗项目目录'
                },{
                    value: '3',
                    label: '医保耗材目录'
                },{
                    value: '4',
                    label: '病种目录'
                },{
                    value: '5',
                    label: '服务价格目录'
                }],
            tableList:[{
                药品编码:'ZC02AAK0019020203291',
                通用中文名称:'康艾注射液',
                药理分类:'',
                药品序号:'',
                收费类别:'乙类中成药',
                处方药标志:'',
                助记码:'kazsy',
                剂量单位:'盒',
                标准价格:'',
                自负比例:'0.1',
                剂型:'',
                用法:'',
                日常规用量:'',
                药品等级:'乙类',
                特殊病标识:'恶性肿瘤门诊治疗',
                药品分类:'中成药',
                产地:'',
                备注:'限二级及以上医疗机构说明书标明恶性肿瘤的中晚期治疗。支付标准不得高于：11.73元(5ml/支)；19.94元(10ml/支)；33.9元(20ml/支)',
                使用限制等级:'',
                医院等级AKA101:'',
                医院类型BKA057:'',
                门诊用药标识BKA058:'1',
                住院用药标识BKA059:'1',
                定额用药标识BKA060:'',
                失效日期BKA063:'',
                社区标志:'1',
                社区标准价格:'',
            }],
            tableList2:[{
                诊疗项目编码:'C03110708003040',
                诊疗项目名称:'手部接骨板',
                单位:'',
                物价局单价:'',
                收费类别:'术中一次性材料费',
                收费项目等级:'',
                助记码:'kazsy',
                自负比例:'0.1',
                备注:'限二级及以上医疗机构说明书标明恶性肿瘤的中晚期治疗。支付标准不得高于：11.73元(5ml/支)；19.94元(10ml/支)；33.9元(20ml/支)',
                限报:'',
            }],
            tableList3:[{
                医疗服务设施项目编码:'w0101',
                医疗服务设施项目名称:'门(急)诊收费标准',
                单位:'',
                物价局单价:'',
                收费类别:'',
                收费项目等级:'',
                助记码:'',
                自负比例:'0',
                备注:'',
                限报:'0',
            },{
                医疗服务设施项目编码:'w0101020010yb1',
                医疗服务设施项目名称:'医事服务费【三级医院】【行政办公区门诊部】',
                单位:'人次',
                物价局单价:'41',
                收费类别:'门（急）诊诊疗费 （门诊医事服务费）',
                收费项目等级:'乙类',
                助记码:'ysfwfxzbgqmzb',
                自负比例:'',
                备注:'限友谊医院',
                限报:'40',
            }], 
            tableList4:[{
                科室:'神经内科',
                病种名称:'面神经疾患',
                id:'0'
            },{
                科室:'神经内科',
                病种名称:'短暂性大脑缺血性发作',
                id:'1'
            },{
                科室:'心血管内科',
                病种名称:'慢性心力衰竭',
                id:'2'
            }], 
            tableList5:[{
                id:'0',
                项目名称:'一般侦查费（非注射型）',
                项目内涵:'指医护人员提供(技术劳务)的诊疗服务',
                计价单位:'次',
                价格:'6',
            },{
                id:'1',
                项目名称:'普通病房床位费',
                项目内涵:'含病床、床头柜、座椅(或木凳)、床垫、棉褥、棉被(或毯)、枕头、床单、病人服装、热水瓶、洗脸盆、废品袋(或篓)、大小便器等',
                计价单位:'日',
                价格:'20',
            }], 
            tableColumns2:["诊疗项目编码","诊疗项目名称","单位","物价局单价","收费类别","收费项目等级","助记码","自负比例","备注","限报"],
            tableColumns3:["医疗服务设施项目编码","医疗服务设施项目名称","单位","物价局单价","收费类别","收费项目等级","助记码","自负比例","备注","限报"],
            tableColumns4:[
                "科室","病种名称"
            ],
            tableColumns5:["项目名称","项目内涵","计价单位","价格"],
            tableColumns:
            [
                "药品编码",
                "通用中文名称",
                "药理分类",
                "药品序号",
                "收费类别",
                "处方药标志",
                "助记码",
                "剂量单位",
                "标准价格",
                "自负比例",
                "剂型",
                "用法",
                "日常规用量",
                "药品等级",
                "特殊病标识",
                "药品分类",
                "产地",
                "备注",
                "使用限制等级",
                "医院等级AKA101",
                "医院类型BKA057",
                "门诊用药标识BKA058",
                "住院用药标识BKA059",
                "定额用药标识BKA060",
                "失效日期BKA063",
                "社区标志",
                "社区标准价格",
            ],
        }
    },
    methods:{
        //导出数据
        reportList(){

        },
        //select时间
        changeOption(val){
            console.log(val)
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
            }else if(val == 0){
                this.selectNum = val
            }
        },
        //查询条件事件
        handleChange(){},
        searchList(){}
    }
}
</script>
<style lang="scss" scoped>
.f_right{
    float: right;
    padding:5px;
}
</style>