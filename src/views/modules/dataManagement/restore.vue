<template>
    <div class='restore'>
        <el-row :gutter="20">
            <el-col :span="24">
                <div class="title">项目详情</div>
                <div class="restore_outer" style="padding:30px;">
                    <div class="restore_content">
                        <span class="restore-label">项目编号:</span>
                        <span>{{dataForm.projectCode}}</span>
                    </div>
                    <div class="restore_content">
                        <span class="restore-label">项目名称:</span>
                        <span>{{dataForm.projectCodeName}}</span>
                    </div>
                    <div class="restore_content">
                        <span class="restore-label">项目周期:</span>
                        <span>{{dataForm.projectCircle}}</span>
                    </div>
                    <div class="restore_content">
                        <span class="restore-label">被审核单位:</span>
                        <span>{{dataForm.company}}</span>
                    </div>
                    <div class="restore_content">
                        <span class="restore-label">项目成本:</span>
                        <div style="width:50%;padding:10px"> 
                            <el-table :data="tableData" border class="demo-ruleForm" v-loading="listLoading">
                                <el-table-column prop="templateName" align="center" label="人员成本（元/天）"></el-table-column>
                                <el-table-column prop="Uploadtime" align="center" label="费用成本（元/天）"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div style="width:80%;padding:10px">
                        <div style='background-color:#eef1f6;color:#606266;line-height: 30px;padding: 5px;'>项目成员信息</div>
                        <el-table :data="tableData1" border style="100%" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" class="demo-ruleForm" v-loading="listLoading">
                            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                            <el-table-column prop="role" align="center" label="角色"></el-table-column>
                            <el-table-column prop="personnel" align="center" label="人员"></el-table-column>
                        </el-table>
                    </div>
                     <div style="width:80%;padding:10px">
                        <div style='background-color:#eef1f6;color:#606266;line-height: 30px;padding: 5px;'>小组维护</div>
                        <el-table :data="tableData2" border style="100%" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" class="demo-ruleForm" v-loading="listLoading">
                            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
                            <el-table-column prop="role" align="center" label="小组名称"></el-table-column>
                            <el-table-column prop="personnel" align="center" label="小组组长"></el-table-column>
                            <el-table-column prop="personnel" align="center" label="小组人员"></el-table-column>
                        </el-table>
                    </div>
                    <div class="restore_content">
                        <span class="restore-label">描述:</span>
                        <div style="width:50%;padding:10px">
                            <el-input type="textarea" placeholder="请输入内容" v-model="remaks">{{dataForm.remaks}}</el-input>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer" style='text-align:center'>
                        <el-button type="primary" @click="examine()">备份</el-button>
                        <el-button type="primary" @click="restoreClick()">还原</el-button>
                        <el-button @click="close">关闭</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="还原" :visible.sync="ShowAddVisible">
            <el-form :model="addMemberForm" ref="addMemberForm" label-width="150px">
                <el-form-item label="请选择该项目备份">
                    <el-input class="input-hasBtn" v-model="addMemberForm.dataAmount" placeholder="选择" style="width:75%"></el-input>
                    <el-button type="primary" @click="chooseListVisible=true" style="margin-left:10px">选择</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ShowAddVisible = false">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
        </el-dialog>
         <el-dialog title="项目备份列表" :visible.sync="chooseListVisible" :close-on-click-modal="false" width="60%" :modal-append-to-body="false">
            <backUpList  v-if="chooseListVisible" @close="closeChooseDrawer" @ok="ChooseSucceed">></backUpList>
         </el-dialog>
    </div>
</template>
<script>
import backUpList from './component/backUpList.vue'
export default {
    name:'restore',
    components:{
        backUpList
    },
    data(){
        return{
            remaks:'',
           dataForm:{
               id:"0",
               projectCode:'MKOP-001',
               projectCodeName:'呼和浩特市医疗保障局2021年“打击欺诈骗保”全覆盖',
               projectCircle:'2021/2/1 - 2021/3/1',
               company:'呼和浩特市医疗保障局',
               remaks:''
           },
           addMemberForm:{
               dataAmount:''
           },
           tableData:[{
               'id':'0',
               'templateName':'10000',
               'Uploadtime':'100000'
           },{
               'id':'1',
               'templateName':'10000',
               'Uploadtime':'100000'
           }],
           tableData1:[],
           tableData2:[],
           listLoading:false,
           chooseListVisible:false,//备份列表弹框
           ShowAddVisible:false,
        }
    },

    methods:{
        //还原
        restoreClick(){
            this.ShowAddVisible = true
        },
        //备份
        examine(){
            this.$confirm('是否确认将所选项目备份?','提示',{
                confirmButtonText:'确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '备份成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消备份'
                });
            })
        },
        //关闭
        close(){},
        dataFormSubmit(){},
        //关闭弹框
        ChooseSucceed(){
            this.closeChooseDrawer()
        },
        closeChooseDrawer(){
            this.chooseListVisible = false
        }
    }
}
</script>
<style lang="scss" scoped>
  .title {
    width: 100%;
    height: auto;
    font-family: 黑体;
    font-size: 16pt;
    font-weight: 600;
  }
  .content{
      width: 100%;
    height: auto;
    font-size: 18pt;
  }
.restore_content{
    padding-bottom: 12px;
    .restore-label{
        margin-right: 10px;
    }
}

</style>