

/*
	indexedDB 数据库开发
	==================================
*/
(function(){

	if (!window.indexedDB) {
		console.error('你的浏览器不支持 indexedDB!');
		return;
	}
}())

// let db;
let db = {},
	DB_NAME = 'WorkMan',
	VERSION = 1;


function idb_init (upgradeneededCallback, successCallback) {
	let idb_req = window.indexedDB.open(DB_NAME, VERSION);

	idb_req.onblocked = function(evt) {
		console.warn('idb_init: Please close all other tabs with ths site open!')
	}


	idb_req.onerror = function(evt) {
		///
	}

	idb_req.onsuccess = function(evt) {
		console.log('OK! Connection WorkMan indexedDB!');
		db = this.result;

		if (successCallback) successCallback();
	}

	idb_req.onupgradeneeded = function(event) {

		let _db = event.target.result;
			
		let createObjAndIndex = function(options) {
			let objectStore = options.objStore;
			let objStrOpt	= options.oso;
			let indexArr	= options.index;
			let defaultVal  = options.indVal;
			let todoTypeObj = '';
			let objStoreVersion	= objectStore + VERSION;

			// 判断老版本的数据库是否存在
			if (_db.objectStoreNames.contains(objectStore + (VERSION - 1) )) {
				console.log('Has Old version: ' + objectStore + (VERSION -1) )
			}

			// 创建一个对象空间来持有我们的计划列表
			// 设定一个属性 id 名称,同时也是我们的 key path
			todoTypeObj = _db.createObjectStore(objStoreVersion, objStrOpt);

			// 生成索引
			if ( indexArr && indexArr.length ) {
				for (let i = 0, l = indexArr.length; i < l; i++) {
					// 为事件的提醒时间添加一个索引,方便搜索使用
					todoTypeObj.createIndex(indexArr[i][0],indexArr[i][1],indexArr[i][2]);
				}
			}

			// 生成默认值
			if (defaultVal) {
				for (let i = 0, l = defaultVal.length; i < l; i++) {
					todoTypeObj.add(defaultVal[i])
				}
			}
			
		}

		_db.onversionchange = function(event) {
			// _db.close();
			console.warn('idb_init - onupgradeneeded: Please close all other tabs with ths site open!');

		};

		if (upgradeneededCallback) 
			upgradeneededCallback( createObjAndIndex )

	}
}


function addOrDelDB (type, storeName, data, doneCallback, failCallback) {

	if (!db) {
		console.error('addToDoType: the db is not initialized!');
		return;
	}
	storeName+=VERSION;
	let tx = db.transaction(storeName, 'readwrite');
	let stroe = tx.objectStore(storeName);
	let req = stroe[type](data);

	req.onsuccess = function(data) {
		console.log('Insertion in db successful!');
		if (doneCallback) doneCallback();
	}

	req.onerror = function() {
		console.error('add error', this.error);
		if (failCallback) failCallback();
	}

}


/*
	向数据库中添加内容
*/
function addToDB (storeName, data, doneCallback, failCallback) {
	addOrDelDB('add', storeName, data, doneCallback, failCallback)
}

/*
	删除
*/
function deleteDB (storeName, data, doneCallback, failCallback) {
	addOrDelDB('delete', storeName, data, doneCallback, failCallback)
}

/*
	更新指定数据
	-----------------------------
	@storeName 		表名
	@id 			查询索引的值
	@key 			更新字段
	@value 			更新内容
	@doneCallback 	回调函数
*/
function updataDB (storeName, id, key, value, doneCallback, failCallback) {
	if (!db) {
		console.error('addToDoType: the db is not initialized!');
		return;
	}

	storeName+=VERSION;
	let stroe = db.transaction(storeName, 'readwrite').objectStore(storeName);

	// 得到要更新的数据
	let oldInfo = stroe.get( id );

	oldInfo.onsuccess = function() {
		let data = oldInfo.result;

		if (!data) {
			if (failCallback) failCallback('No Data!');
			return;
		}

		data[key] = value;

		let updataValueReq = stroe.put(data);

		updataValueReq.onsuccess = function() {
			console.warn('OK! Updata!');

			if (doneCallback) doneCallback();
		}

	}

	oldInfo.onerror = function() {
		console.error(this.error)
		if (failCallback) failCallback(this.error)
	}


}

/*
	从数据库中读取数据
*/
function getKeyInfo(storeName, key, doneCallback, failCallback) {
	storeName+=VERSION;
	let tx = db.transaction(storeName, 'readonly');
	let stroe = tx.objectStore(storeName);
	let req = stroe.get(key);

	req.onsuccess = function(evt) {
		// console.log(evt)
		let val = evt.target.result;

		if (doneCallback) doneCallback(val)
	}
	
	req.onerror = function() {
		if (failCallback) failCallback(this.error)
	}
}

/*
	从数据库中读取所有数据
*/
function getTableList(storeName, doneCallback, query) {
	
	storeName+=VERSION;
	query = query || {};

	let objStore = db.transaction(storeName).objectStore(storeName),
		data = [],
		queryWay = null;

	let getAll = function() {
		if ('getAll' in objStore) {
			console.info('getTableList: use getAll :)');
			objStore.getAll(queryWay).onsuccess = function(evt) {
				if(doneCallback) doneCallback(evt.target.result)
			}
		} else {
			console.info('getTableList: use openCursor :(');	
			objStore.openCursor(queryWay).onsuccess = function(evt) {
				let cursor = evt.target.result;

				if (cursor) {
					data.push(cursor.value)
					cursor.continue();
				} else {
					if (doneCallback) doneCallback(data)
					console.warn('No more entries!')
				}
			}
		}
	}

	/*
		query:
		@filter: [only | lowerBound | bound] 匹配方式
		@key: 匹配内容
		@value: 匹配的具体内容,如: 123, 'apple'
		@not: [true|false] 是否包含自己
	*/
	if (query.filter) {
		// 替换取值对象为游标取值内容
		objStore = objStore.index(query.key);

		// 设定取值方式
		if (query.filter === 'bound') {
			queryWay = IDBKeyRange.bound(query.value[0], query.value[1], query.not[0], query.not[1]);
		} else {
			if (query.not) {
				queryWay = IDBKeyRange[query.filter](query.value, true);
			} else {
				queryWay = IDBKeyRange[query.filter](query.value);
			}
		}

	}
	
	getAll()

}


