import request from '@/utils/request'

//另一种写法
export default{

    getSubjectList(){

        return request({
            url:`/eduservice/subject/subjectList`,
            method:'get'
        })

    }
}