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
package com.photon.phresco.framework.param.impl;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;

import com.photon.phresco.api.DynamicParameter;
import com.photon.phresco.commons.FrameworkConstants;
import com.photon.phresco.commons.model.ApplicationInfo;
import com.photon.phresco.exception.ConfigurationException;
import com.photon.phresco.exception.PhrescoException;
import com.photon.phresco.plugins.model.Mojos.Mojo.Configuration.Parameters.Parameter.PossibleValues;
import com.photon.phresco.plugins.model.Mojos.Mojo.Configuration.Parameters.Parameter.PossibleValues.Value;
import com.photon.phresco.util.Constants;
import com.photon.phresco.util.Utility;
import com.phresco.pom.exception.PhrescoPomException;
import com.phresco.pom.util.PomProcessor;

public class PerformanceTestResultNamesImpl implements DynamicParameter, Constants {

	@Override
	public PossibleValues getValues(Map<String, Object> paramMap) throws IOException, ParserConfigurationException, SAXException, ConfigurationException, PhrescoException {
		PossibleValues possibleValues = new PossibleValues();
		ApplicationInfo applicationInfo = (ApplicationInfo) paramMap.get(KEY_APP_INFO);
		String testAgainst = (String) paramMap.get(KEY_TEST_AGAINST);
		String testDirPath = getTestDirPath(applicationInfo.getAppDirName(), testAgainst);
		String dependencyStr = "";
		if ("database".equalsIgnoreCase(testAgainst)) {
			dependencyStr = "dbContextUrls";
		} else {
			dependencyStr = "contextUrls";
		}
		File file = new File(testDirPath);
		File[] testFiles = file.listFiles(new XmlNameFileFilter(FrameworkConstants.JSON));
		if (testFiles.length != 0) {
			for (File testFile : testFiles) {
				int lastDot = testFile.getName().lastIndexOf(".");
				String newFileName = testFile.getName().substring(0, lastDot); 
				Value value = new Value();
				value.setKey(newFileName);
				value.setValue(newFileName);
				value.setDependency(dependencyStr);
				possibleValues.getValue().add(value);
			}
		} else {
			Value value = new Value();
			value.setKey("");
			value.setValue("");
			possibleValues.getValue().add(value);
		}

		return possibleValues;
	}
	
	private String getTestDirPath(String AppDirName, String testAgainst) throws PhrescoException {
		StringBuilder builder = new StringBuilder(Utility.getProjectHome());
		try {
			PomProcessor processor = new PomProcessor(getPOMFile(AppDirName));
			String performDir = processor.getProperty(POM_PROP_KEY_PERFORMANCETEST_DIR);
			builder.append(AppDirName)
			.append(performDir)
			.append(File.separator)
			.append(testAgainst.toString())
			.append(FrameworkConstants.SLASH_JSON);
			return builder.toString();
		} catch (PhrescoPomException e) {
    		throw new PhrescoException(e); 
    	}
	}
	
	private File getPOMFile(String appDirName) {
        StringBuilder builder = new StringBuilder(Utility.getProjectHome())
        .append(appDirName)
        .append(File.separatorChar)
        .append(POM_NAME);
        return new File(builder.toString());
    }
	
	 public class XmlNameFileFilter implements FilenameFilter {
	        private String filter_;
	        public XmlNameFileFilter(String filter) {
	            filter_ = filter;
	        }

	        public boolean accept(File dir, String name) {
	            return name.endsWith(filter_);
	        }
	    }

}
