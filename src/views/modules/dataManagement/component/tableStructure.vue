<template>
    <div class='tableStructure'>
        <el-form ref='dataForm' :model="dataForm" :rules="rules" v-loading="dataListLoading" label-width="80px">
            <el-form-item label="表名：" prop="tableName">
                <el-input v-model="dataForm.tableName"></el-input>
            </el-form-item>
            <el-form-item label="规划库：" prop="tableLibrary">
                <el-input v-model="dataForm.tableLibrary"></el-input>
            </el-form-item>
            <el-form-item label="说明：" prop="remark">
                <el-input type="textarea" v-model="dataForm.explain"></el-input>
            </el-form-item>
            <el-table :data='dataForm.datas' border height='300' :header-cell-style="{textAlign:'center'}" style="100%;">
                <el-table-column  type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="columnName" align="center" label="字段名"></el-table-column>
                <el-table-column prop="dataType" align="center" label="类型"></el-table-column>
                <el-table-column prop="dataLength" align="center" label="长度"></el-table-column>
                <el-table-column prop="nullable" label="允许为空">
                    <template slot-scope="scope">
                        <div class="tac" v-if="scope.row.nullable=='Y'">允许</div>
                        <div class="tac" v-if="scope.row.nullable=='X'">不允许</div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="apComServerData.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="apComServerData.size"
            :total="apComServerData.total"
            layout="total, sizes, prev, pager, next, jumper">
            </el-pagination> -->
        </el-form>
    </div>
</template>
<script>
export default {
    name:'tableStructure',
    props:{
        structureList:{
            type: Object,
        },
        structureName:{
            type: String,
        }
    },
    data(){
        return{
            visible: false,
            dataForm:{
                tableName:'',
                tableLibrary:'',
                explain:'',
                datas:[]
            },
            apComServerData:{
                current: 1,
                size: 10,
                pageNum:1,
                total:0,
                pageIndex:1,
            },
            //表单验证规则
            rules:{
                tableName:[{
                    type: "string",
                    required: true,
                    trigger: "blur",
                }],
                tableLibrary:[{
                    type: "string",
                    required: true,
                    trigger: "blur",
                }],
            },
            dataListLoading:false
        }
    },
    mounted(){
        this.getDataList()
        this.dataForm.tableName = this.structureName
        this.dataForm.tableLibrary = this.structureList.projectName
    },
    methods:{
        //初始化数据
        getDataList(){
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl("/prjBusDatabaseRelation/getTableStruct"),
                method: "get",
                params: this.$http.adornParams({
                    'projectId':this.structureList.projectId,
                    'tableName':this.structureName,
                })
            }).then(({data}) =>{
                if(data && data.code === 200){
                    this.dataForm.datas = data.result
                }else{
                    this.dataForm.datas = [];
                }
                this.dataListLoading = false;
            })
        },
        close(){
                this.$emit('close')
        },
         // 每页数
        handleSizeChange (val) {
            this.apComServerData.size = val;
            this.apComServerData.pageIndex = 1
            this.getDataList()
        },
        // 当前页
        handleCurrentChange (val) {
            this.apComServerData.pageIndex = val;
            this.getDataList()
        },
    }
}
</script>
<style lang="scss" scoped>
</style>