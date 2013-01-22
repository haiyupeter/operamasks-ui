package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class OmCascadeComboServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        doPost(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JSONArray result=new JSONArray();
        String province=request.getParameter("province");
        if(province==null){
            result.add(buildCity("none","请先选择省份/州"));
        }else if(province.equals("gd")){
            result.add(buildCity("shenzhen","深圳"));
            result.add(buildCity("guangzhou","广州"));
        }else if(province.equals("gx")){
            result.add(buildCity("nanning","南宁"));
            result.add(buildCity("guilin","桂林"));
        }else if(province.equals("hawaii")){
            result.add(buildCity("Hawaii","夏威夷岛"));
            result.add(buildCity("Maui","毛伊岛"));
            result.add(buildCity("Lanai","拉奈岛"));
        }else if(province.equals("florida")){
            result.add(buildCity("Jacksonville","杰克逊维尔"));
            result.add(buildCity("Miami","迈阿密"));
            result.add(buildCity("Tampa","坦帕"));
            result.add(buildCity("Fort Lauderdale","罗德岱堡"));
        }
        
        response.reset();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write(result.toString());
        writer.flush();
    }
    
    
    private JSONObject buildCity(String id,String name){
        JSONObject result=new JSONObject();
        result.put("value", id);
        result.put("text", name);
        return result;
    }
    
    
}
