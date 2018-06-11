import { setupCalendar, Calendar, DatePicker} from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

setupCalendar({
    firstDayOfWeek: 1
})

export default {
    name: 'r-v-calendar',
    props: {
        picker: {
            type: Boolean,
            default: false
        },
        value: {
            type: [Object, String],
            default: null
        }
    },
    components: {
        Calendar,
        DatePicker
    }
}