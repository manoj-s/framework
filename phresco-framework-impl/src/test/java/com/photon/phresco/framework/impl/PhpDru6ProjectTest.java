/**
 * Phresco Framework Implementation
 *
 * Copyright (C) 1999-2013 Photon Infotech Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.photon.phresco.framework.impl;

import java.util.ArrayList;
import java.util.List;

import junit.framework.Assert;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.photon.phresco.commons.model.ApplicationInfo;
import com.photon.phresco.commons.model.ProjectInfo;
import com.photon.phresco.exception.PhrescoException;
import com.photon.phresco.framework.PhrescoFrameworkFactory;
import com.photon.phresco.framework.api.ActionType;
import com.photon.phresco.framework.api.ApplicationManager;
import com.photon.phresco.framework.api.ProjectManager;

public class PhpDru6ProjectTest extends BaseTest{

	private List<ProjectInfo> appList=new ArrayList<ProjectInfo>();
	private static ProjectManager projectManager = null;
	private static ApplicationManager applicationManager = null;
	private List<ApplicationInfo> appInfos = new ArrayList<ApplicationInfo>();
	private List<String> appDirNames = new ArrayList<String>();
	private ProjectInfo projectInfo;
		
	@Before
	public void setUp() throws PhrescoException {
		ApplicationInfo appInfo = getAppInfo("PHP_DRUPAL6", "tech-phpdru6");
		appInfos.add(appInfo);
		appDirNames.add("PHP_DRUPAL6");
		projectInfo = getProjectInfo("tech-phpdru6", "tech-phpdru6" , "Sample-phpdru6-1" , "Sample-phpdru6-2", "PHR_phpdru6");
		if ((projectManager == null) && (applicationManager == null)) {
			projectManager = PhrescoFrameworkFactory.getProjectManager();
			applicationManager=PhrescoFrameworkFactory.getApplicationManager();
		}
	}
	
	@After
	public void tearDown() throws PhrescoException {
		boolean delete = projectManager.delete(appDirNames);
		Assert.assertTrue(delete);
	}
	
	@Test
	public void testCreatePhpDru6Project() throws PhrescoException {
		System.out.println("serviceManager :::: " + serviceManager.getCustomers());
		projectManager.create(projectInfo, serviceManager);
		appList = projectManager.discover(customerId);
		Assert.assertEquals(2, appList.size());
	}
	
//	@Test
//	public void testUpdateProject() throws PhrescoException {		
//		ProjectInfo update = projectManager.update(projectInfo, serviceManager);
//		System.out.println(update.getDescription());
//	}
	
//	@Test
	public void PerformActionTest() throws PhrescoException {
		System.out.println(projectInfo.getVersion());
//		applicationManager.performAction(projectInfo, ActionType.BUILD);
}
	
}
