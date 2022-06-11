import request from '@/utils/request'

//另一种写法
export default{

    addCourseInfo(courseInfo){

        return request({
            url:`/eduservice/course/addCourse`,
            method:'post',
            data: courseInfo  //requestBody
        })

    },
    getAllTeacher(){
        return request({
            url:`/eduservice/teacher/findAll`,
            method:'get',
        })
    },

    getCouseInfo(courseId){

        return request({
            url:`/eduservice/course/getCourseInfo/${courseId}`,
            method:'get',
        })
    },

    updateCourseInfo(CourseInfo){

        return request({
            url:`/eduservice/course/update`,
            method:'post',
            data : CourseInfo
        })

    },
    //课程发布信息确认
    publishCourse(courseId) {
        
        return request({
            url:`eduservice/course/publishCourseInfo/${courseId}`,
            method : 'get',
        })
    },

    //课程最终发布
    publish(courseId) {
        return request({
            url :`eduservice/course/publish/${courseId}`,
            method : 'post'
        })
    },

    //查询所有课程
    getAllCourse() {
        return request({
            url :`eduservice/course`,
            method : 'get'
        })
    },
    
    /*
    //分页条件查询
        current:当前页
        limit:每页显示多少条记录
        query:分页查询条件
    */
    getCourseList(current,limit,query){

            return request({
                url:`/eduservice/course/page/${current}/${limit}`,
                method:'post',
                //data 表示把对象转换为json格式传递到接口里面，requestBody就是json串
                data : query 
            })
    
    },

    //删除课程
    deleteCourse(courseId) {

        return request({
            url:`/eduservice/course/${courseId}`,
            method:'delete',
            //data 表示把对象转换为json格式传递到接口里面，requestBody就是json串 
        })

    }

    
}