define(["build/api/buildAPI"], function() {

	Clazz.createPackage("com.components.build.js.listener");

	Clazz.com.components.build.js.listener.BuildListener = Clazz.extend(Clazz.WidgetWithTemplate, {
		buildAPI : null,		
		mavenServiceListener : null,		
		/***
		 * Called in initialization time of this class 
		 *
		 * @config: configurations for this listener
		 */
		initialize : function(config) {
			var self = this;
			
			if(self.buildAPI === null){
				self.buildAPI = new Clazz.com.components.build.js.api.BuildAPI();
			}
			if(self.mavenServiceListener === null)	{
				commonVariables.navListener.getMyObj(commonVariables.mavenService, function(retVal){});
			}
		},
		
		onPrgoress : function(clicked) {
			var check = $(clicked).attr('data-flag');
			var self = this;
			if(check === "true") {
				self.openConsole();
				$(clicked).attr('data-flag','false');
			} else {
				self.closeConsole();
				$(clicked).attr('data-flag','true');
				$(window).resize();
			}
		},
		
		getBuildInfo : function(header, callback){
			var self = this;
			
			try {
				self.buildAPI.build(header,
					function(response) {
						if (response !== null) {
							callback(response);
						} else {
							callback({ "status" : "service failure"});
						}
					},

					function(textStatus) {
						callback({ "status" : "Connection failure"});
					}
				);
			} catch(exception) {
				callback({ "status" : "service exception"});
			}
		},
		
		downloadBuild : function(buildNo, callback){
			var self = this, header = self.getRequestHeader("", {'buildNo':buildNo}, 'download');
			window.open(header.webserviceurl);
			/* try {
				self.buildAPI.build(header,
					function(response) {
						if (response !== null) {
							callback(response);
						} else {
							callback({ "status" : "service failure"});
						}
					},

					function(textStatus, xhr, error) {
						callback({ "status" : "Connection failure"});
					}
				);
			} catch(exception) {
				callback({ "status" : "service exception"});
			} */
		},
		
		deployBuild : function(queryString, callback){
			var self = this, appInfo = self.buildAPI.localVal.getJson('appdetails');
			
			if(appInfo !== null){
				queryString +=	'&customerId='+ self.getCustomer() +'&appId='+ appInfo.data.appInfos[0].id +'&projectId=' + appInfo.data.id + '&username=' + self.buildAPI.localVal.getSession('username');
			}
			if(self.mavenServiceListener === null)	{
				commonVariables.navListener.getMyObj(commonVariables.mavenService, function(retVal){
					self.mavenServiceListener = retVal;
					
					self.mavenServiceListener.mvnDeploy(queryString, '#logContent', function(returnVal){
						callback(returnVal);
					});
				});
			}else{
				self.mavenServiceListener.mvnDeploy(queryString, '#logContent', function(returnVal){
					callback(returnVal);
				});
			}
		},
		
		buildProject : function(queryString, callback){
			var self = this, appInfo = self.buildAPI.localVal.getJson('appdetails');
			
			if(appInfo !== null){
				queryString +=	'&customerId='+ self.getCustomer() +'&appId='+ appInfo.data.appInfos[0].id +'&projectId=' + appInfo.data.id + '&username=' + self.buildAPI.localVal.getSession('username');
			}
			
			if(self.mavenServiceListener === null)	{
				commonVariables.navListener.getMyObj(commonVariables.mavenService, function(retVal){
					self.mavenServiceListener = retVal;
					
					self.mavenServiceListener.mvnBuild(queryString, '#logContent', function(returnVal){
						callback(returnVal);
					});
				});
			}else{
				self.mavenServiceListener.mvnBuild(queryString, '#logContent', function(returnVal){
					callback(returnVal);
				});
			}
		},
		
		runAgainstSource : function(queryString, callback){
			var self = this, appInfo = self.buildAPI.localVal.getJson('appdetails');
			
			if(appInfo !== null){
				queryString +=	'&customerId='+ self.getCustomer() +'&appId='+ appInfo.data.appInfos[0].id +'&projectId=' + appInfo.data.id + '&username=' + self.buildAPI.localVal.getSession('username');
			}

			if(self.mavenServiceListener === null)	{
				commonVariables.navListener.getMyObj(commonVariables.mavenService, function(retVal){
					self.mavenServiceListener = retVal;
					
					self.mavenServiceListener.mvnRunagainstSource(queryString, '#logContent', function(returnVal){
						callback(returnVal);
					});
				});
			}else{
				self.mavenServiceListener.mvnRunagainstSource(queryString, '#logContent', function(returnVal){
					callback(returnVal);
				});
			}
		},
		
		stopServer : function(callback){
			var self = this, appInfo = self.buildAPI.localVal.getJson('appdetails');
			if(appInfo !== null){
				queryString =	'&customerId='+ self.getCustomer() +'&appId='+ appInfo.data.appInfos[0].id +'&projectId=' + appInfo.data.id + '&username=' + self.buildAPI.localVal.getSession('username');
			}
			
			if(self.mavenServiceListener === null)	{
				commonVariables.navListener.getMyObj(commonVariables.mavenService, function(retVal){
					self.mavenServiceListener = retVal;
					
					self.mavenServiceListener.mvnStopServer(queryString, '#logContent', function(returnVal){
						callback(returnVal);
					});
				});
			}else{
				self.mavenServiceListener.mvnStopServer(queryString, '#logContent', function(returnVal){
					callback(returnVal);
				});
			}
		},

		restartServer : function(callback){
			var self = this, appInfo = self.buildAPI.localVal.getJson('appdetails');
			if(appInfo !== null){
				queryString =	'&customerId='+ self.getCustomer() +'&appId='+ appInfo.data.appInfos[0].id +'&projectId=' + appInfo.data.id + '&username=' + self.buildAPI.localVal.getSession('username');
			}
			
			if(self.mavenServiceListener === null)	{
				commonVariables.navListener.getMyObj(commonVariables.mavenService, function(retVal){
					self.mavenServiceListener = retVal;
					
					self.mavenServiceListener.mvnRestartServer(queryString, '#logContent', function(returnVal){
						callback(returnVal);
					});
				});
			}else{
				self.mavenServiceListener.mvnRestartServer(queryString, '#logContent', function(returnVal){
					callback(returnVal);
				});
			}
		},

		deleteBuild : function(buildNo, callback){
			var self = this, header = self.getRequestHeader(JSON.stringify([buildNo]), '', 'delete');
			try {
				self.buildAPI.build(header,
					function(response) {
						if (response !== null) {
							callback(response);
						} else {
							callback({ "status" : "service failure"});
						}
					},

					function(textStatus) {
						callback({ "status" : "Connection failure"});
					}
				);
			} catch(exception) {
				callback({ "status" : "service exception"});
			}
		},
		
		
		/***
		 * provides the request header
		 *
		 * @BuildRequestBody: request body of Build
		 * @return: returns the contructed header
		 */
		getRequestHeader : function(BuildRequestBody, buildInfo, action) {
			var self=this, header, appdirName = '', url = '', method = "GET", contType = "application/json", conte;
			
			if(self.buildAPI.localVal.getSession('appDirName') !== null){
				appdirName = self.buildAPI.localVal.getSession('appDirName');
			}
			
			if(action === "getList"){
				method = "GET";
				url = 'buildinfo/list?appDirName=' + appdirName;
			}else if(action === "download"){
				method = "GET";
				contType: "multipart/form-data";
				url = 'buildinfo/downloadBuild?appDirName=' + appdirName + '&buildNumber=' + buildInfo.buildNo;
			}else if(action === "delete"){
				method = "DELETE";
				var appInfo = self.buildAPI.localVal.getJson('appdetails');
				if(appInfo !== null){
					url = 'buildinfo/deletebuild?customerId='+ self.getCustomer() +'&appId='+ appInfo.data.appInfos[0].id +'&projectId=' + appInfo.data.id;
				}
			} else if(action === "serverstatus"){
				method = "GET";
				url = 'buildinfo/checkstatus?appDirName=' + appdirName;
			} 
			
			header = {
				contentType: contType,
				requestMethod: method,
				requestPostBody: BuildRequestBody,
				dataType: "json",
				webserviceurl: commonVariables.webserviceurl + url
			};

			return header;
		}
	});

	return Clazz.com.components.build.js.listener.BuildListener;
});