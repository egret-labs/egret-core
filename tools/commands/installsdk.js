var fs = require('fs');
var http = require('http');
var path = require('path');
var events = require('events');

var UnzipCommand = require("./installsdk/UnzipCommand");
var utils = require('../lib/utils');

var sdkConfigList = [{"varName":"ANDROID_HOME","url":"http://10.0.7.36/android-sdk_r24.4.1-windows.zip","installDir":"android-sdk-windows","fileSize":"196919088"},{"url":"http://10.0.7.36/platform-tools_r24-windows.zip","installDir":"android-sdk-windows/platform-tools","fileSize":"3744669"},{"url":"http://10.0.7.36/build-tools_r24.0.1-windows.zip","installDir":"android-sdk-windows/build-tools/24.0.1","fileSize":"48323734"},{"url":"http://10.0.7.36/android-19_r04.zip","installDir":"android-sdk-windows/platforms/android-19","fileSize":"62590023"},{"varName":"ANT_HOME","url":"http://10.0.7.36/apache-ant-1.8.2-bin.zip","installDir":"apache-ant-1.8.2","fileSize":"41491235"},{"varName":"GRADLE_HOME","url":"http://10.0.7.36/gradle-2.9-bin.zip","installDir":"gradle-2.9","fileSize":"44652280"}];

var InstallSDK = (function (){
	function InstallSDK() {
        this.isAsync = true;
	}
	
	InstallSDK.prototype.execute = function() {
		function getUnzipManager() {
			var list = getAllLocalFilesAndAbsInstallDirs();
			var uzm = new UnzipManager(list);

			return uzm;
		}

		function getBaseName(dir) {
			return path.win32.basename(dir);
		}

		function startToUnzipAndInstall() {
			var uzm = getUnzipManager();
			
			uzm.on(uzm.oneTaskFinishedEventName, function (taskIndex) {
				var length = this.taskList.length;
				var task = this.taskList[taskIndex];
				var fileName = getBaseName(task.localFile);
				var progressMsg = utils.tr(2209, this.finishedTaskCount + "/" + length + " " + fileName);
				print(progressMsg);
			});
			
			uzm.on(uzm.allTasksFinishedEventName, function () {
				var allUnzippedMsg = utils.tr(2210);
				print(allUnzippedMsg);
								
				saveSDKInfoToConfigFile();
				
				var sdkInstalledMsg = utils.tr(2211);
				print(sdkInstalledMsg);
				
				printAndroidSDKConfig();
			});
			
			var length = uzm.taskList.length;
			var unzipMsg = utils.tr(2207, length);
			print(unzipMsg);

			var startMsg = utils.tr(2208);
			print(startMsg);
			
			uzm.start();
		}

		function getDownloadManager() {
			var list = getSDKConfigList();
			var downloadDir = getDownloadDir();
			
			var dlm = new DownloadManager(list, downloadDir);

			return dlm;
		}

		function startToDownload() {
			var dlm = getDownloadManager();
			
			dlm.on(dlm.oneTaskFinishedEventName, function (taskIndex) {

				var task = this.taskList[taskIndex];
				var url = task.url;
				var fileName =  path.posix.basename(url);
				var fileSize = task.fileSize;

				var length = this.taskList.length;
				var progressMsg = utils.tr(2204, this.finishedTaskCount + "/" + length + " " + fileName);
				print(progressMsg);
				
				var totalMBSize = parseInt(fileSize * 1.0 / (1024 * 1024));
				var fileSizeMsg = utils.tr(2205, totalMBSize);
				print(fileSizeMsg);
			});
			
			dlm.on(dlm.allTasksFinishedEventName, function () {
				var allDownloadedMsg = utils.tr(2206);
				print(allDownloadedMsg);
				
				startToUnzipAndInstall();
			});

			var length = dlm.taskList.length;
			var downloadMsg = utils.tr(2201, length);
			print(downloadMsg);
			
			var totalByteSize = calcTotalFileSize(dlm.taskList);
			var totalMBSize = parseInt(totalByteSize * 1.0 / (1024 * 1024));
			var totalSizeMsg = utils.tr(2202, totalMBSize);
			print(totalSizeMsg);
			
			var startMsg = utils.tr(2203);
			print(startMsg);
			
			dlm.start();
		}

		startToDownload();
	}

	function print(info) {
		var isEgret = isInEgretMode();
		if(isEgret && egret.args.ide){
			var out = {
				'output': info
			}
			console.log(JSON.stringify(out));
		} else {
			console.log(info);
		}
	}

	function getFileStrByCount(count) {
		var str = "file";
		if (count > 1) {
			str += "s";
		}

		return str;
	}

	function calcTotalFileSize(list) {
		var size = 0;
		if (list) {
			for (var i=0; i<list.length; i++) {
				var fileSize = new Number(list[i].fileSize);
				size += fileSize;
			}
		} else {
			size = -1;
		}

		return size;
	}

	function printAndroidSDKConfig() {
		 var config = getAndroidSDKConfig();
		 var outdata={
		 	'androidSDKInfo': config
		 }

		 var isEgret = isInEgretMode();		 
		 if(!isEgret || egret.args.ide) {
		 	var str = JSON.stringify(outdata);
		 	console.log(str);
		}
		
	}

	InstallSDK.printAndroidSDKConfig = printAndroidSDKConfig;
	
	function getAppDataEnginesRootPath() {
		var rootPath;
		switch (process.platform) {
			case 'darwin':
				var home = process.env.HOME || ("/Users/" + (process.env.NAME || process.env.LOGNAME));
				if (!home)
					return null;
				rootPath = home + "/Library/Application Support/Egret/AndroidSDK/";
				break;
			case 'win32':
				var appdata = process.env.AppData || process.env.USERPROFILE + "/AppData/Roaming/";
				rootPath = appdata + "/Egret/AndroidSDK/";
				break;
			default:
				;
		}
		if (!fs.existsSync(rootPath)) {
			fs.mkdirSync(rootPath);
		}
		
		return rootPath;
	}


	function getRootPath() {
		var root = "";
		
		var isEgret = isInEgretMode();
		if (!isEgret) {
			root = __dirname;
		} else {
			root = getAppDataEnginesRootPath();
		}
		
		return root;
	}
	
	function readFromFile(fileName) {
		var str = "";
		try {
			var data = fs.readFileSync(fileName);

			str = data.toString();			
		} catch (e) {			
		}
		
		return str;
	}

	function writeToFile(fileName, data) {
		fs.writeFileSync(fileName, data);
	}

	function getJSONObjectFromFile(configFile) {
		var config = null;
		var str = readFromFile(configFile);
		if (str != "") {
			config = JSON.parse(str);
		}

		return config;
	}

	function writeJSONObjectToFile(configFile, jsonObj) {
		var str = JSON.stringify(jsonObj);
		writeToFile(configFile, str);
	}

	function getConfigFilePathByFileName(fileName) {
		var root = getRootPath();
		var filePath = path.join(root, fileName);

		return filePath;
	}

	function getAndroidSDKConfigFilePath() {
		var fileName = "AndroidSDKConfig.json";
		var filePath = getConfigFilePathByFileName(fileName);
		
		return filePath;
	}
	
	var AndroidSDKConfig = null;
	function getAndroidSDKConfig() {
		if (!AndroidSDKConfig) {
			var filePath = getAndroidSDKConfigFilePath();
			AndroidSDKConfig = getJSONObjectFromFile(filePath);
		}

		return AndroidSDKConfig;
	}

	function needAddBinToPath(name) {
		var result = false;

		if (name == "ANT_HOME" || name == "GRADLE_HOME") {
			result = true;
		}

		return result;
	}

	function getSDKConfigList() {
		return sdkConfigList;
	}

	var allLocalFilesAndAbsInstallDirs = null;
	function getAllLocalFilesAndAbsInstallDirs() {
		if (!allLocalFilesAndAbsInstallDirs) {
			allLocalFilesAndAbsInstallDirs = [];

			var downloadDir = getDownloadDir();
			var sdkInstallDir = getSDKInstallDir();

			var lists = getSDKConfigList();
			for (var i=0; i<lists.length; i++) {
				var list = lists[i];

				var url = list.url;
				var fileName =  path.posix.basename(url);
				var localFile = path.join(downloadDir, fileName);
				var installDir = path.join(sdkInstallDir, list.installDir);

				var result = {
					"localFile" : localFile,
					"installDir" : installDir,
					"varName" : list.varName
				};

				allLocalFilesAndAbsInstallDirs.push(result);

			}
		}

		return allLocalFilesAndAbsInstallDirs;
	}

	function saveSDKInfoToConfigFile() {
		var config = {};

		var list = getAllLocalFilesAndAbsInstallDirs();
		for (var i=0; i<list.length; i++) {
			var obj = list[i];
			if (obj.varName) {
				var installDir = obj.installDir;

				if (needAddBinToPath(obj.varName)) {
					installDir = path.join(installDir, "bin");
				}

				config[obj.varName] = installDir;
			}
		}

		var filePath = getAndroidSDKConfigFilePath();
		writeJSONObjectToFile(filePath, config);
	}

	var MultiTaskManager = function () {
		// public. shoulde be overrided by subclass.
		this.oneTaskFinishedEventName = "oneTaskFinished";

		this.allTasksFinishedEventName = "allTasksFinished";

		this.taskList = [];

		// protected. shoulde be overrided by subclass.
		this.progressConfigFileName = "MultiTaskProgressConfig.json";

		this.unfinishedTask = function (taskIndex) {

		}

		// private. shoulde NOT be overrided by subclass.
		this.finishedTaskCount = 0;

		this.isTaskInProgressConfigList = function(taskIndex) {
			var result = false;

			var configList = this.getProgressConfigList();
			if (configList) {
				for (var i=0; i<configList.length; i++) {
					if (taskIndex == configList[i]) {
						result = true;
					}
				}
			}

			return result;
		}

		this.isTaskFinished = function(taskIndex) {
			var finished = this.isTaskInProgressConfigList(taskIndex);

			return finished;
		}

		this.getProgressConfigFilePath = function() {
			var fileName = this.progressConfigFileName;
			var filePath = getConfigFilePathByFileName(fileName);

			return filePath;
		};

		this.getProgressConfigList = function() {
			var progressConfigFilePath = this.getProgressConfigFilePath();
			var configList = getJSONObjectFromFile(progressConfigFilePath);

			return configList;
		};

		this.writeProgressConfigToFile = function(taskIndex) {
			var configList = this.getProgressConfigList();
			if (!configList) {
				configList = [];
			}

			var isTaskInConfigList = this.isTaskInProgressConfigList(taskIndex);
			if (!isTaskInConfigList) {
				configList.push(taskIndex);

				var configFilePath = this.getProgressConfigFilePath();
				if (configFilePath) {
					writeJSONObjectToFile(configFilePath, configList);
				}
			}
		}

		this.emitTaskFinishedEvent = function(taskIndex) {
			this.emit(this.oneTaskFinishedEventName, taskIndex);
		}

		this.tryToEmitAllTasksFinishedEvent = function() {
			if (this.finishedTaskCount == this.taskList.length) {
				this.emit(this.allTasksFinishedEventName);
			}
		}

		// protected. used by subclasses to notify one task finished.
		this.taskFinishCallback = function (taskIndex) {
			this.finishedTaskCount++;

			this.writeProgressConfigToFile(taskIndex);

			this.emitTaskFinishedEvent(taskIndex);

			this.tryToEmitAllTasksFinishedEvent();
		}

		// public. used to start to process tasks.
		this.start = function () {
			if (this.taskList) {
				for (var i = 0; i<this.taskList.length; i++) {
					var taskFinished = this.isTaskFinished(i);
					if (taskFinished) {
						this.taskFinishCallback(i);
					} else {
						this.unfinishedTask(i);
					}
				}
			}

		}
	}

	MultiTaskManager.prototype = new events.EventEmitter;

	function Downloader() {
		this.download = function(url, dest, cb) {
		  var file = fs.createWriteStream(dest);
		  var request = http.get(url, function(response) {
			response.pipe(file);
			file.on('finish', function() {
			  file.close(cb);  // close() is async, call cb after close completes.
			});
		  }).on('error', function(err) { // Handle errors
			console.error(err.message);
		  });

		  return file;
		};
	}

	var downloadDir = null;
	function setDownloadDir(dir) {
		downloadDir = dir;
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }
	}

	function getDownloadDir() {
		if (!downloadDir) {
			var root = getRootPath();
		    var dir = path.join(root, "download")
			setDownloadDir(dir);
		}

		return downloadDir;
	}

	var DownloadManager = function (list, dlDir) {
		// for internal use only.
		this.downloadDir = dlDir || getDownloadDir();

		var downloader = new Downloader();

		var thiz = this;

		// override parent class members.
		this.oneTaskFinishedEventName = "oneDownloadTaskFinished";

		this.allTasksFinishedEventName = "allDownloadTasksFinished";

		this.progressConfigFileName = "DownloadProgressConfig.json";

		this.taskList = list;

		this.unfinishedTask = function(taskIndex) {
			var task = this.taskList[taskIndex];

			var url = task.url;

			var downloadDir = this.downloadDir;
			var fileName =  path.posix.basename(url);
			var fileSavePath = path.join(downloadDir, fileName);

			var dl = downloader.download(url, fileSavePath, function() {
				thiz.taskFinishCallback(taskIndex);
			});
		}
	}

	DownloadManager.prototype = new MultiTaskManager();

	var sdkInstallDir = null;
	function setSDKInstallDir(dir) {
		sdkInstallDir = dir;
        if (!fs.existsSync(sdkInstallDir)) {
            fs.mkdirSync(sdkInstallDir);
        }
	}

	function getSDKInstallDir() {
		if (!sdkInstallDir) {
			var root = getRootPath();
			var dir = path.join(root, "SDK");
			setSDKInstallDir(dir);
		}

		return sdkInstallDir;
	}

	var UnzipManager = function (list) {
		// for internal use only.
		var thiz = this;

		// override parent class members.
		this.oneTaskFinishedEventName = "oneUnzipTaskFinished";

		this.allTasksFinishedEventName = "allUnzipTasksFinished";

		this.progressConfigFileName = "UnzipProgressConfig.json";

		this.taskList = list;

		this.unfinishedTask = function(taskIndex) {
			var task = this.taskList[taskIndex];

			var localFile = task.localFile;
			var installDir = task.installDir;

			UnzipCommand.unzip(localFile, installDir, function(result) {
				if (result == 0) {
					thiz.taskFinishCallback(taskIndex);
				} else {
					console.error("unzip failed!");
				}
			});
		}
	}

	UnzipManager.prototype = new MultiTaskManager();

	return InstallSDK;
})();

module.exports = InstallSDK;


function isInEgretMode() {
	var isEgret = false;
	try {
		isEgret = !!egret;
	} catch(e) {

	}

	return isEgret;
}

(function (){
	var isEgret = isInEgretMode();	
	if (!isEgret) {
		InstallSDK.prototype.execute();
	}
})();