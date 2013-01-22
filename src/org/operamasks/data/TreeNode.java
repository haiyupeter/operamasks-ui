package org.operamasks.data;

public class TreeNode {

	private String id;
	private String pid;
	private String text;
	private boolean hasChildren;
	private boolean expanded;
	
	public TreeNode(String id,String pid,String text,boolean expanded){
		this.id = id;
		this.pid = pid;
		this.text = text;
		this.expanded = expanded;
	}
	
	public TreeNode(String id, String text){
		this.id=id;
		this.text=text;
	}
	
	public TreeNode(String id, String pid, String text){
		this.id = id;
		this.pid = pid;
		this.text = text;
	}
	
	public TreeNode(String id, String text, boolean expanded,boolean hasChildren){
		this.id = id;
		this.expanded = expanded;
		this.text = text;
		this.hasChildren = hasChildren;
	}
	

	public boolean isHasChildren() {
		return hasChildren;
	}

	public void setHasChildren(boolean hasChildren) {
		this.hasChildren = hasChildren;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Boolean getExpanded() {
		return expanded;
	}
	public void setExpanded(Boolean expanded) {
		this.expanded = expanded;
	}
	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		if(obj==null||!(obj instanceof TreeNode))
			return false;
		TreeNode ob =(TreeNode)obj;
		return this.id.equals(ob.id);
	}
	
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return this.id.hashCode();
	}
	
}
