<template>
    <div class="Information">
        <el-form :inline="true" :model="ruleForm">
            <el-form-item label="选择目录:">
                <el-select v-model="ruleForm.catalogType" placeholder="请选择" @change='changeOption($event)'>
                    <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="listDisplay">
            <div class='f_right'>                    
                <el-button size="mini" type="primary" @click="searchList">查询</el-button>
                 <!-- <el-button size="mini" type="primary" @click="searchList">ceshi </el-button> -->
                <el-button size="mini" type="warning" @click="reportList">导出</el-button>
            </div>
            <div class='ax_default'>
                <div @click="handleChange">查询条件<i v-show="!show" class="el-icon-arrow-down" style="padding-left:5px"></i><i v-show="show" class="el-icon-arrow-up" style="padding-left:5px"></i></div>
                <transition name="sub-comments">
                    <myquerybuilder ref="myquerybuilder" :rules="queryRules" class="mask" v-show="show" v-model="output" :columns='columns' :data='data'></myquerybuilder>
                </transition>
            </div>
            <el-table :data="tableList0" v-if="selectNum == 0" border style="100%" height="600" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                </el-table>
            <el-table :data="tableList" v-if="selectNum == 1" border style="100%" height="600" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="一级医院最高价格" header-align="center" align="center" label="一级医院最高价格"></el-table-column>
                <el-table-column prop="三级医院最高价格" header-align="center" align="center" label="三级医院最高价格"></el-table-column>
                <el-table-column prop="二级医院最高价格" header-align="center" align="center" label="二级医院最高价格"> </el-table-column>
                <el-table-column prop="住院自付比例" header-align="center" align="center" label="住院自付比例"></el-table-column>
                <el-table-column prop="剂型" header-align="center" align="center" label="剂型"></el-table-column>
                <el-table-column prop="医保药品名称" header-align="center" align="center" label="医保药品名称"></el-table-column>
                <el-table-column prop="医保药品编码" header-align="center" align="center" label="医保药品编码"></el-table-column>
                <el-table-column prop="国家医保贯标目录编码" header-align="center" align="center" label="国家医保贯标目录编码"> </el-table-column>
                <el-table-column prop="备注" header-align="center" align="center" label="备注"></el-table-column>
                <el-table-column prop="工伤自付比例" header-align="center" align="center" label="工伤自付比例"></el-table-column>
                <el-table-column prop="支付单位" header-align="center" align="center" label="支付单位"></el-table-column>
                <el-table-column prop="支付类别" header-align="center" align="center" label="支付类别"> </el-table-column>
                <el-table-column prop="最高限价" header-align="center" align="center" label="最高限价"></el-table-column>
                <el-table-column prop="生效日期" header-align="center" align="center" label="生效日期"></el-table-column>
                <el-table-column prop="生育自付比例" header-align="center" align="center" label="生育自付比例"></el-table-column>
                <el-table-column prop="用法" header-align="center" align="center" label="用法"></el-table-column>
                <el-table-column prop="用量" header-align="center" align="center" label="用量"></el-table-column>
                <el-table-column prop="离休价格" header-align="center" align="center" label="离休价格"></el-table-column>
                <el-table-column prop="终止日期" header-align="center" align="center" label="终止日期"></el-table-column>
                <el-table-column prop="规格" header-align="center" align="center" label="规格"></el-table-column>
                <el-table-column prop="门诊住院用药标识" header-align="center" align="center" label="门诊住院用药标识"></el-table-column>
                <el-table-column prop="门诊自付比例" header-align="center" align="center" label="门诊自付比例"></el-table-column>
            </el-table>
             <!-- 医保诊疗项目 -->
            <el-table :data="tableList" v-if="selectNum == 2" border style="100%" height="600" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="一级医院最高价格" header-align="center" align="center" label="一级医院最高价格"></el-table-column>
                <el-table-column prop="三级医院最高价格" header-align="center" align="center" label="三级医院最高价格"></el-table-column>
                <el-table-column prop="二级医院最高价格" header-align="center" align="center" label="二级医院最高价格"> </el-table-column>
                <el-table-column prop="住院自付比例" header-align="center" align="center" label="住院自付比例"></el-table-column>
                <el-table-column prop="医保目录除外内容" header-align="center" align="center" label="医保目录除外内容"></el-table-column>
                <el-table-column prop="医保项目内涵" header-align="center" align="center" label="医保项目内涵"></el-table-column>
                <el-table-column prop="医保药品名称" header-align="center" align="center" label="医保药品名称"></el-table-column>
                <el-table-column prop="医保药品编码" header-align="center" align="center" label="医保药品编码"> </el-table-column>
                <el-table-column prop="国家医保贯标目录编码" header-align="center" align="center" label="国家医保贯标目录编码"> </el-table-column>
                <el-table-column prop="备注" header-align="center" align="center" label="备注"></el-table-column>
                <el-table-column prop="工伤自付比例" header-align="center" align="center" label="工伤自付比例"></el-table-column>
                <el-table-column prop="支付单位" header-align="center" align="center" label="支付单位"></el-table-column>
                <el-table-column prop="支付类别" header-align="center" align="center" label="支付类别"> </el-table-column>
                <el-table-column prop="最高限价" header-align="center" align="center" label="最高限价"></el-table-column>
                <el-table-column prop="生效日期" header-align="center" align="center" label="生效日期"></el-table-column>
                <el-table-column prop="生育自付比例" header-align="center" align="center" label="生育自付比例"></el-table-column>
                <el-table-column prop="用法" header-align="center" align="center" label="用法"></el-table-column>
                <el-table-column prop="离休价格" header-align="center" align="center" label="离休价格"></el-table-column>
                <el-table-column prop="终止日期" header-align="center" align="center" label="终止日期"></el-table-column>
                <el-table-column prop="规格" header-align="center" align="center" label="规格"></el-table-column>
                <el-table-column prop="门诊自付比例" header-align="center" align="center" label="门诊自付比例"></el-table-column>
            </el-table>
            <!-- 医保耗材目录 -->
            <el-table :data="tableList" v-if="selectNum == 3" border style="100%" height="600" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                <el-table-column prop="一级医院最高价格" header-align="center" align="center" label="一级医院最高价格"></el-table-column>
                <el-table-column prop="三级医院最高价格" header-align="center" align="center" label="三级医院最高价格"></el-table-column>
                <el-table-column prop="二级医院最高价格" header-align="center" align="center" label="二级医院最高价格"> </el-table-column>
                <el-table-column prop="住院自付比例" header-align="center" align="center" label="住院自付比例"></el-table-column>
                <el-table-column prop="医保目录除外内容" header-align="center" align="center" label="医保目录除外内容"></el-table-column>
                <el-table-column prop="医保项目内涵" header-align="center" align="center" label="医保项目内涵"></el-table-column>
                <el-table-column prop="医保项目名称" header-align="center" align="center" label="医保项目名称"></el-table-column>
                <el-table-column prop="医保项目编码" header-align="center" align="center" label="医保项目编码"> </el-table-column>
                <el-table-column prop="国家医保贯标目录编码" header-align="center" align="center" label="国家医保贯标目录编码"> </el-table-column>
                <el-table-column prop="备注" header-align="center" align="center" label="备注"></el-table-column>
                <el-table-column prop="工伤自付比例" header-align="center" align="center" label="工伤自付比例"></el-table-column>
                <el-table-column prop="支付单位" header-align="center" align="center" label="支付单位"></el-table-column>
                <el-table-column prop="支付类别" header-align="center" align="center" label="支付类别"> </el-table-column>
                <el-table-column prop="最高限价" header-align="center" align="center" label="最高限价"></el-table-column>
                <el-table-column prop="生效日期" header-align="center" align="center" label="生效日期"></el-table-column>
                <el-table-column prop="生育自付比例" header-align="center" align="center" label="生育自付比例"></el-table-column>
                <el-table-column prop="终止日期" header-align="center" align="center" label="终止日期"></el-table-column>
                <el-table-column prop="规格" header-align="center" align="center" label="规格"></el-table-column>
                <el-table-column prop="门诊自付比例" header-align="center" align="center" label="门诊自付比例"></el-table-column>
            </el-table>
            <!-- 病种目录 -->
            <!-- <el-table :data="tableList" v-if="selectNum == 4" border style="100%" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
            </el-table> -->
            <!-- 服务价格目录 -->
            <!-- <el-table :data="tableList" v-if="selectNum == 5" border style="100%" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
            </el-table>  -->
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="apComServerData.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="apComServerData.pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="apComServerData.size"></el-pagination>
        </div>
    </div>
</template>
<script>
import myquerybuilder from './myquerybuilder.vue'
export default {
    name:'Information',
    components:{
        myquerybuilder
    },
    data(){
        return{
            ruleForm:{
                catalogType:''
            },
            show:false,
            selectNum:0,
            //分页
            apComServerData:{
                current: 1,
                size: 10,
                pageNum:1,
                total:0,
                pageIndex:1
            }, 
            dataListLoading: false,
            output:{},
            queryRules: [], // querybuilder的规则数据
            inputselectvalue:[],
            options: [{
                    value: '0',
                    label: '请选择'
                },{
                    value: '1',
                    label: '医保药品目录'
                },{
                    value: '2',
                    label: '医保诊疗项目目录'
                },{
                    value: '3',
                    label: '医保耗材目录'
                },
                // {
                //     value: '4',
                //     label: '病种目录'
                // },{
                //     value: '5',
                //     label: '服务价格目录'
                // }
            ],  
            fileName: "",
            data:[],
            columns:{
                "columnList": [
                    {"columnName":"医保药品编码","columnType": "VARCHAR"},
                    {"columnName":"医保药品名称","columnType": "VARCHAR"},
                    {"columnName":"剂型","columnType": "VARCHAR"},
                    {"columnName":"规格","columnType": "VARCHAR"},
                    {"columnName":"用法","columnType": "VARCHAR"},
                    {"columnName":"用量","columnType": "VARCHAR"},      
                    {"columnName":"支付单位","columnType": "VARCHAR"},
                    {"columnName":"支付类别","columnType": "VARCHAR"},
                    {"columnName":"备注","columnType": "VARCHAR"},
                    {"columnName":"最高限价","columnType": "VARCHAR"},
                    {"columnName":"三级医院最高价格","columnType": "VARCHAR"},
                    {"columnName":"二级医院最高价格","columnType": "VARCHAR"},
                    {"columnName":"一级医院最高价格","columnType": "VARCHAR"},
                    {"columnName":"离休价格","columnType": "VARCHAR"},
                    {"columnName":"门诊住院用药标识","columnType": "VARCHAR"},
                    {"columnName":"门诊自付比例","columnType": "VARCHAR"},
                    {"columnName":"住院自付比例","columnType": "VARCHAR"},
                    {"columnName":"工伤自付比例","columnType": "VARCHAR"},
                    {"columnName":"生育自付比例","columnType": "VARCHAR"},
                    {"columnName":"生效日期","columnType": "INT"},
                    {"columnName":"终止日期","columnType": "INT"},
                    {"columnName":"国家医保贯标目录编码","columnType": "VARCHAR"},
                    ]},
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
                tableList:[],
                tableList0:[],
                sqlData:''
        }
    },
    methods:{
        //选中事件
        changeOption(val){
            this.tableList = []
            if(val == 1){
                this.selectNum = val
                this.fileName = '医保药品目录'
                this.getDataList(val)
            }else if(val == 2){
                this.selectNum = val
                this.fileName = '医保诊疗项目目录'
                this.getDataList(val)
            }else if(val == 3){
                this.selectNum = val
                this.fileName = '医保耗材目录'
                this.getDataList(val)
            // }
            // else if(val == 4){
            //     this.selectNum = val
            //     this.getDataList(val)
            // }else if(val == 5){
            //     this.selectNum = val
            //     this.getDataList(val)
            }else if(val == 0){
                this.selectNum = val
                this.apComServerData.total = 0; 
            }
        },
        //初始化数据
        getDataList(){
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl("/threeCatalog/getThreeCatalogDataList"),
                method: "get",
                params: this.$http.adornParams({
                    'catalogType':this.ruleForm.catalogType,
                    'pageSize':this.apComServerData.size,
                    'pageNum':this.apComServerData.pageIndex,
                    'pageCount':this.apComServerData.current,
                    'complexWhere':this.sqlData
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableList = data.result.records
                    this.apComServerData.total = data.result.total
                }else{
                    this.dataList = [];
                    this.apComServerData.total = 0; 
                }
                this.dataListLoading = false;
            })
        },
        //查询点击事件
        searchList(){
            var getSql = this.$refs.myquerybuilder.getSelectSql()
            this.sqlData = getSql.sql
            // console.log(getSql.sql)
           // this.$refs.myquerybuilder.ceshi()
            // return;
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl("/threeCatalog/getThreeCatalogDataList"),
                method: "get",
                params: this.$http.adornParams({
                    'catalogType':this.ruleForm.catalogType,
                    'complexWhere':getSql.sql,
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.tableList = data.result.records
                    this.apComServerData.total = data.result.total
                    this.getDataList()
                    
                }else{
                    this.dataList = [];
                    this.apComServerData.total = 0; 
                }
                this.dataListLoading = false;
            })
        },
        //导出
        reportList(){
            this.$http({
                url:this.$http.adornUrl('/threeCatalog/excelDataExport'),
                method: "get",
                responseType: 'blob',//解决乱码问题
                params :this.$http.adornParams({
                    catalogType:this.ruleForm.catalogType,
                })
            }).then(({data})=>{
                const blob =  new Blob([data]);
                let fileName = this.fileName + '.xls';
                if("download" in document.createElement("a")){
                    const elink = document.createElement("a")
                    elink.download = fileName;
                    elink.style.display = "none";
                    elink.href = URL.createObjectURL(blob);  // 创建下载的链接
                    document.body.appendChild(elink)
                    elink.click(); // 点击下载
                    URL.revokeObjectURL(elink.href);// 释放掉blob对象
                    document.body.removeChild(elink)// 下载完成移除元素
                }else{
                    navigator.msSaveBlob(blob,fileName)
                }
            })
        },
        //复杂查询展开事件
        handleChange(){
            this.show = !this.show
            this.columns = this.columns 
            this.data = this.output
        },
        // 页数
        handleSizeChange(val){
            this.apComServerData.size = val;
            this.apComServerData.pageIndex = 1
            this.getDataList()
        },
        //当前页
        handleCurrentChange(val){
            this.apComServerData.pageIndex = val;
            this.getDataList()
        },
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
    padding-top: 15px;
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