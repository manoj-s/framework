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
  
<%@ taglib uri="/struts-tags" prefix="s" %>

<script type="text/javascript">
	$(document).ready(function() {
		clickMenu($("a[name='appTab']"), $("#subcontainer"));
		loadContent("appinfo", '', $("#subcontainer"));
		activateMenu($("#appinfo"));
	});
</script>

<nav>
	<ul class="tabs">
		<li>
			<a href="#" class="active" name="appTab" id="appinfo"><s:label key="lbl.app.menu.appinfo" theme="simple"/></a>
		</li>
		<li>
			<a href="#" class="inactive" name="appTab" id="features"><s:label key="lbl.app.menu.feature" theme="simple"/></a>
		</li>
		<li>
			<a href="#" class="inactive" name="appTab" id="code"><s:label key="lbl.app.menu.code" theme="simple"/></a>
		</li>
		<li>
			<a href="#" class="inactive" name="appTab" id="configuration"><s:label key="lbl.app.menu.config" theme="simple"/></a>
		</li>
		<li>
			<a href="#" class="inactive" name="appTab" id="buildView"><s:label key="lbl.app.menu.build" theme="simple"/></a>
		</li>
		<li>
			<a href="#" class="inactive" name="appTab" id="quality"><s:label key="lbl.app.menu.quality" theme="simple"/></a>
		</li>
		<li>
			<a href="#" class="inactive" name="appTab" id="ci"><s:label key="lbl.app.menu.ci"  theme="simple"/></a>
		</li>
		<li>
			<a href="#" class="inactive" name="appTab" id="veiwSiteReport"><s:label key="lbl.app.menu.report"  theme="simple"/></a>
		</li>
		<li>
			<a href="#" class="inactive" name="appTab" id="download"><s:label key="lbl.app.menu.download"  theme="simple"/></a>
		</li>
	</ul>
</nav>			

<section id="subcontainer" class="navTopBorder">

</section>