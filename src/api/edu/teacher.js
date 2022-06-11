import request from '@/utils/request'

//另一种写法
export default{

    /*
    //分页条件查询
        current:当前页
        limit:每页显示多少条记录
        query:分页查询条件
    */
    getTeacherList(current,limit,query){

        return request({
            url:`/eduservice/teacher/page/${current}/${limit}`,
            method:'post',
            //data 表示把对象转换为json格式传递到接口里面，requestBody就是json串
            data : query 
        })

    },
    //根据id逻辑删除讲师
    deleteTeacherById(id){

        return request({
            url:`eduservice/teacher/${id}`,
            method:'delete'
        })

    },
    //添加讲师
    addTeacher(teacher){
        return request({
            url:'eduservice/teacher/addTeacher',
            method:'post',
            data: teacher
        })
    },
    //根据id查询讲师
    getInfoById(id){
        return request({
            url:`eduservice/teacher/getTeacher/${id}/`,
            method:'get',
        })
    },
    //修改讲师
    updateInfo(teacher){
        return request({
            url:`eduservice/teacher/update`,
            method:'post',
            data: teacher
        })
    }
}

/*
export function getTeacherList(current,limit,query) {
    return request({
      url: '',
      method: '',
      data: {

      }
    })
}
*/