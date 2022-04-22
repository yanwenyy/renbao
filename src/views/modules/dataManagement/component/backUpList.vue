<template>
    <div class='backUpList'>
        <el-row style="font-weight:700">数据文件路径：<span style="color:red">{{sysPath}}</span></el-row>
        <!-- 文件树 -->
        <el-row :gutter="6" >
            <el-col :span="12" style="height:42vh; overflow:auto;">
                <el-row>请选择导入文件:</el-row>
                <el-table
                        ref="fileTree"
                        v-loading="fileTreeLoading"
                        stripe
                        fit
                        :data="fileTreeData"
                        border
                        highlight-current-row
                        lazy
                        row-key="path"
                        @select="selectFiles"
                        @select-all="selectAllFiles"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column
                            type="selection"
                            align="center"
                    />
                    <el-table-column
                            label="目录名称"
                            align="left"
                            prop="name"
                    />
                    <el-table-column
                            label="文件类型"
                            align="center"
                            prop="fileType"
                    />
                    <el-table-column
                            label="文件大小"
                            align="center"
                            prop="sizeString"
                    />
                </el-table>
            </el-col>
            <!-- 已选择文件 -->
            <el-col :span="12" style="height:42vh; overflow:auto;">
                <el-row>已选文件:</el-row>
                <el-table
                        title="已选文件"
                        v-loading="fileTreeLoading"
                        stripe
                        fit
                        :data="selectedFileData"
                        border
                        highlight-current-row
                >
                    <el-table-column
                            label="目录名称"
                            align="left"
                            prop="name"
                    />
                    <el-table-column
                            label="文件类型"
                            align="center"
                            prop="fileType"
                    />
                    <el-table-column
                            label="文件大小"
                            align="center"
                            prop="sizeString"
                    />
                </el-table>
            </el-col>
        </el-row>
        <div class="itemBtn">
            <el-button type="primary" @click="restoreClick">还原</el-button>
            <el-button @click="close">关闭</el-button>
        </div>

    </div>

</template>
<script>
export default {
    name:'backUpList',
    data(){
        return{
            tableList:[],
            dataListSelections: [],
            // 文件树加载
            fileTreeLoading: false,
            // 被选中的文件
            selectedFileData: [],
            // 文件树
            fileTreeData: [],
            // 系统文件路径
            sysPath: '',
        }
    },
    mounted(){
        this.getInitList()
        this.getFileTree()
    },
    methods:{
        getInitList(){
            this.$http({
                url: this.$http.adornUrl('xmProject/projectList'),
                method: 'get',
                }).then(({data}) => {
                if (data && data.code === 200) {
                    this.tableList = data.result
                } else {
                    this.tableList = []
                }
                })
        },
        // 获取备份数据文件树
        getFileTree () {
          this.fileTreeData = []
          this.selectedFileData = []
          // this.fileTreeDialogVisible = true
          this.fileTreeLoading = true
          this.$http({
            url: this.$http.adornUrl(`dataBackupInfo/getFilePath/${2}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 200) {
              // 获取文件数据
              this.fileTreeData = data.result.fileTree
              // 获取系统地址
              this.sysPath = data.result.sysPath
            }
          })
          this.fileTreeLoading = false
        },
        setChildren (children, type) {
            // 编辑多个子层级
            children.map((j) => {
                this.toggleSelection(j, type)
                if (j.children) {
                    this.setChildren(j.children, type)
                }
            })
        },
        // 选中父节点时，子节点一起选中取消
        selectFiles (selection, row) {
            if (
                selection.some((el) => {
                    return row.path === el.path
                })
            ) {
                if (row.children) {
                    // 解决子组件没有被勾选到
                    this.setChildren(row.children, true)
                }
            } else {
                if (row.children) {
                    this.setChildren(row.children, false)
                }
            }
        },
        // 选择全部
        selectAllFiles (selection) {
            // tabledata第一层只要有在selection里面就是全选
            const isSelect = selection.some((el) => {
                const treePaths = this.fileTreeData.map((j) => j.path)
                return treePaths.includes(el.path)
            })
            // tableDate第一层只要有不在selection里面就是全不选
            const isCancel = !this.fileTreeData.every((el) => {
                const selectPaths = selection.map((j) => j.path)
                return selectPaths.includes(el.path)
            })
            if (isSelect) {
                selection.map((el) => {
                    if (el.children) {
                        // 解决子组件没有被勾选到
                        this.setChildren(el.children, true)
                    }
                })
            }
            if (isCancel) {
                this.fileTreeData.map((el) => {
                    if (el.children) {
                        // 解决子组件没有被勾选到
                        this.setChildren(el.children, false)
                    }
                })
            }
            this.$emit('handleSelect', this.fileTreeData)
        },
        // 选中文件
        handleSelectionChange (val) {
            this.selectedFileData = []
            this.fileSelections = val
            this.fileSelections.forEach(item => {
                // 去除选中的文件夹
                if (!item.ifDir) {
                    this.selectedFileData.push(item)
                }
            })
        },
        //关闭
        close(){
          this.$emit('close')
        },
        // 多选
        selectionChangeHandle (val) {
            this.dataListSelections = val
        },
        //还原
        restoreClick(){
            console.log(this.dataListSelections)
            console.log(this.selectedFileData)
            // console.log(this.sysPath+"\\"+this.selectedFileData[0].name)
            if(this.selectedFileData.length == 0 || this.selectedFileData.length > 1){
                this.$confirm('请勾选一条数据', '信息', {
                    confirmButtonText: '关闭',
                    type: 'warning',
                }).then(() =>{

                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消',
                    })
                })
            }else{
                this.$emit('satDatalist',this.selectedFileData); // 回显医院名称
                this.$emit('close')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.itemBtn{
    text-align: center;
    margin-top: 10px;
}
</style>
