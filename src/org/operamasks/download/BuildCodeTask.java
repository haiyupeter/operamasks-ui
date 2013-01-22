package org.operamasks.download;

import java.io.File;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.taskdefs.Concat;
import org.apache.tools.ant.taskdefs.Copy;
import org.apache.tools.ant.taskdefs.Java;
import org.apache.tools.ant.taskdefs.Zip;
import org.apache.tools.ant.types.FileList;
import org.apache.tools.ant.types.FileList.FileName;
import org.apache.tools.ant.types.FileSet;

public class BuildCodeTask extends Task {

	private String basePath;

	private List<Resource> orderlyResouces;

	private String yuiJar;

	private String sequenceFolder;
	
	private String theme;

	public void execute() throws BuildException {
		Project prj = new Project();
		// 打包后的压缩文件
		File zipFile = new File(sequenceFolder + "/operamasks-ui.zip");
		if (zipFile.exists()) {
			return;
		}
		// 代码合并后的JS文件
		File concatJsFile = new File(sequenceFolder + "/operamasks-ui.js");
		// 代码合并且压缩后的JS文件
		File concatJsMinFile = new File(sequenceFolder + "/operamasks-ui.min.js");
		
		// 代码合并后的CSS文件
		File concatCssFile = new File(sequenceFolder + "/themes/"+theme+"/operamasks-ui.css");
		// 代码合并且压缩后的CSS文件
		File concatCssMinFile = new File(sequenceFolder + "/themes/"+theme+"/operamasks-ui.min.css");

		// 合并多个JS文件
		Concat concat = new Concat();
		FileList fl = new FileList();
		FileName f = new FileName();
		for (Resource r : orderlyResouces) {
			if (r.isIncluded() && r.getJsFile() != null) {
				f = new FileName();
				f.setName(basePath + r.getJsFile());
				fl.addConfiguredFile(f);
			}
		}
		if (fl.size() == 0) {
			return;
		}

		concat.addFilelist(fl);
		concat.setDestfile(concatJsFile);
		concat.setEncoding("UTF-8");
		concat.execute();

		// 压缩JS文件
		Java j = new Java();
		j.setJar(new File(basePath + yuiJar));
		j.setProject(prj);
		j.setFork(true);
		StringBuilder args = new StringBuilder();
		args.append(concatJsFile);
		args.append(" --charset UTF-8");
		args.append(" -o");
		args.append(" " + concatJsMinFile.getPath());
		j.setArgs(args.toString());
		j.execute();
		
		// 拷贝jquery.js文件
//		Copy c = new Copy();
//		c.setProject(prj);
//		c.setFile(new File(basePath + "/jquery.js"));
//		c.setTofile(new File(sequenceFolder + "/jquery.js"));
//		c.execute();
		
		// 合并多个CSS文件
		concat = new Concat();
		fl = new FileList();
		f = new FileName();
		// 添加om-theme.css
		f.setName(basePath + "/themes/"+theme+"/om-theme.css");
		fl.addConfiguredFile(f);
		
		// 添加主题样式的图片
		Copy c = new Copy();
		c.setProject(prj);
		FileSet srcDir = new FileSet();
		srcDir.setDir(new File(basePath + "/themes/"+theme+"/images/"));
		srcDir.setIncludes("*.*");
		c.setTodir(new File(sequenceFolder + "/themes/"+theme+"/images/"));
		c.addFileset(srcDir);
		c.execute();
		
		for (Resource r : orderlyResouces) {
			if (r.isIncluded() && r.getCssFile() != null) {
				f = new FileName();
				f.setName(basePath + r.getCssFile().replace("{theme}", theme));
				fl.addConfiguredFile(f);
				if(r.getImgDir() != null){
					// 添加组件样式的图片
					c = new Copy();
					c.setProject(prj);
					srcDir = new FileSet();
					srcDir.setDir(new File(basePath + r.getImgDir().replace("{theme}", theme)));
					srcDir.setIncludes("*.*");
					c.setTodir(new File(sequenceFolder + r.getImgDir().replace("{theme}", theme)));
					c.addFileset(srcDir);
					c.execute();
				}
			}
//			if (r.isIncluded() && r.getSample() != null){
//				// 添加组件示例页面
//				c = new Copy();
//				c.setProject(prj);
//				c.setFile(new File(basePath + r.getSample()));
//				// 用资源的ID作为文件名
//				c.setTofile(new File(sequenceFolder + "/sample/" + r.getId() + ".html"));
//				c.execute();
//			}
		}

		
		concat.addFilelist(fl);
		concat.setDestfile(concatCssFile);
		concat.setEncoding("UTF-8");
		concat.execute();
		
		// 压缩CSS文件
		j = new Java();
		j.setJar(new File(basePath + yuiJar));
		j.setProject(prj);
		j.setFork(true);
		args = new StringBuilder();
		args.append(concatCssFile);
		args.append(" --charset UTF-8");
		args.append(" -o");
		args.append(" " + concatCssMinFile.getPath());
		j.setArgs(args.toString());
		j.execute();

		// 打包文件
		Zip zipTask = new Zip();
		zipTask.setProject(prj);
		zipTask.setBasedir(new File(sequenceFolder));
		zipTask.setDestFile(zipFile);
		zipTask.execute();
	}

	public String getBasePath() {
		return basePath;
	}

	public void setBasePath(String basePath) {
		this.basePath = basePath;
	}
	
	public List<Resource> getOrderlyResouces() {
		return orderlyResouces;
	}

	public void setOrderlyResouces(List<Resource> orderlyResouces) {
		this.orderlyResouces = orderlyResouces;
	}

	public String getYuiJar() {
		return yuiJar;
	}

	public void setYuiJar(String yuiJar) {
		this.yuiJar = yuiJar;
	}

	public String getSequenceFolder() {
		return sequenceFolder;
	}

	public void setSequenceFolder(String sequenceFolder) {
		this.sequenceFolder = sequenceFolder;
	}

	public String getTheme() {
		return theme;
	}

	public void setTheme(String theme) {
		this.theme = theme;
	}
	
	
}
