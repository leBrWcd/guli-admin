<template>
  <div class="app-container">

    <!-- 条件查询表单组件 -->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>

        <el-input v-model="courseQuery.title" placeholder="课程名称"/>

      </el-form-item>


      <el-form-item>

        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option :value="'Draft'" label="未发布"/>
          <el-option :value="'Normal'" label="已发布"/>
        </el-select>
        
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

      <el-table-column prop="title" label="课程名称" width="160" align="center"/>

      <el-table-column label="课程状态" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.status==="Normal"?'已发布':'未发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="添加时间" width="190" align="center"/>

      <el-table-column prop="lessonNum" label="课时数" width="110" align="center"/>

     <el-table-column prop="price" label="课程价格" width="110" align="center"/>

     <el-table-column prop="buyCount" label="购买数量" width="110" align="center"/>

    <el-table-column prop="viewCount" label="浏览数量" width="110" align="center"/>

      

      <el-table-column label="操作" width="200" align="center">

        <template slot-scope="scope">


          <router-link :to="'/edu/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
        <br>
           <router-link :to="'/edu/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
        <br>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息</el-button>
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
import course from '@/api/edu/course'

export default {

    //写核心代码位置，例如发送axios，但是不用我们写，我们只需要调用teacher.js中的方法
    data(){
        //定义变量和初始化
        return{
            page : 1,  //当前页
            limit : 5,  //每页记录数
            total : 0,  //总记录
            list : null, //查询完封装的list对象
            courseQuery :{
                title:'',
                status :'',
            }, //查询条件封装对象,
        }
    },
    created(){
        //调用methods中的方法，在页面渲染之前执行
        this.getList()
    },
    methods:{


        //删除课程
        removeDataById(courseId) {

           this.$confirm('确定删除该讲师信息吗?','提示',{
                confirmButtonText:'确定',
                concelButtonText:'取消',
                type:'warning'
            }).then(()=>{
                //点击确定,调用删除的方法
                course.deleteCourse(courseId)
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
        },



        getAllList() {
            course.getAllCourse()
                .then(response => {
                    this.list = response.data.list 
                })
        },


        //默认第一页，如果点了第二页，page = 2
        getList(page = 1){
            this.page = page
            course.getCourseList(this.page,this.limit,this.courseQuery)
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
            this.courseQuery = {}
            //查询所有
            this.getList()
        },
        
    }
    
}
</script>