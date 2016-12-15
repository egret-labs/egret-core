var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var events = require('events');
var os = require('os');

var copydir = require('../lib/copy-dir');
var UnzipCommand = require("./installsdk/UnzipCommand");

var sdkConfigList = [{"category":"sdk","name":"Android SDK Base","varName":"ANDROID_HOME","url":"http://10.0.7.36/android-sdk_r24.4.1-windows.zip","installDir":"android-sdk-windows","fileSize":"196919088"},{"category":"sdk","name":"Android Platform Tools","url":"http://10.0.7.36/platform-tools_r24-windows.zip","installDir":"android-sdk-windows/platform-tools","fileSize":"3744669"},{"category":"sdk","name":"Android Build Tools","url":"http://10.0.7.36/build-tools_r24.0.1-windows.zip","installDir":"android-sdk-windows/build-tools/24.0.1","fileSize":"48323734"},{"category":"gapi19","name":"SDK Platform","url":"http://10.0.7.36/android-19_r04.zip","installDir":"android-sdk-windows/platforms/android-19","fileSize":"62590023"},{"category":"android_toolchain","name":"Java SDK","varName":"JAVA_HOME","url":"http://10.0.7.36/jdk1.8.0_77.zip","installDir":"jdk1.8.0_77","fileSize":"158202195"},{"category":"android_toolchain","name":"Apache Ant","varName":"ANT_HOME","url":"http://10.0.7.36/apache-ant-1.8.2-bin.zip","installDir":"apache-ant-1.8.2","fileSize":"41491235"},{"category":"android_toolchain","name":"Gradle","varName":"GRADLE_HOME","url":"http://10.0.7.36/gradle-2.9-bin.zip","installDir":"gradle-2.9","fileSize":"44652280"}];

var InstallSDK = (function (){
	function InstallSDK() {
        this.isAsync = true;
	}

	function print(info) {
		console.log(info);
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
	
	InstallSDK.prototype.execute = function() {
		
		function startToUnzipAndInstall() {
			var uzm = getUnzipManager();
			
			uzm.on("oneTaskFinished", function (fileName) {		
				var length = this.taskList.length;				
				print(this.count + "/" + length + " " + fileName + " unzipped and installed successfully!");
			});
			
			uzm.on("AllTasksFinished", function () {
				print("All files are unzipped and installed successfully!");
								
				saveSDKInfoToConfigFile();
				
				print("Android SDK installed successfully!");
				
				printAndroidSDKConfig();
			});
			
			var length = uzm.taskList.length;
			var fileStr = getFileStrByCount(length);
			print(length + " " + fileStr + " will be unzipped and installed!");
			print("Start to unzip and install!");
			
			uzm.start();
		}

		function startToDownload() {
			var list = getSDKConfigList();
			var downloadDir = getDownloadDir();
			
			var dlm = new DownloadManager(list, downloadDir);
			
			dlm.on("oneTaskFinished", function (fileName, fileSize) {
				var length = this.taskList.length;
				print(this.count + "/" + length + " " + fileName + " downloaded successfully!");
				
				var totalMBSize = parseInt(fileSize * 1.0 / (1024 * 1024));
				print("This file size is " + totalMBSize + "MB.");
			});
			
			dlm.on("AllTasksFinished", function () {
				print("All files are downloaded successfully!");
				
				startToUnzipAndInstall();
			});

			var length = list.length;
			var fileStr = getFileStrByCount(length);
			print(length + " " + fileStr + " will be downloaded!");
			
			var totalByteSize = calcTotalFileSize(list);
			var totalMBSize = parseInt(totalByteSize * 1.0 / (1024 * 1024));
			print("The total size is " + totalMBSize + "MB.");
			
			print("Start to download!")
			
			dlm.start();
		}

		startToDownload();
	}

	function printAndroidSDKConfig() {
		var config = getAndroidSDKConfig();
		var wingdata={
			'androidSDKInfo':config
		}
		var str = JSON.stringify(wingdata);
		console.log('wingdata:'+str);			
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
		
		if (!egret) {
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

	function writeJSONObjectToFile(configFile, jsonObj) {
		var str = JSON.stringify(jsonObj);
		writeToFile(configFile, str);
	}

	function getSDKConfigList() {
		return sdkConfigList;
	}

	function getAndroidSDKConfigFilePath() {
		var root = getRootPath();
		var fileName = "AndroidSDKConfig.json";
		var filePath = path.join(root, fileName);
		
		return filePath;
	}

	function getJSONObjectFromFile(configFile) {
		var config = null;
		var str = readFromFile(configFile);
		if (str != "") {
			config = JSON.parse(str);
		}
		
		return config;
	}
	
	var AndroidSDKConfig = null;
	function getAndroidSDKConfig() {
		if (!AndroidSDKConfig) {
			var filePath = getAndroidSDKConfigFilePath();
			AndroidSDKConfig = getJSONObjectFromFile(filePath);
		}

		return AndroidSDKConfig;
	}

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
	var DownloadManager = function (list, dlDir) {
		this.count = 0;
		this.taskList = list;
		if (!dlDir) {
			dlDir = os.tmpdir();
		}
		this.downloadDir = dlDir;
		this.downloader = new Downloader();

		this.start = function () {			
			for (var i=0; i<this.taskList.length; i++) {
				var task = this.taskList[i];
				var url = task.url;
				var fileName =  path.posix.basename(url);
				var fileSavePath = path.join(this.downloadDir, fileName);
				
				var dl = this.downloader.download(url, fileSavePath, this.taskFinishCallback);
				dl.downloadMgr = this;
				dl.taskIndex = i;
			}
		}

		this.taskFinishCallback = function () {
			var downloadMgr = this.downloadMgr;
			downloadMgr.count++;
			
			var task = downloadMgr.taskList[this.taskIndex];
			var url = task.url;
			var fileName =  path.posix.basename(url);
			var fileSize = task.fileSize;
			
			downloadMgr.emit("oneTaskFinished", fileName, fileSize);
			
			if (downloadMgr.count == downloadMgr.taskList.length) {
				downloadMgr.emit("AllTasksFinished");
			}
		}
	}

	DownloadManager.prototype = new events.EventEmitter;

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

	var UnzipManager = function (list) {
		this.count = 0;
		this.taskList = list;

		this.start = function () {
			for (var i=0; i<this.taskList.length; i++) {
				var task = this.taskList[i];

				var localFile = task.localFile;
				var installDir = task.installDir;
				
				var This = this;
				var unzipper = UnzipCommand.unzip(localFile, installDir, function(result, srcPath) {
					if (result == 0) {
						var baseName = getBaseName(srcPath);
						This.taskFinishCallback(baseName);
					} else {
						console.error("unzip failed!");
					}
				});
				
				
			}
		}

		this.taskFinishCallback = function (fileName) {
			var unzipMgr = getUnzipManager();
			unzipMgr.count++;
			
			unzipMgr.emit("oneTaskFinished", fileName);
			
			if (unzipMgr.count == unzipMgr.taskList.length) {
				unzipMgr.emit("AllTasksFinished");
			}
		}
	}

	UnzipManager.prototype = new events.EventEmitter;

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

	function saveSDKInfoToConfigFile() {
		var config = {};
		
		var list = getAllLocalFilesAndAbsInstallDirs();
		for (var i=0; i<list.length; i++) {
			var obj = list[i];
			if (obj.varName) {
				config[obj.varName] = obj.installDir;				
			}
		}

		var filePath = getAndroidSDKConfigFilePath();
		writeJSONObjectToFile(filePath, config);
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

	function getBaseName(dir) {
		return path.win32.basename(dir);
	}

	var uzm = null;
	function getUnzipManager() {
		if (!uzm) {
			var list = getAllLocalFilesAndAbsInstallDirs();
			uzm = new UnzipManager(list);
		}

		return uzm;
	}

	return InstallSDK;
})();

module.exports = InstallSDK;