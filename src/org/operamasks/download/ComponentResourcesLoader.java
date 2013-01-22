package org.operamasks.download;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class ComponentResourcesLoader {

	private static ComponentResourcesLoader dataLoader;
	
	private List<Resource> orderlyResources = new ArrayList<Resource>();


	private Map<String, Component> componentList = new HashMap<String, Component>();


	public static ComponentResourcesLoader getInstance() {
		if (dataLoader == null)
			dataLoader = new ComponentResourcesLoader();
		return dataLoader;
	}

	private ComponentResourcesLoader() {
		initOrderlyResources();
		initComponentDependence();
	}
	
	private void initOrderlyResources(){
		String path = ComponentResourcesLoader.class.getClassLoader()
				.getResource("orderly-resources.xml").getFile();
		Document treeDocument = XMLHelper.read(path);
		Node root = treeDocument.getFirstChild();
		NodeList childNodes = root.getChildNodes();
		for (int i = 0; i < childNodes.getLength(); i++) {
			Node component = childNodes.item(i);
			if ("resource".equals(component.getNodeName())) {
				NodeList resChildren = component.getChildNodes();
				Resource r = new Resource();
				for (int j = 0; j < resChildren.getLength(); j++) {
					Node resChild = resChildren.item(j);
					if ("id".equals(resChild.getNodeName())) {
						r.setId(resChild.getTextContent());
					} else if ("js-file".equals(resChild.getNodeName())) {
						r.setJsFile(resChild.getTextContent());
					} else if ("css-file".equals(resChild.getNodeName())) {
						r.setCssFile(resChild.getTextContent());
					} else if ("img-dir".equals(resChild.getNodeName())) {
						r.setImgDir(resChild.getTextContent());
					} else if ("sample".equals(resChild.getNodeName())) {
						r.setSample(resChild.getTextContent());
					}
				}
				this.getOrderlyResources().add(r);
			}
		}
	}

	private void initComponentDependence() {
		String path = ComponentResourcesLoader.class.getClassLoader()
				.getResource("component-dependences.xml").getFile();
		Document treeDocument = XMLHelper.read(path);
		Node root = treeDocument.getFirstChild();
		NodeList childNodes = root.getChildNodes();
		for (int i = 0; i < childNodes.getLength(); i++) {
			Node component = childNodes.item(i);
			if ("component".equals(component.getNodeName())) {
				NodeList compChildren = component.getChildNodes();
				Component c = new Component();
				for (int j = 0; j < compChildren.getLength(); j++) {
					Node compChild = compChildren.item(j);
					if ("resource-id".equals(compChild.getNodeName())) {
						c.setResourceId(compChild.getTextContent());
					} else if ("depends".equals(compChild.getNodeName())) {
						if (c.getDepends() == null) {
							c.setDepends(new ArrayList<String>());
						}
						c.getDepends().add(compChild.getTextContent());
					}
				}
				this.getComponentList().put(c.getResourceId(), c);
			}
		}
	}
	

	public List<Resource> getOrderlyResources() {
		return orderlyResources;
	}

	public void setOrderlyResources(List<Resource> orderlyResources) {
		this.orderlyResources = orderlyResources;
	}
	

	public Map<String, Component> getComponentList() {
		return componentList;
	}

	public void setComponentList(Map<String, Component> componentList) {
		this.componentList = componentList;
	}
}
