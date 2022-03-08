<!-- 数据表管理 -->
<template>
    <div class='dataSheet'>
        <el-row :gutter="20">
            <el-col :span="5">
                <el-card v-loading="treeLoading" style="height:500px;overflow-y:auto">
                    <div style='padding:5px'><el-input placeholder="请输入内容" v-model="filterText" class="input-with-select" icon="el-icon-search"></el-input></div>
                    <el-tree :data="datatree" :props="defaultProps"  node-key="id" default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick" ></el-tree>
                </el-card>
            </el-col>
            <el-col :span="19">
                <div>
                    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
                        <el-form-item label="表名:">
                            <el-input v-model="dataForm.tableName" placeholder="请输入搜索内容" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="数据库:">
                            <el-input v-model="dataForm.database" placeholder="请输入搜索内容" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getSearchList()">查询</el-button>
                            <el-button>重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
                        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                        <el-table-column prop="tableName" align="center" label="表名"></el-table-column>
                        <el-table-column prop="spaceSize" align="center" label="占用空间大小"></el-table-column>
                        <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
                        <el-table-column prop="updateTime" align="center" label="更新时间"></el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button size="small" type="text" @click="getTableStructure(scope.row)">查看表结构</el-button>
                                <el-button size="small" type="text" @click="getTableData(scope.row)">查看表数据</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                     <!-- 分页 -->
                   <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="StructureDialog" title="查看表结构" :close-on-click-modal="false" :modal-append-to-body="false" :close-on-press-escape="false">
            <TableStructure v-if="StructureDialog" @close="closeStructureDrawer"  @ok="StructureSucceed"></TableStructure>
        </el-dialog>
         <el-dialog :title="Title" :visible.sync="tableDataVisible">
            <el-table :data="tableList"  border style="100%" height="calc(100vh - 280px)" :header-cell-style="{textAlign:'center'}" class="demo-ruleForm">
                <template v-for="(item,index) in tableColumns">
                    <el-table-column :prop="item" :label="item" :key="index" width show-overflow-tooltip></el-table-column>
                </template>
            </el-table>
            <div class="itemBtn" slot="footer">
                <el-button type="primary" @click="tableDataVisible = false">关闭</el-button>
            </div>
         </el-dialog>
    </div>
</template>
<script>
import TableStructure from './component/tableStructure.vue'
export default {
    components:{
        TableStructure
    },
    data(){
        return{
            filterText:'',
            dataForm:{
                tableName:'',
                database:''
            },
            Title:'住院结算明细',
            tableList:[{'结算单据号':'14767','个人编码':'121468','住院号':'507065','医疗机构编码':'62311839861040211A1001','费用类别':'治疗费','项目使用时间':'20210421', '执行科室编码':'ZY007','执行科室名称':'儿科五病区','医保项目编码':'100000331','医保项目名称':'Ⅱ级护理',
                        '医院项目编码':'WFY000001',
                        '医院项目名称':'无费用',
                        '规格':'',
                        '剂型':'',
                        '最小包装单位':'',
                        '单价':'0',
                        '数量':'1',
                        '总发生金额':'0',
                        '医保申请金额':'0',
                        '拒付金额':'',
                        '拒付理由':'',
                        '出院带药标识':'N',
                        '退费标识':'0',
                        '退费时间':'',
                        '支付类别':'',
                        '报销比例':''}],
            tableColumns:['结算单据号',
                        '个人编码',
                        '住院号',
                        '医疗机构编码',
                        '费用类别',
                        '项目使用时间',
                        '执行科室编码',
                        '执行科室名称',
                        '医保项目编码',
                        '医保项目名称',
                        '医院项目编码',
                        '医院项目名称',
                        '规格',
                        '剂型',
                        '最小包装单位',
                        '单价',
                        '数量',
                        '总发生金额',
                        '医保申请金额',
                        '拒付金额',
                        '拒付理由',
                        '出院带药标识',
                        '退费标识',
                        '退费时间',
                        '支付类别',
                        '报销比例'],
            dataList:[{
                'id':'0',
                'tableName':'病案首页',
                'spaceSize':'500M',
                'createTime':'2022-2-16',
                'updateTime':'2022-2-17',
            },{
                'id':'1',
                'tableName':'医疗机构信息',
                'spaceSize':'1G',
                'createTime':'2022-2-16',
                'updateTime':'2022-2-17',
            },{
                'id':'2',
                'tableName':'转诊备案信息',
                'spaceSize':'1G',
                'createTime':'2022-2-16',
                'updateTime':'2022-2-17',
            }],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            datatree:[{
                id: 1,
                label: '规划库',
                children: [{
                    id: 4,
                    label: '呼和浩特市医疗保障局2021年“打击欺诈骗保”全覆盖_规划库',
                    children: [{
                    id: 9,
                    label: '病案首页'
                    }, {
                    id: 10,
                    label: '医疗机构信息'
                    }]
                },{
                    id: 2,
                    label: '通辽市医疗保障局全覆盖_规划库',
                },{
                    id: 3,
                    label: '新疆自治区医保基金监管飞行检查项目_规划库',
                }]
            }],
            defaultProps:{ children:'children',label:'label' },
            StructureDialog:false,
            tableDataVisible:false,
            treeLoading:false,
            dataListLoading:false
        }
    },
    mounted() {
        this.initData()
    },
    methods:{
        //初始化tree
        initData(){},
        //查询
        getSearchList(){},
        //表结构
        getTableStructure(){
            this.StructureDialog = true
        },
        //表数据
        getTableData(){
            this.tableDataVisible = true
        },
         // 每页数
        handleSizeChange (val) {
            this.pageSize = val
            this.currentPage = 1
            this.getAllList()
         
        },
        // 当前页
        handleCurrentChange (val) {
            this.currentPage = val
            this.getAllList()
        },
        //查看表明事件
        ledgerTable(){

        },
        // 关闭弹窗确认
        StructureSucceed(){
            this.closeStructureDrawer()
        },
        closeStructureDrawer(){
             this.StructureDialog = false
        },
        //弹框关闭
        closeClick(){
            this.$emit('close')
        },
        //tree点击事件
        handleNodeClick(data,node){
             console.log(data)
             this.getAllList()
        },
        // 获取列表
        getAllList(){

        }
    }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
}
</style>