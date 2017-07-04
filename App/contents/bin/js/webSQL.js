/*
	web sql
	---------------------------------
	@v0.0.1
	@zwl
*/

let WEBSQL_CONNECT = '';

/*
	openDatabase options:
	name: 名称
	version: 版本
	description: 描述
	size: 大小 - 20M
	callback: 回调
*/
function webSQLOpenDB(name, version, description, size, callback) {
	WEBSQL_CONNECT = openDatabase(name, version, description, size * 1024 * 1024);

	if (callback) callback(WEBSQL_CONNECT)
}

/*
	创建数据库分类列表
*/
function webSQLCreateTable(name, options, doneCallback, failCallback) {
	WEBSQL_CONNECT.transaction( tx => {
		tx.executeSql(
			`CREATE TABLE IF NOT EXISTS ${name} (${options})`,
			[],
			(tx, result) => { if (doneCallback) doneCallback(result) },
			(tx, err) => { if (failCallback) failCallback(err) }
		);
	})
}


/*
	删除指定表格
*/
function webSQLDropTable(name, doneCallback, failCallback) {
	WEBSQL_CONNECT.transaction( tx => {
		tx.executeSql(
			`DROP TABLE ${name}`, [],
			(tx, result) => { if (doneCallback) doneCallback(result) },
			(tx, err) => { if(failCallback) failCallback(err) }
		)
	})
}


/*
	添加数据
	-----------------------------------------
	@values [array] eg: [1,'hello world']
*/
function webSQLInsert (table, key, values, doneCallback, failCallback) {
	if (!(values instanceof Array && values.length > 0)) {
		console.warn('no values!');
		return;
	}

	let placeholder = '?'.repeat(values.length).split('').join(',')

	WEBSQL_CONNECT.transaction( tx => {
		tx.executeSql(
			`INSERT INTO ${table} (${key}) VALUES (${placeholder})`,
			values,
			(tx, result) => { if (doneCallback) doneCallback(result) },
			(tx, err) => { if(failCallback) failCallback(err) }
		)
	})
}


/*
	通用功能
	--------------------------------------------
	@values [array] eg: []
*/
function webSQLCommon (query, values, doneCallback, failCallback) {
	WEBSQL_CONNECT.transaction( tx => {
		tx.executeSql(
			query, values,
			(tx, result) => { if (doneCallback) doneCallback(result) },
			(tx, err) => { if(failCallback) failCallback(err, query) }
		)
	})
}
































