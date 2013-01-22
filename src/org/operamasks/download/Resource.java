package org.operamasks.download;

public class Resource {
	private String id;
	private String jsFile;
	private String cssFile;
	private String imgDir;
	private String sample;
	private boolean included;
	public Resource(){
	}
	public Resource(String id, String jsFile, String cssFile, String imgDir, String sample){
		this.id = id;
		this.jsFile = jsFile;
		this.cssFile = cssFile;
		this.imgDir = imgDir;
		this.sample = sample;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getJsFile() {
		return jsFile;
	}
	public void setJsFile(String jsFile) {
		this.jsFile = jsFile;
	}
	public String getCssFile() {
		return cssFile;
	}
	public void setCssFile(String cssFile) {
		this.cssFile = cssFile;
	}
	public String getImgDir() {
		return imgDir;
	}
	public void setImgDir(String imgDir) {
		this.imgDir = imgDir;
	}
	
	public String getSample() {
		return sample;
	}
	public void setSample(String sample) {
		this.sample = sample;
	}
	public boolean isIncluded() {
		return included;
	}
	public void setIncluded(boolean included) {
		this.included = included;
	}
	
	
}
