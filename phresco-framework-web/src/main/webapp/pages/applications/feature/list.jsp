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

<%@ page import="java.util.List" %>

<%@ page import="org.apache.commons.collections.CollectionUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils"%>

<%@ page import="com.google.gson.Gson"%>

<%@ page import="com.photon.phresco.commons.FrameworkConstants" %>
<%@ page import="com.photon.phresco.commons.model.ArtifactGroup"%>
<%@ page import="com.photon.phresco.commons.model.ArtifactInfo"%>
<%@ page import="com.photon.phresco.commons.model.ApplicationInfo"%>
<%@ page import="com.photon.phresco.commons.model.ProjectInfo"%>
<%@ page import="com.photon.phresco.commons.model.ArtifactGroup.Type"%>
<%@ page import="com.photon.phresco.commons.model.CoreOption"%>

<%
	Gson gson = new Gson();
	String techId = (String) request.getAttribute(FrameworkConstants.REQ_TECHNOLOGY);
	String appId = (String) request.getAttribute(FrameworkConstants.REQ_APP_ID);
	List<ArtifactGroup> artifactGroups = (List<ArtifactGroup>)request.getAttribute(FrameworkConstants.REQ_FEATURES_MOD_GRP);
	String type = (String) request.getAttribute(FrameworkConstants.REQ_FEATURES_TYPE);
	if (CollectionUtils.isNotEmpty(artifactGroups)) {
		for (ArtifactGroup artifactGroup : artifactGroups) {
		    List<CoreOption> coreOptions = artifactGroup.getAppliesTo();
		    boolean canConfigure = false;
		    for (CoreOption coreOption : coreOptions) {
		        if (coreOption.getTechId().equals(techId) && !coreOption.isCore()) {
		            canConfigure = true;
		            break;
		        }
		    }
		    if (Type.COMPONENT.equals(artifactGroup.getType())) {
		        canConfigure = true;
		    }
		    String artifactGrpName = artifactGroup.getName().replaceAll("\\s","");
%>
		<div  class="accordion_panel_inner">
		    <section class="lft_menus_container">	
				<span class="siteaccordion">
					<span>
						<input class="feature_checkbox" type="checkbox" canConfigure="<%= canConfigure %>" value="<%= artifactGroup.getName() %>" id="checkAll1"/>
						<a style="float: left; margin-left:2%;" href="#"><%= artifactGroup.getName() %></a>
						
						<select class="input-mini features_ver_sel" id="<%= artifactGrpName %>" moduleId="<%= artifactGroup.getId() %>" name="<%=artifactGroup.getName() %>" >
							<%
								List<ArtifactInfo> artifactInfos = artifactGroup.getVersions();
								for (ArtifactInfo artifactInfo : artifactInfos) {
							%>
									<option value="<%= artifactInfo.getId() %>"><%= artifactInfo.getVersion() %></option>
							<% } %>
							<div style="clear: both;"></div>
						</select>
					</span>
				</span>
				<div class="mfbox siteinnertooltiptxt">
					<%
						String desc = artifactGroup.getDescription();
						if (StringUtils.isNotEmpty(desc)) {
					%>
					    <div class="scrollpanel">
				        <section class="scrollpanel_inner">
							<img style="float: left;" class="headerlogoimg" src="images/right1.png" alt="logo">
							<p class="version_des">
								<%= desc %>
							</p>
						</section>
				    </div>
				    <%} %>
				</div>
			</section>
		</div>
<% 
		}
	} else {
%>
		<div class="alert alert-block">
			<s:text name='lbl.err.msg.list.features'/>
		</div>
<%		
	}
%>

<script type="text/javascript">
	$(document).ready(function() {
		hideLoadingIcon();//To hide the loading icon
		accordion();
		getDefaultFeatures();
		hideProgressBar();
	});
	
	//To get the dependent features
	$("input:checkbox").click(function() {
		var jsonObjectParam = {};
		var jsonObject = <%= gson.toJson(artifactGroups) %>;
		jsonObjectParam.artifactGroups = jsonObject;
		var selectedValue = $(this).val();	
		var moduleId = $("select[name='"+ selectedValue + "']").val();
		jsonObjectParam.moduleId = moduleId;
		var jsonString = JSON.stringify(jsonObjectParam);
		loadJsonContent("fetchDependentFeatures", jsonString, '', '', true);
	});

	//To get the default features
	function getDefaultFeatures() {
		var jsonObjectParam = {};
		var jsonObject = <%= gson.toJson(artifactGroups) %>;
		jsonObjectParam.artifactGroups = jsonObject;
		var jsonString = JSON.stringify(jsonObjectParam);
		loadJsonContent("fetchDefaultFeatures", jsonString, '', '', true);
	}
	
	//To check the Features and the corressponding version
	function makeFeaturesSelected(defaultModules, depArtifactInfoIds) {
		for (i in defaultModules) {  //To check the default feature
			$("input:checkbox[value='" + defaultModules[i] + "']").attr('checked', true);
		}
		for (i in defaultModules) {  //To select the default version
			var featureName = defaultModules[i];
			$("select[name='"+ featureName + "'] option").each(function() {
				var currentVal = $(this).val();
				if (($.inArray(currentVal, depArtifactInfoIds)) > -1) {
					$(this).attr("selected", "selected");
					return false;
				}
			});
		}
		clickToAdd();
	}
</script>