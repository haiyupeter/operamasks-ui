package org.operamasks.data;

import java.io.Serializable;
import java.util.List;

public class Organization implements Serializable {
    private String parentId;
    private String id;
    private String text;
    private List<Organization> children;
    public String getParentId() {
        return parentId;
    }
    public void setParentId(String parentId) {
        this.parentId = parentId;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public Organization() {
        super();
    }
    public Organization(String parentId, String id, String name) {
        super();
        this.parentId = parentId;
        this.id = id;
        this.text = name;
    }
    public List<Organization> getChildren() {
        return children;
    }
    public void setChildren(List<Organization> children) {
        this.children = children;
    }
    
}
