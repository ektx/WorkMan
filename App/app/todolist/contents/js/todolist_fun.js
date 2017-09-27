
/*
	过滤日历,只找到与日历相同的
	-----------------------------------
	eg:
	[
		{
			"time": "2017-9",
			"day": "30"
		}
	]
	=> ['30']
*/
function filterTimeArr (arr) {
	let result = [];
	let calendarNowTime = `${eventsCalendarMod.pickTime.year}-${eventsCalendarMod.pickTime.month}`;

	if (arr) {
		result = arr.filter(val => {
			// 如果是和日历同月的就显示事件
			if (val.time === calendarNowTime) 
			return val
		})

		result = result[0].day.split(',');
	}
	
	return result;
}