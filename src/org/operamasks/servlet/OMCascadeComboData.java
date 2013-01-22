package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

import org.operamasks.data.Organization;
import org.operamasks.data.OrganizationServiceImpl;
import org.operamasks.data.User;
import org.operamasks.data.UserServiceImpl;


/**
 * 
 * 用于业务示例的动态combo示例
 *
 */
public class OMCascadeComboData extends HttpServlet{
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse response)
            throws ServletException, IOException {
		req.setCharacterEncoding("utf-8");
        String data=null; //要写到响应里的内容
        String topOrg=req.getParameter("topOrg");
        String subOrg=req.getParameter("subOrg");
        if(topOrg==null && subOrg==null){
            //要加载一级部门
            List<Organization> orgs = new OrganizationServiceImpl().findTopOrg();
            data=JSONArray.fromObject(orgs).toString();
        }else if(topOrg!=null){
            //选择了一级部门，现要在加载二级部门
            List<Organization> orgs = new OrganizationServiceImpl().findByOrg(topOrg);
            data=JSONArray.fromObject(orgs).toString();
        }else{
            //选择了二级部门，现在要加载用户
            List<User> users = new UserServiceImpl().findUsersByOrg(subOrg);
            
            //由于combo的数据的value中必须为字符串，而User对象的userid是int类型的，
            //所以使用下面的config用于把User对象转换为js中的JSON对象
            JsonConfig jsonConfig = new JsonConfig();   
            jsonConfig.registerJsonValueProcessor(User.class, new JsonValueProcessor() {
                public Object processArrayValue(Object value, JsonConfig jsonConfig) {
                    User u=(User)value;
                    return String.format("{\"userid\":'%d',\"username\":\"%s\"}",u.getUserid(),u.getUsername());
                }
                public Object processObjectValue(String key, Object value, JsonConfig jsonConfig) {
                    return value;
                }
            });
            data=JSONArray.fromObject(users,jsonConfig).toString();
        }
        
        response.reset();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write(data);
        writer.flush();
    }
}
