package com.photon.helios.uiconstants;

import java.lang.reflect.Field;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class NodeJsConstants {

	private Log log = LogFactory.getLog("NodeJsConstants");
	
	private String nodeJsArchetypeName = "nodeJsArchetypeName";
	private String nodeJsArchetypeDesc = "nodeJsArchetypeDesc";
	private String nodeJsArchetypeAppCode = "nodeJsArchetypeAppCode";
	private String technologyValue = "technologyValue";
	private String nodeJsEditApp = "nodeJsEditApp";



	public NodeJsConstants() {
		try {
			ReadXMLFile readXml = new ReadXMLFile();
			readXml.loadNodeJsWebServiceConstants();
			Field[] arrayOfField = this.getClass().getDeclaredFields();
			for (Field field : arrayOfField) {
				field.setAccessible(true);
				Object localObject = field.get(this);
				if (localObject instanceof String) {
					field.set(this, readXml.getValue((String) localObject));
				}
			}
		} catch (Exception localException) {
			log.info("NodeJsConstants::"+localException.getMessage());
		}
	}


	public String getNodeJsArchetypeName() {
		return nodeJsArchetypeName;
	}

	public void setNodeJsArchetypeName(String nodeJsArchetypeName) {
		this.nodeJsArchetypeName = nodeJsArchetypeName;
	}

	public String getNodeJsArchetypeDesc() {
		return nodeJsArchetypeDesc;
	}

	public void setNodeJsArchetypeDesc(String nodeJsArchetypeDesc) {
		this.nodeJsArchetypeDesc = nodeJsArchetypeDesc;
	}

	public String getNodeJsArchetypeAppCode() {
		return nodeJsArchetypeAppCode;
	}

	public void setNodeJsArchetypeAppCode(String nodeJsArchetypeAppCode) {
		this.nodeJsArchetypeAppCode = nodeJsArchetypeAppCode;
	}

	public String getTechnologyValue() {
		return technologyValue;
	}

	public void setTechnologyValue(String technologyValue) {
		this.technologyValue = technologyValue;
	}

	public String getNodeJsEditApp() {
		return nodeJsEditApp;
	}

	public void setNodeJsEditApp(String nodeJsEditApp) {
		this.nodeJsEditApp = nodeJsEditApp;
	}

	
	}