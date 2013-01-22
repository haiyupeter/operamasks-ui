package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class OmMenuServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        doPost(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JSONArray result=new JSONArray();
        JSONArray result1=new JSONArray();
        result1.add(buildPerson("002001","节点二一","false","images/calendar.gif","false",null));
        result1.add(buildPerson("002002","节点二二","","","false",null));
        
        result.add(buildPerson("001","节点一","false","","false",null));
        result.add(buildPerson("002","节点二","false","images/calendar.gif","false",result1));
        
        
        try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
        
        response.reset();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write(result.toString());
        writer.flush();
    }
    
    
    private JSONObject buildPerson(String id,String label,String disabled ,String icon, String seperator,JSONArray children){
        JSONObject result=new JSONObject();
        result.put("id", id);
        result.put("label", label);
        result.put("disabled", disabled);
        result.put("seperator", seperator);
        result.put("icon", icon);
        result.put("children", children);
        return result;
    }
    
    
}
