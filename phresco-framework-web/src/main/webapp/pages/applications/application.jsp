<%--
  ###
  Framework Web Archive
  
  Copyright (C) 1999 - 2012 Photon Infotech Inc.
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
       http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ###
  --%>
<%@ taglib uri="/struts-tags" prefix="s"%>

<%@ page import="org.apache.commons.lang.StringUtils" %>

<%@ page import="com.photon.phresco.commons.FrameworkConstants" %>
<%@ page import="com.photon.phresco.commons.model.ApplicationInfo"%>

<!--  Heading Starts -->
<%
    String fromPage = (String) request.getAttribute(FrameworkConstants.REQ_FROM_PAGE);
    if (StringUtils.isEmpty(fromPage)) {
        fromPage = "";
    }
    ApplicationInfo selectedAppInfo = (ApplicationInfo) request.getAttribute(FrameworkConstants.REQ_APPINFO); 
    String projectCode = "";
    if (selectedAppInfo != null) {
        projectCode = selectedAppInfo.getCode();
    }
    String disabled = "disabled";
    if (StringUtils.isNotEmpty(fromPage)) {
%>
        <div class="page-header">
        	<h1 style="float: left;"><s:text name="label.editappln"/> - <%= selectedAppInfo.getName() %></h1>
        	<div class="icon_div">
				<a href="#" onclick="showProjectValidationResult();" title="Validate project">
					<img src="images/icons/validate_failure_icon.png" id="validationErr_validateProject" style="display: none;">
				</a>
				<a href="#" onclick="showProjectValidationResult();" title="Validate project">
					<img src="images/icons/validate_success_icon.png" id="validationSuccess_validateProject" style="display: none;">
				</a>
			</div>
        </div>
        
        <ul class="tabs">
            <li><a href="#" class="unselected" name="appTabs" id="appinfo"><s:text name="label.editappln.appinfo"/></a></li>
            <li><a href="#" class="unselected" name="appTabs" id="features"><s:text name="label.editappln.feature"/></a></li>
            <li><a href="#" class="unselected" name="appTabs" id="code"><s:text name="label.editappln.code"/></a></li>
            <li><a href="#" class="unselected" name="appTabs" id="configuration"><s:text name="label.editappln.confign"/></a></li>
            <li><a href="#" class="unselected" name="appTabs" id="buildView"><s:text name="label.editappln.build"/></a></li>
            <li><a href="#" class="unselected" name="appTabs" id="quality"><s:text name="label.editappln.quality"/></a></li>
            <li><a href="#" class="unselected" name="appTabs" id="ci"><s:text name="label.editappln.cntusintgrn"/></a></li>
            <li><a href="#" class="unselected" name="appTabs" id="veiwSiteReport"><s:text name="label.editappln.site.report"/></a></li>
            <li><a href="#" class="unselected" name="appTabs" id="download"><s:text name="label.editappln.download"/></a></li>
        </ul>
<%
    } else {
        disabled = "";
%>
        <div class="page-header">
            <h1>
                <s:text name="lbl.app.add"/> <small><span class="red">*</span> <s:text name="label.mandatory"/></small>
            </h1>
        </div>
        <ul class="tabs">
            <li><a href="#" class="unselected" name="appTabs" id="appinfo"><s:text name="label.addappln.appinfo"/></a></li>
            <li><a href="#" class="unselected" name="appTabs" id="features"><s:text name="label.addappln.feature"/></a></li>
        </ul>
<%  } %>

<form id="formApplication"> 
	<input type="hidden" id="fromPage" value="<%= fromPage %>" name="fromPage"/>
	<input type="hidden" id="projectCode" value="<%= projectCode %>" name="projectCode"/>
</form>
<!--  Heading Ends-->

<input type="hidden" name="alreadyConstructed" id="alreadyConstructed" value="">
<input type="hidden" id="pilotServerConfigDet">
<input type="hidden" id="pilotDbConfigDet">

<div class="tabDiv appInfoTabDiv" id="tabDiv">
</div>

<script type="text/javascript">
	$(".appInfoTabDiv").css("padding-top", "0px");
	
    var isCiRefresh = false; // for ci page use
    
	$(document).ready(function() {
		// When project is loaded, project related validation has to be loaded
		bacgroundValidate("validateProject", '<%= projectCode %>');

		<%
			if (session.getAttribute(projectCode + FrameworkConstants.SESSION_PRJT_VLDT_STATUS) != null) {
				String projectValidationStatus = (String)session.getAttribute(projectCode + FrameworkConstants.SESSION_PRJT_VLDT_STATUS);
				if (projectValidationStatus == "ERROR") {
		%>
					$("#validationSuccess_validateProject").css("display", "none");
					$("#validationErr_validateProject").show();
	    <%		} else { %>
	    			$("#validationErr_validateProject").hide();
	    			$("#validationSuccess_validateProject").css("display", "block");
	   	<% 		}
			}
	   	%>
		
        var selectedTab = "appinfo";
        $("#validationDiv").hide();	
		performAction(selectedTab, $('#formApplication'), $("#tabDiv"), '', getCustomerIdAsParam());
		
        $("a[name='appTabs']").click(function() {
        	var selectedTab = $(this).attr("id");
        	// the below code is to hide the project validation icon for specific tabs
        	var alreadySelectedTab = $(this).attr("class");
        	if ($.trim(alreadySelectedTab) != "selected" || $.trim(selectedTab) == "configuration" || $.trim(selectedTab) == "ci") {
        		bacgroundValidate("validateProject", $('#projectCode').val());
        		
        		/* Loading icon & selected tab should be enabled only if we click another tab */
        		if (alreadySelectedTab != selectedTab) {
        			if(selectedTab != "features"){
        				changeStyle(selectedTab);        				
        			}
					showLoadingIcon();
				}
        		if (selectedTab == "features") {
        			performAction(selectedTab, $('#formAppInfo'), $("#tabDiv"));
    			} else {
    				performAction(selectedTab, $('#formApplication'), $("#tabDiv"));    				
    			}
        	}
        });
    });

    function changeStyle(selectedTab) {
        $("a[name='appTabs']").attr("class", "unselected");
        $("a[id='" + selectedTab + "']").attr("class", "selected");
    }
    
    /* To show the validation result */
	function showProjectValidationResult() {
    	$("#popup_div").empty();
		$('#popup_div').show().css("display", "block"); 
		disableScreen();		
		popup('showProjectValidationResult', '', $('#popup_div')); // there was xtra param here
	}
    
	// To reload the appinfo page based on the customer when the customer is changed
	function reloadCurrentPage() {
		performAction('appinfo', $('#formApplication'), $("#tabDiv"), '', getCustomerIdAsParam());
	}
</script>