package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.operamasks.data.Organization;
import org.operamasks.data.OrganizationServiceImpl;
import org.operamasks.data.User;
import org.operamasks.data.UserServiceImpl;
import org.operamasks.model.GridDataModel;

public class F7Servlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse response)
            throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        String q=req.getParameter("q");
        String data=null;
        if(q==null){
            //omTree的数据源
            List<Organization> orgs = new OrganizationServiceImpl().findAll();
            data=JSONArray.fromObject(orgs).toString();
        }else{
            //omGrid的数据源
            String orgId=req.getParameter("orgId");
            List<User> users = new UserServiceImpl().query(orgId, q);
            GridDataModel<User> model = new GridDataModel<User>();
            model.setTotal(users.size());
            model.setRows(users);
            data=JSONObject.fromObject(model).toString();
        }
        response.reset();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write(data);
        writer.flush();
    }
}
