<template>
    <div class="rule-tree-box">
        <el-input
            class="filter-text"
            placeholder="输入关键字进行过滤"
            v-if="isShowSearch"
            v-model="filterText">
        </el-input>
        <el-tree
            ref="ruleTree"
            class="treeClass"
            :data="treeData"
            :show-checkbox="isShowCheckBox"
            node-key="id"
            default-expand-all
            :filter-node-method="filterNode"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span class="tree-btn" v-if="isShowEdit">
                <el-button
                    type="text"
                    size="mini"
                    @click="() => append(data,'add')">
                    <i class="el-icon-circle-plus-outline" title="新增"></i>
                </el-button>
                    <el-button
                    type="text"
                    size="mini"
                    @click="() => append(data,'edit')">
                    <i class="el-icon-edit" title="编辑"></i>
                </el-button>
                <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)">
                    <i class="el-icon-delete" title="删除"></i>
                </el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog :title="treeTitle" :visible.sync="treeVisible">
            <el-form :model="treeForm">
                <el-form-item label="分类名称">
                    <el-input v-model="treeForm.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="treeVisible = false">取 消</el-button>
                <el-button type="primary" @click="treeVisible = false">确 定</el-button>
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
        treeData: { // 规则数数据
            type: Array,
        },
        isShowCheckBox: { // 是否显示多选框
            type: Boolean,
            default: false
        },
        isShowEdit: { // 规则是否可编辑
            type: Boolean,
            default: false
        }

    },
    data () {
        return {
            filterText: '',
            treeVisible: false,
            treeTitle: '',
            treeForm: {
                name: ''
            }
        }
    },
    mounted () {

    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        append (data, type) {
            this.treeTitle=type=='add'?'填写分类信息':'编辑分类信息';
            this.treeVisible=true;
            this.treeForm.name=type=='add'?'':data.label;
        },
        remove (node, data) {

        }

    },
    
}
</script>
<style scoped lang="scss">
.rule-tree-box {
    /deep/ .filter-text {
        // padding: 20px !important;
        width: 80%;
        margin: 10px 0 10px 10px;
    }

}

</style>
