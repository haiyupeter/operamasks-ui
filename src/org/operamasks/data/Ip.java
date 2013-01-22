package org.operamasks.data;

import java.io.Serializable;

public class Ip implements Serializable{

	
	private int id;
	private String start;
	private String end;
	private String city;
	private String address;
	
	public Ip(int id, String start, String end, String city,
			String address) {
		super();
		this.id = id;
		this.start = start;
		this.end = end;
		this.city = city;
		this.address = address;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	public String getEnd() {
		return end;
	}
	public void setEnd(String end) {
		this.end = end;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	@Override
	public boolean equals(Object obj) {
	    if(obj==null || !(obj instanceof Ip)){
	        return false;
	    }
	    Ip other=(Ip) obj;
	    return this.id == other.id;
	}
	@Override
	public int hashCode() {
	    return new Integer(this.id).hashCode();
	}
	
}
