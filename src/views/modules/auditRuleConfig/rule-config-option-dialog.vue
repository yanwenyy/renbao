<template>
    <div class="detail-box">
        <el-drawer
            ref="ruleConfigOptionDialog"
            :visible.sync="dialogVisible"
            :direction="direction"
            :close-on-press-escape="false"
            :before-close="handleClose">
            <div class="rule-operation">
                <el-form size="small" ref="ruleOperationForm" :model="ruleOperationForm" :rules="ruleOperationFormRules" label-width="130px" style="text-align: left" class="rule-form-inline">
                    <el-form-item 
                        label="规则名称"
                        prop="ruleName"
                    >
                        <el-input class="size"  v-model="ruleOperationForm.ruleName" autocomplete="off" clearable></el-input>
                    </el-form-item>
                  
                    <el-form-item label="规则类别：" prop="ruleCategory">
                        <el-select v-model="ruleOperationForm.ruleCategory"  placeholder="请选择" clearable>
                            <el-option label="门诊审核规则" :value=1></el-option>
                            <el-option label="住院审核规则" :value=2></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则：" prop="folderName">
                        <el-select v-model="ruleOperationForm.folderName" placeholder="请选择" multiple collapse-tags>
                            <el-option :value="ruleOperationForm.folderName" style="height: auto">
                                <el-tree :data="treeData" default-expand-all show-checkbox check-strictly 
                                    ref="treeSelect" highlight-current :props="layoutTreeProps" node-key="folderId"
                                    @check-change="handleCheckChange" @node-click="handleNodeChange"></el-tree>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item 
                        label="规则名称"
                        prop="ruleName"
                    >
                        <el-input class="size"  v-model="ruleOperationForm.ruleName" autocomplete="off" clearable></el-input>
                    </el-form-item> -->
                    <el-form-item label="创建人：" prop="username">
                        <el-input class="size"  v-model="username" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间：" prop="createTime">
                        <el-input class="size" v-model="ruleOperationForm.createTime" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                       <el-button type="primary" @click="onSubmit('ruleOperationForm')" :loading="loading" size="small">确 定</el-button>
                        <el-button @click="cancel" size="small">取 消</el-button>
                    </el-form-item>
                   
                   
                </el-form>
                
            </div>
        </el-drawer>
       
    </div>
</template>
<script>
import {getDate} from '@/utils'
export default {
    props: [
        'getData'
    ],
    data() {
        return {
            type: '',
            loading: false,
            dialogVisible: false,
            direction: 'rtl',
            ruleOperationForm: {
                ruleName: '',
                ruleCategory: '',
                folderId: '',
                createUserName: '',
                createTime: '',
                folderName: '',
                folderPath: '',
                ruleId: '',
                username: ''
            },
            ruleOperationFormRules: {
                ruleName: [
                    { required: true, message: '请输入规则名称'},
                ],
                ruleCategory: [
                    { required: true, message: '请选择规则类别'},
                ],
                // folderName: [
                //     { required: true, message: '请选择规则类别'},
                // ],
                username: [
                    { required: true, message: '请输入创建人'},
                ],
                createTime: [
                    { required: true, message: '请输入创建时间'},
                ]

            },
            type: '',
            checkedData: [],
            treeData: [],
            layoutTreeProps: {
                label(data, node) {
                    const config = data.__config__ || data
                    return  config.label || config.folderName
                },
            },
        }
    },
    mounted () {
    },
    methods: {
        //默认打开页面
        showDialog(d, treeData, type) {
            this.reset();
            this.checkedData = d;
            this.type = type; // 新建、编辑
            this.getRuleFolder((treeData) => {
                if (this.checkedData.length>0) {
                    let getTreeData = this.getTreeData(treeData, this.checkedData[0].folderId); // 递归获取对应的规则对象
                    this.ruleOperationForm.ruleName = this.checkedData[0].ruleName;
                    this.ruleOperationForm.ruleCategory = this.checkedData[0].ruleCategory == '住院规则'?2 : this.checkedData[0].ruleCategory == '门诊规则' ? 1 : '' ;
                    this.ruleOperationForm.ruleId = this.checkedData[0].ruleId;
                    this.ruleOperationForm.folderId = this.checkedData[0].folderId;
                    // 回显规则名称
                    if (getTreeData.length>0) {
                        this.ruleOperationForm.folderName = [getTreeData[0].folderName];
                        this.ruleOperationForm.folderPath = this.getParentByData(treeData,getTreeData[0].folderId )
                        this.$nextTick(() => {
                            this.$refs.treeSelect.setCheckedNodes(getTreeData);
                        })
                    }
                }

            });// 获取规则树
            this.dialogVisible = true;
            this.ruleOperationForm.createTime = getDate(); // 回显创建时间
            this.ruleOperationForm.createUserName = this.username; // 回显创建人
            this.ruleOperationForm.username = this.username; // 回显创建人

        },
        // 获取规则树
        getRuleFolder (callBack) {
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl('/ruleFolder/getRuleFolder'),
                method: 'get',
                params:  this.$http.adornParams({folderSorts: '3'}, false)
            }).then(({data}) => {
                if (data.code == 200) { 
                    this.treeData = data.result;
                    callBack(this.treeData)
                }
            }).catch(() => {
                
            })

        },
        getTreeData (treeData,folderId) {
            const getTreeDataItem = [];
            const traverse = function(treeData,folderId) {
                treeData.map(i => {
                    if (i.folderId == folderId) {
                        getTreeDataItem.push(i);
                    }
                    if (i.children) {
                        traverse(i.children, folderId);

                    }
                })

            }
            traverse(treeData,folderId)
            return getTreeDataItem
        },
        getParentByNode (node) {
            const checkedNodes = [];
            const traverse = function(node) {
                if (node.parent.data.folderId) {
                    checkedNodes.push(node.parent.data.folderId);
                    traverse(node.parent);
                }
            };
            traverse(node)
            return checkedNodes.join('/');
        },
        getParentByData (ruleTreeData1,folderId) {
                var temp = []
                var forFn = function (ruleTreeData, folderId) {
                    for (var i = 0; i < ruleTreeData.length; i++) {
                    var item = ruleTreeData[i]
                    if (item.folderId === folderId) {
                        temp.push(item.folderId)
                        forFn(ruleTreeData1, item.folderParentId)
                        break
                    } else {
                        if (item.children) {
                        forFn(item.children, folderId)
                        }
                    }
                    }
                }
                forFn(ruleTreeData1, folderId)
                temp.remove(folderId);
                return temp.join('/');
        },
        handleNodeChange (data, node , selt) {
            this.$refs.treeSelect.setCheckedNodes([data]);
            this.ruleOperationForm.folderName = [data.folderName];
            this.ruleOperationForm.folderId =  data.folderId;
            this.ruleOperationForm.folderPath =  this.getParentByNode(node);
        },
        handleCheckChange(data, checked, node) {

            let res = this.$refs.treeSelect.getCheckedNodes(false, true); //true，1. 是否只是叶子节点 2.选择的时候不包含父节点）
            if (checked) {
                this.$refs.treeSelect.setCheckedNodes([data]);
            }
            let arrLabel = [];
            res.forEach(item => {
                if (arrLabel.length === 0) {
                    arrLabel.push(item);
                } else {
                    arrLabel.length === 0;
                }
            });
            
            if (arrLabel.length>0) {
                this.ruleOperationForm.folderName = [arrLabel[0].folderName];
                this.ruleOperationForm.folderId =  arrLabel[0].folderId;
                this.ruleOperationForm.folderPath =  this.getParentByData(this.treeData,data.folderId )
            } else {
                this.ruleOperationForm.folderName = [];
                this.ruleOperationForm.folderId =  '';
                this.ruleOperationForm.folderPath =  ''
            }
        },
        handleClose () {
            this.resetForm();
            this.reset();
            // this.$refs.treeSelect.setCheckedKeys([])
            this.dialogVisible = false

        },
        onSubmit (formName) {
            let ruleUrl = ''
            if (this.type == 'add') {
                ruleUrl = '/rule/add'
            } else {
                ruleUrl = '/rule/updateByUuId'
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$http({
                        isLoading:false,
                        url: this.$http.adornUrl(ruleUrl),
                        method: 'post',
                        data:  this.$http.adornData(this.ruleOperationForm, false)
                    }).then(({data}) => {
                        // this.btnLoading = false;
                        if (data.code == 200) {
                            this.loading = false
                            this.$message({
                                message: this.type == 'add' ?'添加成功' : '编辑成功',
                                type: 'success',
                                duration: 1500,
                            })
                            this.dialogVisible = false;
                            this.$parent.getSelectPage();
                            this.$parent.setTableChecked()
                        } else {
                            this.loading = false
                            this.$message({
                                message: this.type == 'add' ?'添加失败' : '编辑失败',
                                type: 'error',
                                duration: 1500,
                            })
                             this.dialogVisible = false;

                        }
                    }).catch(() => {
                        this.loading = false
                    })  



                }
            })   
        },
        cancel () {
            this.resetForm();
            this.reset();
            this.dialogVisible = false;
           
        },
        resetForm(formName) {
            this.$refs['ruleOperationForm'].resetFields();
        },
        reset () {
            this.ruleOperationForm = {
                ruleName: '',
                ruleCategory: '',
                folderId: '',
                createUserName: '',
                createTime: '',
                folderName: '',
                folderPath: '',
                ruleId: ''
            };
        },
    },
    computed: {
        username: {
            get () { return this.$store.state.user.name }
        },
      
     },
    
    components: {
        
        
    },
    watch : {
    }
}
</script>

<style scoped lang="scss">
.detail-box {
    /deep/ .el-dialog__header {
        border-bottom: 1px solid #ddd;
        text-align: left;
    }
    /deep/ .el-dialog__footer {
        text-align: center;
    }
    .rule-tree-box {
        display: flex;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    .rule-form-inline {
        /deep/ .el-textarea{
            width: 350px;
        }
        /deep/ .el-input{
            width: 280px;
        }

    }
}
</style>