/*
 * ###
 * Phresco Framework
 * 
 * Copyright (C) 1999 - 2012 Photon Infotech Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ###
 */
package com.photon.phresco.framework;

import java.io.File;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

import com.photon.phresco.api.ConfigManager;
import com.photon.phresco.exception.PhrescoException;
import com.photon.phresco.framework.api.ApplicationManager;
import com.photon.phresco.framework.api.CIManager;
import com.photon.phresco.framework.api.ProjectAdministrator;
import com.photon.phresco.framework.api.ProjectManager;
import com.photon.phresco.framework.api.ProjectRuntimeManager;
import com.photon.phresco.framework.api.UpgradeManager;
import com.photon.phresco.service.client.api.ServiceContext;
import com.photon.phresco.service.client.api.ServiceManager;
import com.photon.phresco.service.client.factory.ServiceClientFactory;

public class PhrescoFrameworkFactory {

    private PhrescoFrameworkFactory(){
        //restrict initialization
    }

    //TODO:Can we read this from a property file?
    private static final String PROJECT_ADMINISTRATOR_IMPL = "com.photon.phresco.framework.impl.ProjectAdministratorImpl";
    private static final String PROJECT_RUNTIME_MANAGER_IMPL = "com.photon.phresco.framework.impl.ProjectRuntimeManagerImpl";
 
    private static final String PROJECT_MANAGER_IMPL = "com.photon.phresco.framework.impl.ProjectManagerImpl";
    private static final String APPLICATION_MANAGER_IMPL = "com.photon.phresco.framework.impl.ApplicationManagerImpl";
    private static final String CONFIG_MANAGER_IMPL = "com.photon.phresco.impl.ConfigManagerImpl";
    private static final String CI_MANAGER_IMPL = "com.photon.phresco.framework.impl.CIManagerImpl";
    private static final String UPDATE_MANAGER_IMPL = "com.photon.phresco.framework.impl.UpgradeManagerImpl";

    private static FrameworkConfiguration frameworkConfig = null;
    private static ProjectManager projectManager = null;
    private static ApplicationManager applicationManager = null;
    private static ConfigManager configManager = null;
    private static CIManager ciManager = null;
    private static UpgradeManager updateManager = null;

    private static ProjectAdministrator administrator = null;
    private static ProjectRuntimeManager runtimeManager = null;
    private static ServiceManager serviceManager = null;
    
    private static final String FRAMEWORK_CONFIG = "framework.config";

    public static FrameworkConfiguration getFrameworkConfig() throws PhrescoException {
        if(frameworkConfig == null) {
            frameworkConfig = new FrameworkConfiguration(FRAMEWORK_CONFIG);
        }

        return frameworkConfig;
    }
    
    //TODO: Need to remove ProjectAdministrator
    public static ProjectAdministrator getProjectAdministrator() throws PhrescoException {
        if (administrator == null) {
            administrator = (ProjectAdministrator) constructClass(PROJECT_ADMINISTRATOR_IMPL);
        }

        return administrator;
    }

    //TODO: Need to remove ProjectRuntimeManager
    public static ProjectRuntimeManager getProjectRuntimeManager() throws PhrescoException {
        if (runtimeManager == null) {
            runtimeManager = (ProjectRuntimeManager) constructClass(PROJECT_RUNTIME_MANAGER_IMPL);
        }

        return runtimeManager;

    }

    public static ProjectManager getProjectManager() throws PhrescoException {
        if (projectManager == null) {
        	projectManager = (ProjectManager) constructClass(PROJECT_MANAGER_IMPL);
        }

        return projectManager;
    }

    public static ApplicationManager getApplicationManager() throws PhrescoException {
        if (applicationManager == null) {
        	applicationManager = (ApplicationManager) constructClass(APPLICATION_MANAGER_IMPL);
        }

        return applicationManager;
    }

    /**
     * ConfigManager instance created and can't be single instance due to read more than one file
     * @param configFile
     * @return
     * @throws PhrescoException
     */
    public static ConfigManager getConfigManager(File configFile) throws PhrescoException {
    	return (ConfigManager) constructClass(CONFIG_MANAGER_IMPL, new Class[] {configFile.getClass() }, new Object[] { configFile });
    }

    
    public static CIManager getCIManager() throws PhrescoException {
        if (ciManager == null) {
            ciManager = (CIManager) constructClass(CI_MANAGER_IMPL);
        }

        return ciManager;
    }

    public static UpgradeManager getUpdateManager() throws PhrescoException {
        if (updateManager == null) {
        	updateManager = (UpgradeManager) constructClass(UPDATE_MANAGER_IMPL);
        }

        return updateManager;
    }
    
    public static ServiceManager getServiceManager(ServiceContext context) throws PhrescoException {
    	if (serviceManager == null) {
    		serviceManager = ServiceClientFactory.getServiceManager(context);
    	}
    	return serviceManager;
    }

    private static Object constructClass(String className) throws PhrescoException {
        try {
            @SuppressWarnings("rawtypes")
            Class clazz = Class.forName(className);
            return clazz.newInstance();
        } catch (ClassNotFoundException e) {
            throw new PhrescoException(e);
        } catch (InstantiationException e) {
            throw new PhrescoException(e);
        } catch (IllegalAccessException e) {
            throw new PhrescoException(e);
        }
    }
    
    /**
     * 
     * @param className
     * @param params
     * @param objects 
     * @return
     * @throws PhrescoException
     */
    private static Object constructClass(String className, @SuppressWarnings("rawtypes") Class[] params, Object[] paramValues) throws PhrescoException {
        try {
            Class<?> c = Class.forName(className);
            Constructor<?> constructor = c.getConstructor(params);
            return constructor.newInstance(paramValues);
        } catch (ClassNotFoundException e) {
            throw new PhrescoException(e);
        } catch (SecurityException e) {
            throw new PhrescoException(e);
        } catch (NoSuchMethodException e) {
            throw new PhrescoException(e);
        } catch (IllegalArgumentException e) {
            throw new PhrescoException(e);
        } catch (InstantiationException e) {
            throw new PhrescoException(e);
        } catch (IllegalAccessException e) {
            throw new PhrescoException(e);
        } catch (InvocationTargetException e) {
            throw new PhrescoException(e);
        }
    }
    
}