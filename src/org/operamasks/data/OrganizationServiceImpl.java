package org.operamasks.data;

import java.util.ArrayList;
import java.util.List;

public class OrganizationServiceImpl {
    private static final Organization[] ORGANIZATIONS = new Organization[]{
       new Organization(null,"xz","行政部"),
       new Organization(null,"sc","市场部"),
       new Organization(null,"kf","客服部"),
       new Organization(null,"yx","营销部"),
       
       new Organization("xz","xzcw","财务部"),
       new Organization("xz","xzrl","人力资源部"),
       new Organization("xzrl","xzrlzp","招聘组"),
       new Organization("xzrl","xzrlpx","培训组"),
       new Organization("xzrl","xzrlxc","薪酬组"),
       
       new Organization("sc","scch","市场策划部"),
       new Organization("sc","scdy","市场调研部"),
       new Organization("sc","scgc","市场工程部"),
       
       new Organization("kf","kfqd","渠道客服部"),
       new Organization("kf","kfgr","个人客服部"),
       
       new Organization("yx","yxdb","东北区"),
       new Organization("yx","yxxb","西北区"),
       new Organization("yx","yxxn","西南区"),
       new Organization("yx","yxhd","华东区"),
       new Organization("yx","yxhn","华南区"),
       new Organization("yx","yxhz","华中区"),
       new Organization("yx","yxhw","海外区"),
   };
    
   //仅返回一级部门
   public List<Organization> findTopOrg(){
       List<Organization> orgs = new ArrayList<Organization>();
       for(Organization o:ORGANIZATIONS){
           if(o.getParentId()==null){
               orgs.add(o);
           }
       }
       return orgs;
   }
   
   //返回某部门下所有的子孙级部门
   public List<Organization> findByOrg(String parentOrgId) {
       List<Organization> orgs = new ArrayList<Organization>();
       if(parentOrgId==null){
           for(Organization o:ORGANIZATIONS){
               if(o.getParentId()==null){
                   orgs.add(o);
               }
           }
       }else{
           for(Organization o:ORGANIZATIONS){
               if(!o.getId().equals(parentOrgId) && parentOrgId.equals(o.getParentId())){
                   orgs.add(o);
               }
           }
       }
       return orgs;
   }
   
   //返回所有部门
   public List<Organization> findAll(){
       List<Organization> orgs=findByOrg(null);
       fillSubOrgs(orgs);
       return orgs;
   }
   
   public void fillSubOrgs(List<Organization> orgs){
       for(Organization org:orgs){
           List<Organization> subs=findByOrg(org.getId());
           fillSubOrgs(subs);
           org.setChildren(subs);
       }
   }
}
