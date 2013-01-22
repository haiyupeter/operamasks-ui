package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;

public class ChangeUrlSuggestionServlet extends HttpServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        doPost(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
    	String type = request.getParameter("method");
    	String country = request.getParameter("country");
    	country = StringUtils.isBlank(country)?"china":country;
        String key=request.getParameter("key");
        int size=new Random().nextInt(10)+5;
        JSONArray data=new JSONArray();
        for(int i=0;i<size;i++){
            data.add(buildPerson(new Random().nextInt(10)+5,key+"_"+i+"_"+country));
        }
        if(StringUtils.equals(type, "delaytype")){
	        try {
				Thread.sleep(5000);
			} catch (InterruptedException e) {
				System.out.println("delay interrupted");
			}
        }
        JSONObject result=new JSONObject();
        result.put("valueField", "text");
        result.put("data", data);
        response.reset();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write(result.toString());
        writer.flush();
    }
    
    private JSONObject buildPerson(int count,String text){
        JSONObject result=new JSONObject();
        result.put("text", text);
        result.put("count", count);
        return result;
    }
}
