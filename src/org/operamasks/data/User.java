package org.operamasks.data;

import java.io.Serializable;

public class User implements Serializable {
    private String orgId;
    private int userid;
    private String username;
    private String sex;

    
    public User() {
        super();
    }

    public User(String orgId, int userid, String username, String sex) {
        super();
        this.orgId = orgId;
        this.userid = userid;
        this.username = username;
        this.sex = sex;
    }

    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }
}
