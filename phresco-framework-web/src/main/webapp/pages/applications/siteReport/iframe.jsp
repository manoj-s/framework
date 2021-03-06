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
  
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.photon.phresco.commons.FrameworkConstants"%>

<%
	String siteReportPath = (String)request.getAttribute(FrameworkConstants.REQ_SITE_REPORT_PATH);
	if (StringUtils.isEmpty(siteReportPath)) {
%>
		<div class="alert alert-block">
			<s:text name='site.report.not.available'/>
		</div>
		
<% } else { %>
		<iframe src="<%= siteReportPath %>" frameBorder="0" class="iframe_container" id="siteReportIframe"></iframe>
<% } %>

<script>
	<% if (StringUtils.isNotEmpty(siteReportPath)) { %>
			$("#site_report").css("background", "#FFFFFF");
	<% } %>
	$(document).ready(function () {
		enableScreen();
		
		$(".styles").click(function() {
			$("#siteReportIframe").attr({
	            src: '<%= siteReportPath %>'
	        });
		});
	});
</script>