package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class OmComboServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        doPost(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JSONArray result=new JSONArray();
        result.add(buildPerson("001","张三"));
        result.add(buildPerson("002","李四"));
        result.add(buildPerson("003","王五"));
        result.add(buildPerson("004","赵六"));
        
        try {
			Thread.sleep(3000);
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
    
    
    private JSONObject buildPerson(String id,String name){
        JSONObject result=new JSONObject();
        result.put("value", id);
        result.put("text", name);
        return result;
    }
    
    
}
