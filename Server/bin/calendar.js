
/*
	简单的时间处理
	--------------------------------
	@version: 0.0.3
	@author: ektx <github.com/ektx>
*/

const calendar = {

	dayofyear: function() {
		let now = new Date();
		let old = new Date(now.getFullYear(), 0, 0);
		let diff = now - old;

		let day = diff / (24 * 60 * 60 * 1000);

		return Math.floor(day)
	},

	/*
		时间戳返回日期
		calendar.reTimeStamp(1480557895172) // => Thu Dec 01 2016 02:04:55 GMT+0800 (CST)
	*/
	reTimeStamp: function(timeStamp) {
		let d = new Date(1970, 0, 1);

		d.setMilliseconds(d.getMilliseconds() + parseInt(timeStamp) + 28800000);

		return d;
	},

	// @time [2016-12-25] 
	week: function(time) {
		let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
		let result = '';

		if (time) {
			result = week[new Date(time).getDay()]
		} else {
			result = week[new Date().getDay()]
		}

		return result
	},

	weeks: function() {
		return Math.ceil(this.dayofyear() / 7)
	},

	/*
		@year {number} 年
		@month {number} 月
	*/
	str: function(year, month) {
		let days = new Date(year, month, 0).getDate();
		let _day1 = new Date(year, month -1, 1).getDay();
		let result = [];

		for (let i = 0; i < days; i++) {
			result.push(i+1)
		}

		for (let i = 0; i < _day1; i++) {
			result.unshift('')
		}

		/* (7x5)
		返回一个类似以下效果的日历
		日 一 二  三  四 五 六
		   1  2  3   4  5  6 
		7  8  9  10  11 12 13 
		14 15 16 17  18 19 20 
		21 22 23 24  25 26 27 
		28 29 30
		*/

		return result
	},

	/*
		DEMO:
		calendar.format('YYYY-MM-DD')
		=> 2017-02-01

		calendar.format('YYYY-MM-DD hh:mm:ss')
		=> 2017-02-01 08:09:05

		calendar.format('YY-M-D h:m:s')
		=> 17-2-1 8:9:5

		calendar.format('YYYY-MM-DD', '2017/5/3')
		=> 2017-05-03

	*/
	format: function(str, setTime) {

		let timeArr = str.split(/\W+/);
		let markArr = str.split(/\w+/);
		let result = [];
		let time = setTime ? new Date(setTime) : new Date();
		let timeStr = '';

		let howShow = function (value, time) {
			if (value.length == 2 && time < 10) {
				time = '0'+time;
			}
			return time;
		}

		for (let i = 0, l = timeArr.length; i < l; i++) {
			var _str = timeArr[i], tmp = 0;
			switch ( _str ) {
				case 'YYYY':
				case 'YY':
					tmp = time.getFullYear();
					if ( _str.length == 2) {
						tmp = tmp.toString().substr(2,2)
					}
					break;

				case 'MM':
				case 'M':
					tmp = howShow(_str, time.getMonth() + 1)
					break;

				case 'DD':
				case 'D':
					tmp = howShow(_str, time.getDate())
					break;

				case 'h':
				case 'hh':
					tmp = howShow(_str, time.getHours());
					break;

				case 'm':
				case 'mm':
					tmp = howShow(_str, time.getMinutes());
					break;

				case 's':
				case 'ss':
					tmp = howShow(_str, time.getSeconds());
					break;
			}

			result.push( tmp )
		}

		for (let x = 1, y = markArr.length; x < y; x++) {
			timeStr += result[x-1]+markArr[x]
		}

		return timeStr
	},

	/*
		输出2个时间之间相差的月份,以数组形式返回:
		// 从 2017-1-1 到 2017-3-1
		calendar.howMonths('2017-1', '2017-3');
		// 从 2017-1-1 到 2017-3-10
		calendar.howMonths('2017-1-1', '2017-3-10');
	*/
	howMonths: function(startTime, endTime) {
		let _sTime = new Date(startTime);
		let _eTime = new Date(endTime);

		_sTime = new Date(_sTime.getFullYear(), _sTime.getMonth(), _sTime.getDate())
		_eTime = new Date(_eTime.getFullYear(), _eTime.getMonth(), _eTime.getDate())

		// 处理大小,防止用户时间大小位置放错
		if (_eTime < _sTime) {
			let _tem = _eTime;
			_eTime = _sTime;
			_sTime = _tem;
		}

		let result = [];
		// 当前处理月
		let nowMonth = -1;
		// 添加到结果的索引
		let dateIndex = -1;

		// 开始时间小于或等于结束时间
		while (_sTime <= _eTime) {
			// 天
			let thatD = _sTime.getDate();
			// 月
			let thatM = _sTime.getMonth() +1;

			if (thatM === nowMonth) {
				result[dateIndex].day.push( thatD )
			}
			else {
				result.push({
					time: `${_sTime.getFullYear()}-${thatM}`,
					day: [thatD]
				});

				dateIndex++;
				nowMonth = thatM;
			}

			_sTime.setDate(thatD + 1);

		}
		return result

	}
}

module.exports = calendar;
