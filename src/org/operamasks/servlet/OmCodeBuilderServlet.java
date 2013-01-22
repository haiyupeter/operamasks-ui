package org.operamasks.servlet;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.operamasks.download.BuildCodeTask;
import org.operamasks.download.Component;
import org.operamasks.download.ComponentResourcesLoader;
import org.operamasks.download.Resource;

public class OmCodeBuilderServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private ServletContext servletContext;
	public void init(ServletConfig config) throws ServletException {
		this.servletContext = config.getServletContext();
	}

	private List<Resource> initResource() {
		List<Resource> resources = new ArrayList<Resource>();
		List<Resource> orderlyResourcesSrc = ComponentResourcesLoader
				.getInstance().getOrderlyResources();
		for (Resource r : orderlyResourcesSrc) {
			resources.add(new Resource(r.getId(), r.getJsFile(), r.getCssFile(), r.getImgDir(), r.getSample()));
		}
		return resources;
	}
	
	private void markIncluded(String resourceId, List<Resource> orderlyResouces) {
		for (Resource r : orderlyResouces) {
			if (resourceId.equals(r.getId())) {
				r.setIncluded(true);
			}
		}
	}
	
	private String getSequenceFolder(List<Resource> orderlyResouces) {
		StringBuilder folder = new StringBuilder();
		for (Resource r : orderlyResouces) {
			folder.append(r.isIncluded() ? "1" : "0");
		}
		return folder.toString();
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String[] files = request.getParameterValues("files[]");
		String theme = (String)request.getParameter("theme");
		// 按优先级排序的JS资源文件列表
		List<Resource> orderlyResouces = this.initResource();
		InputStream in = BuildCodeTask.class.getClassLoader()
				.getResourceAsStream("build.properties");
		Properties prop = new Properties();
		try {
			prop.load(in);
		} catch (IOException e) {
			System.err.print("load build.properties fails.");
			e.printStackTrace();
		}
		// 代码打包后存放的路径
		String downPath = prop.getProperty("code.download.path");
		String yuiJar = prop.getProperty("build.yui.lib");
		// 代码的下载地址
		String downUrl = prop.getProperty("code.download.url");
		
		Map<String, Component> componentList = ComponentResourcesLoader.getInstance().getComponentList();
		// 标记需要合并的资源文件
		for (String fileId : files) {
			Component component = componentList.get(fileId);
			if (component != null) {
				markIncluded(component.getResourceId(),orderlyResouces);
				List<String> depends = component.getDepends();
				if (depends != null) {
					for (String depend : depends) {
						markIncluded(depend,orderlyResouces);
					}
				}
			}
		}
		// 根据需要下载的资源生成的序列码，需要下载用“1”表示，否则为“0”，前缀是主题皮肤的名称
		String sequenceFolder = theme + "-" + this.getSequenceFolder(orderlyResouces);
		File zipFile = new File(downPath + "/" + sequenceFolder + "/operamasks-ui.zip");
		if (!zipFile.exists()) {
			BuildCodeTask task = new BuildCodeTask();
			task.setBasePath(servletContext.getRealPath("/"));
			task.setYuiJar(yuiJar);
			task.setSequenceFolder(downPath + "/" + sequenceFolder);
			task.setOrderlyResouces(orderlyResouces);
			task.setTheme(theme);
			task.execute();
		}
		response.getWriter().write(downUrl + "/" + sequenceFolder + "/operamasks-ui.zip");
	}

}
