<template>
    <div class="batch-list-box">
         <el-tree :data="batchTreeList" highlight-current :default-expand-all="true" v-loading="batchLoading" node-key="id"      ref="batchList" :props="layoutTreeProps" @node-click="nodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span :title="node.label" class="batch-label">
                        {{node.label}}
                    </span>
                    <span class="batch-btn">
                        <el-button
                            v-if="!data.children"
                            type="text"
                            size="mini"
                            @click="() => remove(node, data)">
                            <i class="el-icon-delete" title="删除"></i>
                        </el-button>
                    </span>
                </span>
        </el-tree>
    </div>
</template>
<script>
export default {
    props: {
        batchTreeList: { // 批次列表
            default: []
        },
        isParent: { // 判断调用组件是否为当前组件的父组件
            type: Boolean,
            default: true
        },
        parentGetTreeData: { // 父组件的获取选中的批次数据的方法名
            default: 'getbatchData'
        },
        batchLoading: { // 批次列表加载状态
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            layoutTreeProps: {
                label(data, node) {
                    const config = data.__config__ || data
                    return  config.label || config.batchName
                },
            }

        }
    },
    mounted () {
        // this.getRuleFolder();
    },
    activated () {
        // this.getRuleFolder();
    },
    methods: {
        nodeClick (data, node) {
            // 调用父组件的获取规则树id的方法
            if (this.isParent) {
                this.$parent[this.parentGetTreeData](data,node);
            } else {
                this.$emit("getbatchData", data,node);
            }

        }, 
        remove (node, data) {
            console.log(data, 'datadatadata')
            this.$confirm(`确认要该条批次吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$http({
                        isLoading:false,
                        url: this.$http.adornUrl(`ruleFolder/delete/${data.folderId}`),
                        method: 'post',
                    }).then(({data}) => {
                      
                        if (data.code == 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                            })
                            // 更新批次列表
                            this.$emit('refreshBitchData');
                        } else {
                            this.$message.error(data.msg)

                        }
                    }).catch(() => {
                    })

            }).catch(() => {})




        }
    },

}
</script>
<style scoped lang="scss">
.batch-list-box {
    width: 100%;
    /deep/ .el-tree {
        min-height: 60vh;
        // color: #AF0F16 !important;
    }
    /deep/ .el-tree-node__children .custom-tree-node{
        // text-decoration: underline;
        // color: #0000FF;
        // color: #AF0F16 !important;
        width: 100%;
        padding: 0 5px;
        display: inline-block;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow:ellipsis;
    }
    /deep/ .is-current {
        display: flex;
        align-items: center;
    }
    /deep/ .el-tree-node {
        height: 35px;
        line-height: 35px;
    }
    /deep/ .is-current {
        position: relative;
    }
    /deep/ .is-current::before {
        position: absolute;
        content: '';
        width: 2px;
        height: 35px;
        display: inline-block;
        background: #AF0F16;
        color:#AF0F16;
        margin-left: 3px;
        
    }
    .batch-label {
        // padding-left: 2px;
    }
    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        // background-color: #e3edfa;
        color: #AF0F16 !important;
        background: #fff !important;
    }
    /deep/ .el-tree-node__content:hover{
        background: #fff;
    }
  
}

</style>
