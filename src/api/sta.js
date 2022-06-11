import request from '@/utils/request'

export default{


    getDataByDay(day) {
        return request({
            url : '/edusta/statistics/registerNumber/'+day,
            method : 'post'
        })
    },

    //图表显示
    showTable(searchObj) {
        return request({
            url : `/edusta/statistics/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
            method : 'get'
        })
    }

}
