package org.operamasks.data;

import java.io.Serializable;

public class Catalog  implements Serializable{
	
	private String catalogId;
	private String catalogName;
	private String authority;
	
	public  Catalog(String catalogId , String catalogName , String authority){
		super();
		this.catalogId = catalogId;
		this.catalogName = catalogName;
		this.authority = authority;
	}
	
	public String getCatalogId() {
		return catalogId;
	}
	public void setCatalogId(String catalogId) {
		this.catalogId = catalogId;
	}
	public String getCatalogName() {
		return catalogName;
	}
	public void setCatalogName(String catalogName) {
		this.catalogName = catalogName;
	}
	public String getAuthority() {
		return authority;
	}
	public void setAuthority(String authority) {
		this.authority = authority;
	}
}
