define(["ci/listener/ciListener", "lib/jquery-tojson-1.0"], function() {
	Clazz.createPackage("com.components.ci.js");

	Clazz.com.components.ci.js.JobTemplates = Clazz.extend(Clazz.WidgetWithTemplate, {
		// template URL, used to indicate where to get the template
		templateUrl: commonVariables.contexturl + "components/ci/template/jobTemplates.tmp",
		configUrl: "components/projects/config/config.json",
		name : commonVariables.jobTemplates,
		ciListener: null,
		dynamicpage : null,
		addEvent : null,
		listEvent : null,
		updateEvent : null,
		editEvent : null,
		openEvent : null,
		deleteEvent : null,
		ciRequestBody : {},
		templateData : {},
		validateName : null,
		preOpenEvent : null,
		preEditEvent : null,
		changeUploaderEvent : null,
		showHideUploadEvent : null,
		showHideRepoEvent : null,
		removeDangerEvent : null,
	
		/***
		 * Called in initialization time of this class 
		 *
		 * @globalConfig: global configurations for this class
		 */
		initialize : function(globalConfig){
			var self = this;
			if (self.dynamicpage === null) {
				commonVariables.navListener.getMyObj(commonVariables.dynamicPage, function(retVal) {
					self.dynamicpage = retVal;
				});
			}

			if (self.ciListener === null) {
				self.ciListener = new Clazz.com.components.ci.js.listener.CIListener(globalConfig);
			}

			self.registerEvents(self.ciListener);
		},
		
		
		registerEvents : function (ciListener) {
			var self=this;
			// Register events
			if (self.addEvent === null) {
				self.addEvent = new signals.Signal();
			}

			if (self.listEvent === null) {
				self.listEvent = new signals.Signal();
			}

			if (self.openEvent === null) {
				self.openEvent = new signals.Signal();
			}

			if (self.editEvent === null) {
				self.editEvent = new signals.Signal();
			}
			if (self.updateEvent === null) {
				self.updateEvent = new signals.Signal();
			}

			if (self.deleteEvent === null) {
				self.deleteEvent = new signals.Signal();
			}
			
			if (self.validateName === null) {
				self.validateName = new signals.Signal();
			}

			if (self.preOpenEvent === null) {
				self.preOpenEvent = new signals.Signal();
			}

			if (self.preEditEvent === null) {
				self.preEditEvent = new signals.Signal();
			}

			if (self.changeUploaderEvent === null) {
				self.changeUploaderEvent = new signals.Signal();
			}

			if (self.showHideUploadEvent === null) {
				self.showHideUploadEvent = new signals.Signal();
			}

			if (self.showHideRepoEvent === null) {
				self.showHideRepoEvent = new signals.Signal();
			}

			if (self.removeDangerEvent === null) {
				self.removeDangerEvent = new signals.Signal();
			}

			// Trigger registered events
			self.openEvent.add(ciListener.openJobTemplate, ciListener);
			self.addEvent.add(ciListener.addJobTemplate, ciListener);
			self.listEvent.add(ciListener.listJobTemplate, ciListener);
			self.updateEvent.add(ciListener.updateJobTemplate, ciListener);
			self.editEvent.add(ciListener.editJobTemplate, ciListener);
			self.deleteEvent.add(ciListener.deleteJobTemplate, ciListener);
			self.validateName.add(ciListener.validateName, ciListener);
			self.preOpenEvent.add(ciListener.preOpen, ciListener);
			self.preEditEvent.add(ciListener.preEdit, ciListener);
			self.changeUploaderEvent.add(ciListener.changeUpload, ciListener);
			self.showHideUploadEvent.add(ciListener.showHideUpload, ciListener);
			self.showHideRepoEvent.add(ciListener.showHideRepo, ciListener);
			self.removeDangerEvent.add(ciListener.removeDangerClass, ciListener);
		},
		/***
		 * Called in once the login is success
		 *
		 */
		loadPage :function(){
			Clazz.navigationController.jQueryContainer = commonVariables.contentPlaceholder;
			Clazz.navigationController.push(this, commonVariables.animation);
		},

		loadPageTest :function(){
			Clazz.navigationController.push(this);
		},
		
		preRender: function(whereToRender, renderFunction){
			var self = this;
			self.ciListener.listJobTemplate(self.ciListener.getRequestHeader(self.ciRequestBody, "list"), function(response) {
				self.templateData.jobTemplates = response.data;
				renderFunction(self.templateData, whereToRender);
			});			
		},

		/***
		 * Called after the preRender() and bindUI() completes. 
		 * Override and add any preRender functionality here
		 *
		 * @element: Element as the result of the template + data binding
		 */
		postRender : function(element) {
			var self = this;
			self.multiselect();
		},

		pageRefresh: function() {
			var self = this;
			self.ciListener.listJobTemplate(self.ciListener.getRequestHeader(self.ciRequestBody, "list"), function(response) {
				self.data.jobTemplates = response.data;
				self.loadPage();		
			});
		},

		getAction : function(ciRequestBody, action, param, callback) {
			var self = this;
			// Content place holder for the Job template
			self.ciListener.listJobTemplate(self.ciListener.getRequestHeader(self.ciRequestBody, action, param), function(response) {
				if (action === "edit") {
					// only for edit popup value population
					self.editEvent.dispatch(response.data);
				} else if (action === "getAppInfos") {
					callback(response);
				} else {
					// For add, update and delete
					self.pageRefresh();
				}
			});	
		},
	
		resetForm: function($form) {
			$form.find('input:text, input:password, input:file, select, textarea').val('');
			$form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
		},

		constructApplicationsHtml : function(jobTemplateName, callback) {
				var self = this;
				// show applications names in popup
				self.getAction(self.ciRequestBody, 'getAppInfos', '', function(response) {
					// empty the applist element
					$('select[name=appIds]').html('');

					if (!self.isBlank(response.data)) {
						$.each(response.data, function(key, value) {
							var obj = $('select[name=appIds]');
							var opt = document.createElement("option");
							opt.appendChild(document.createTextNode(value.name));
							obj.append(opt);
						});
					}

					//to refresh all bootstrap-select
					$('.selectpicker').selectpicker('refresh');
					if (jobTemplateName !== '') {
						// Restore values
						self.getAction(self.configRequestBody, 'edit', jobTemplateName);
					}
				});
				callback();
		},

		/***
		 * Bind the action listeners. The bindUI() is called automatically after the render is complete 
		 *
		 */
		bindUI : function() {
			var self = this;

			$(".tooltiptop").tooltip();
			$(".dyn_popup").hide();

			// Open job template popup
			$("input[name=jobTemplatePopup]").unbind("click");
			$("input[name=jobTemplatePopup]").click(function() {
				$("#errMsg").removeClass("errormessage");
				$('input[name=name]').removeClass("errormessage");	
				$('#errMsg').html('');
				//reset the form
				self.resetForm($('#jobTemplate'));
				// button name change
				$('input[name=update]').prop("value", "Create");
				$('input[name=update]').prop("name", "save");			
				// show applications names in popup
				self.constructApplicationsHtml('', function() {
					self.preOpenEvent.dispatch( function() {});
				});
				self.opencc(this, $(this).attr('name'));				
   			});
			
			// Save job template
   			$('#jobTemplate').on('click', '[name=save]', function(e) {	
				self.validateName.dispatch('save', self, function() {
					self.pageRefresh();
				});
			});

   			// Edit job template
   			$("a[name=editpopup]").unbind("click");
			$("a[name=editpopup]").click(function() {
				var thisElem = this;
				//reset the form
				self.resetForm($('#jobTemplate'));
				var jobTemplateName = {};
				var name = $(this).attr('value');
				jobTemplateName.name = name;
				// Construct applications names
				self.constructApplicationsHtml(jobTemplateName, function() {
					self.preEditEvent.dispatch( function() {	
						// show edit popup
						self.openccci(thisElem, "jobTemplatePopup");
					});
				});
   			});

   			// Update job template
   			$('#jobTemplate').on('click', '[name=update]', function(e) {				
				self.validateName.dispatch('update', self, function() {
					self.pageRefresh();
				});
			});

   			// Delete job template
   			$("input[name=delete]").unbind("click");
   			$("input[name=delete]").click(function() {
   				var jobTemplateName = {};
				jobTemplateName.name = $(this).parent().parent().attr('name');
				self.configRequestBody = {};
				self.getAction(self.configRequestBody, 'delete', jobTemplateName);
   			});

   			// job template delete poppup
   			$("a[name=deleteconfirm]").unbind("click");
			$("a[name=deleteconfirm]").click(function() {
				self.opencc(this, "yesnopopup_" + $(this).attr('value'));
			});
			
			// show/hide repo types
   			$("input[name=enableRepo]").unbind("click");
			$("input[name=enableRepo]").click(function() {
				self.showHideRepoEvent.dispatch();
			});
			
			// show/hide upload types
   			$("input[name=enableUploadSettings]").unbind("click");
			$("input[name=enableUploadSettings]").click(function() {
				self.showHideUploadEvent.dispatch();
			});				
			
			//enable/disable uploads on operation change
			$("select[name=type]").unbind("change");
			$("select[name=type]").on("change", function(){					
				self.changeUploaderEvent.dispatch();
			});

			//remove danger class for uploads
			$("select[name=uploadTypes]").unbind("change");
			$("select[name=uploadTypes]").on("change", function(){				
				self.removeDangerEvent.dispatch($("select[name=uploadTypes]"));			
			});

			//remove danger class for appIds
			$("select[name=appIds]").unbind("change");
			$("select[name=appIds]").on("change", function(){				
				self.removeDangerEvent.dispatch($("select[name=appIds]"));			
			});
		}
	});

	return Clazz.com.components.ci.js.JobTemplates;
});