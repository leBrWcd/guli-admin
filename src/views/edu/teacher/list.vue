<template>
  <div class="app-container">

      
    <!-- 条件查询表单组件 -->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>

        <el-input v-model="teacherQuery.name" placeholder="讲师名"/>

      </el-form-item>

      <el-form-item>

        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
        
      </el-form-item>

      <el-form-item label="添加时间">

        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"

        />
      </el-form-item>

      <el-form-item>

        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />

      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>

      <el-button type="default" @click="resetData()">清空</el-button>

    </el-form>


     <!-- 表格 -->
    <el-table
      
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页组件 -->
    <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"

    />

  </div>

</template>

<script>

//.js后缀可省
import teacher from '@/api/edu/teacher'

export default {

    //写核心代码位置，例如发送axios，但是不用我们写，我们只需要调用teacher.js中的方法
    data(){
        //定义变量和初始化
        return{
            page : 1,  //当前页
            limit : 5,  //每页记录数
            total : 0,  //总记录
            list : null, //查询完封装的list对象
            teacherQuery :{} //查询条件封装对象
        }
    },
    created(){
        //调用methods中的方法，在页面渲染之前执行
        this.getList()
    },
    methods:{
        //默认第一页，如果点了第二页，page = 2
        getList(page = 1){
            this.page = page
            teacher.getTeacherList(this.page,this.limit,this.teacherQuery)
                .then(response =>{ //请求成功
                    this.list = response.data.raws
                    this.total = response.data.total
                })
                .catch(error =>{ //请求失败
                    console.log(error)
                })
        },
        resetData(){
            //清空查询条件
            this.teacherQuery = {}
            //查询所有
            this.getList()
        },
        
        removeDataById(id){
            this.$confirm('确定删除该讲师信息吗?','提示',{
                confirmButtonText:'确定',
                concelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                //点击确定,调用删除的方法
                teacher.deleteTeacherById(id)
                    .then(response =>{
                        //删除成功，提示信息
                        this.$message({
                            type:'success',
                            message:'删除成功!'
                        });
                        //刷新列表
                        this.getList()
                    })
                    .catch(error=>{
                        console.log(error)
                    })
            })
        }
    }
    
}
</script>