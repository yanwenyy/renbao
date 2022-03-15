<template>
    <div class="rule-tree-box">
        <el-input
            class="filter-text"
            placeholder="输入关键字进行过滤"
            v-if="isShowSearch"
            v-model="filterText">
        </el-input>
        <el-tree
            v-loading="treeLoading"
            ref="ruleTreeRoot"
            class="treeClass"
            :data="treeData"
            :show-checkbox="isShowCheckBox"
            default-expand-all
            :filter-node-method="filterNode"
            :props="layoutTreeProps"
            :expand-on-click-node="false"
            :check-strictly="isRelation"
            node-key="folderId"
            @check-change="callCheckChange"
            highlight-current
            @node-click="nodeClick"
            >
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span v-if="!isShowIcon" :class="isShowEdit ? 'cut-width custom-tree-label' : 'custom-tree-label' " :title="node.label">{{ node.label }}</span>
                <span v-if="isShowIcon" >
                    <span :class="isShowEdit ? 'cut-width custom-tree-label folder-icon' : 'custom-tree-label folder-icon' " ></span>
                    <span :title="node.label"> {{node.label}}</span>
                </span>
                <span class="tree-btn" v-if="isShowEdit">
                    <el-button
                        type="text"
                        size="mini"
                        @click="() => append(data,node,'add')">
                        <i class="el-icon-circle-plus-outline" title="新增"></i>
                    </el-button>
                    <el-button
                    v-if="data.folderParentId"
                    type="text"
                    size="mini"
                    @click="() => append(data,node,'edit')">
                    <i class="el-icon-edit" title="编辑"></i>
                    </el-button>
                    <el-button
                        v-if="data.folderParentId  && !data.children"
                        type="text"
                        size="mini"
                        @click="() => remove(node, data)">
                        <i class="el-icon-delete" title="删除"></i>
                    </el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog :title="treeTitle" :visible.sync="treeVisible"  :close-on-press-escape="false"  :close-on-click-modal="false">
            <el-form :model="treeForm" :rules="rulesTreeForm" ref="treeForm">
                <el-form-item label="分类名称" prop="folderName">
                    <el-input v-model="treeForm.folderName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="treeVisible = false">取 消</el-button>
                <el-button type="primary" @click="ruleSubmit('treeForm')" :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        isShowSearch: { // 是否显示规则搜索
            type: Boolean,
            default: false
        },
        isShowCheckBox: { // 是否显示多选框
            type: Boolean,
            default: false
        },
        isShowEdit: { // 规则是否可编辑
            type: Boolean,
            default: false
        },
        parentGetTreeData: { // 父组件的获取规则树id的方法名
            type: String,
            default: 'getTreeId'
        },
        parentCheckChange : {
            type: Function,
        },
        isParent: { // 判断调用组件是否为当前组件的父组件
            type: Boolean,
            default: true
        },
        isRelation: {
            type: Boolean, // 父子节点是否关联,是否单选
            default: false
        },
        folderSorts: { // 规则树查询参数
            default: ''
        },
        isShowIcon: {
            type: Boolean, // 是否显示文件夹
            default: true
        }

    },
    computed: {
      projectId: {
        get () {
          if(this.$store.state.common.projectId){
            return this.$store.state.common.projectId
          }else{
            this.$http({
              url: this.$http.adornUrl("/xmProject/selectProjectByUserId"),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 200) {
                return data.result.projectId;
              }
            });
          }

        }
      },
    },
    data () {
        return {
            filterText: '',
            treeVisible: false,
            treeTitle: '',
            treeLoading: false,
            treeForm: {
                folderName: ''
            },
            rulesTreeForm: {
                folderName: [
                    { required: true, message: '请输入分类名称', trigger: 'blur'},
                ],
            },
            treeData: [],
            layoutTreeProps: {
                label(data, node) {
                    const config = data.__config__ || data
                    return  config.label || config.folderName
                },
            },
            editRuleItem: {},
            btnLoading: false,
            optionType: 'add',
            editRuleItemNode: {},
            parentId: [],

        }
    },
    mounted () {
        this.getRuleFolder();

    },
    activated () {
        
    },
    methods: {
        // 获取规则树
        getRuleFolder (callBack) {
            this.treeLoading = true;
            this.$http({
                isLoading:false,
                url: this.$http.adornUrl('/ruleFolder/getRuleFolder'),
                method: 'get',
                params:  this.$http.adornParams({folderSorts: this.folderSorts,projectId:this.projectId}, false)
                // params:  this.$http.adornParams({}, false)
            }).then(({data}) => {
                this.treeLoading = false
                if (data.code == 200) {
                    this.treeData = data.result;
                    if (callBack) {
                        callBack(this.treeData)
                    }
                    
                    this.$emit("getTreeData", this.treeData);
                }
            }).catch(() => {
                this.treeLoading = false
            })


        },
        filterNode(value, data) {
            if (!value) return true
            return data.folderName.indexOf(value) !== -1;
        },
        ruleSubmit (formName) {
            if (this.optionType == 'add') {
                // 新增提交
                this.addRuleFolder(formName)
            } else {
                // 编辑提交
                this.editRuleFolder(formName)
            }
        },
        getParent (node, type) {
            const checkedNodes = [];
            const traverse = function(node) {
                if (node.parent.data.folderId) {
                    checkedNodes.push(node.parent.data.folderId);
                    traverse(node.parent);
                }
            };
            traverse(node)
            if (type == 'add') {
                checkedNodes.unshift(node.data.folderId)
            }
            return checkedNodes;
        },
        addRuleFolder (formName) {
            this.btnLoading = true;
            let folderPath =  this.getParent(this.editRuleItemNode, 'add');
            folderPath = folderPath.reverse()
            let addRuleFolderdata = {
                folderName: this.treeForm.folderName, // 规则树名称
                folderLevel: this.editRuleItem.folderLevel && this.editRuleItem.folderLevel || '', // 级别
                folderParentId: this.editRuleItem.folderId, // 父节点id
                folderPath: folderPath.length>0 && folderPath.join('\\') || '', // 路径  // 所有父节点的id拼接
                folderSort: this.editRuleItemNode.childNodes.length>0 ? this.editRuleItemNode.childNodes.length+1 : 1, // 顺序 // 子集长度加1
            }

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http({
                        isLoading:false,
                        url: this.$http.adornUrl('ruleFolder/add'),
                        method: 'post',
                        data:  this.$http.adornData(addRuleFolderdata, false)
                    }).then(({data}) => {
                        this.btnLoading = false;
                        if (data.code == 200) {
                            this.treeVisible = false;
                            this.getRuleFolder()
                            this.$bus.$emit('updateRuleData');
                        }
                    }).catch(() => {
                        this.btnLoading = false;
                    })
                }
            });

        },
        editRuleFolder (formName) {
            this.btnLoading = true;
            // let folderPath =  this.getParent(this.editRuleItemNode, 'edit');
            let editRuleFolderdata = {
                folderId: this.editRuleItem.folderId,
                folderName: this.treeForm.folderName, // 规则树名称
                // folderLevel: this.editRuleItem.folderLevel && this.editRuleItem.folderLevel || '', // 级别
                // folderParentId: this.editRuleItem.folderParentId, // 父节点id
                // folderPath: folderPath.length>0 && folderPath.join('\\') || '', // 路径 // 父节点id集合
                // folderSort: this.editRuleItem.folderSort, // 顺序
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http({
                        isLoading:false,
                        url: this.$http.adornUrl('ruleFolder/updateByUuId'),
                        method: 'post',
                        data:  this.$http.adornData(editRuleFolderdata, false)
                    }).then(({data}) => {
                        this.btnLoading = false;
                        if (data.code == 200) {
                            this.treeVisible = false;
                            this.getRuleFolder()
                            this.$bus.$emit('updateRuleData');
                        }
                    }).catch(() => {
                        this.btnLoading = false;
                    })
                }
            });

        },
        append (data,node, type) {
            this.treeTitle=type=='add'?'填写分类信息':'编辑分类信息';
            this.treeVisible=true;
            this.treeForm.folderName=type=='add'?'':data.folderName; // 类型名称赋值
            this.editRuleItem = data; // 获取本条数据
            this.editRuleItemNode = node; // 获取点击node
            this.optionType = type; // 编辑或新增
        },
        remove (node, data) {
            if( data.children ) return this.$message({message: '此规则不可删除',type: 'warning'});
            this.$confirm(`确认要该条规则吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$http({
                        isLoading:false,
                        url: this.$http.adornUrl(`ruleFolder/delete/${data.folderId}`),
                        method: 'post',
                    }).then(({data}) => {
                        this.btnLoading = false;
                        if (data.code == 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                            })
                            this.getRuleFolder()
                            this.$bus.$emit('updateRuleData');
                        } else {
                            this.$message.error(data.msg)

                        }
                    }).catch(() => {
                        this.btnLoading = false;
                    })

            }).catch(() => {})
        },
        nodeClick (data, node) {
            // 调用父组件的获取规则树id的方法
            if (this.isParent) {
                this.$parent[this.parentGetTreeData](data,node, this.treeData);
            } else {
                this.$emit("getTreeId", data,node, this.treeData);
            }
        },
        callCheckChange (data, checked) {
            if(this.isRelation) {
                this.$emit("checkChange", data, checked, this.treeData);
                if (checked) {
                    this.$refs.ruleTreeRoot.setCheckedNodes([data]);                  
                } else {
                    this.$refs.ruleTreeRoot.setCheckedNodes([]);
                }
            }
        },
        // 父组件通过data 设置复选框为勾选状态
        setCheckedByData (data) {
            this.$refs.ruleTreeRoot.setCheckedNodes([data]);
        },
        // 清楚选中的规则列表
        clearCheckedKeys () {
            this.$refs.ruleTreeRoot.setCheckedKeys([]);
            this.$refs.ruleTreeRoot.setCurrentKey(null);
        }

    },
    watch: {
      filterText(val) {
        this.$refs.ruleTreeRoot.filter(val.trim());
      },
      'treeVisible'(nval, oval) {
          if (!nval) {
            if (this.$refs['treeForm']) {
                this.$refs['treeForm'].resetFields()
            }
            this.treeForm.folderName = ''
          }

        },
        projectId (nval, oval) {
            if (nval) {
                this.getRuleFolder()
            }

        }

    },

}
</script>
<style scoped lang="scss">
.rule-tree-box {
    // min-width: 288px;
    /deep/ .filter-text {
        // padding: 20px !important;
        width: 80%;
        margin: 10px 0 10px 10px;
    }
    .custom-tree-label {
        max-width: 200px;
        display: inline-block;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow:ellipsis
    }
    .folder-icon {
        // backgroundImage:'url(' + data.icon + ')';
        // background: url(../images/folder.png);
        background: url(../../assets/img/folder.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: inline-block;
        width: 13px;
        height: 16px;
    }
    .cut-width {
        max-width: 100px;
    }
    /deep/ .el-tree-node__children .custom-tree-node{
        // width: 100%;
        // display: inline-block;
        // .custom-tree-label {
        //     width: 100%;
        //     display: inline-block;
        // }
    }
    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #e3edfa;

    }

}

</style>
