import dayjs from 'dayjs'
import { session } from '@/util/storage'

export const utils_timeFormat = ({ date, type = 'show', template = 'YYYY-MM-DD HH:mm:ss' }) => {

    // 如果只有日期, 就拼接上时间 
    if(typeof date=='string' && date.length==10){
        date = date + ' ' + dayjs(`${new Date()}`).format('HH:mm:ss');
    }

    const timeZone = session.get('timeZone') || 8
    if(type === 'post'){
        // 如果是提交参数,  先查询到当前迪拜的时区, 计算出时差, 然后往后推
        const curTimeZone = -new Date().getTimezoneOffset()/60
        const hour = timeZone < 0 ? -(timeZone - curTimeZone) : curTimeZone - timeZone
        return dayjs(date).subtract(hour, 'hours').format(template)
    }else{
        // 如果是展示,  按照北京时间 ,往前推, 计算出美东时间
        // unit = timeZone < 0 ? -Math.abs(8 - timeZone) : Math.abs(8 - timeZone)
        const unit = timeZone < 0 ? -(timeZone - 8) : 8 - timeZone
        return dayjs(date).subtract(unit, 'hours').format(template)
    }
}