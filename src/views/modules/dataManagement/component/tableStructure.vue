<template>
    <div class='tableStructure'>
        <el-form ref='dataForm' :model="dataForm" :rules="rules" @keyup.enter.native="getDataList()" label-width="80px">
            <el-form-item label="表名：" prop="tableName">
                <el-input v-model="dataForm.tableName"></el-input>
            </el-form-item>
            <el-form-item label="规划库：" prop="tableLibrary">
                <el-input v-model="dataForm.tableLibrary"></el-input>
            </el-form-item>
            <el-form-item label="说明：" prop="remark">
                <el-input type="textarea" v-model="dataForm.tableName"></el-input>
            </el-form-item>
            <el-table :data='dataForm.datas' border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" style="width: 100%;">
                <el-table-column  type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="tableName" align="center" label="字段名"></el-table-column>
                <el-table-column prop="spaceSize" align="center" label="类型"></el-table-column>
                <el-table-column prop="createTime" align="center" label="长度"></el-table-column>
                <el-table-column prop="id" label="允许为空"/>
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
        </el-form>
       <div class="itemBtn">
            <el-button type="primary" @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'tableStructure',
    data(){
        return{
            visible: false,
            dataForm:{
                tableName:'',
                tableLibrary:'',
                tableName:'',
                datas:[]
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
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
            }
        }
    },
    methods:{
        close(){
                this.$emit('close')
        },
         // 每页数
        handleSizeChange (val) {
            this.pageSize = val
            this.currentPage = 1
         
        },
        // 当前页
        handleCurrentChange (val) {
            this.currentPage = val
        },
    }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
    margin-top: 10px;
}
</style>