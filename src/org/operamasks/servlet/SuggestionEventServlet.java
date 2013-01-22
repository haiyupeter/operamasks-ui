package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

public class SuggestionEventServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        doPost(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
        String key = request.getParameter("key");
        if(key.equals("e")){
            throw new ServletException("处理异常");
        }
        try {
            if(key.equals("t")){
                Thread.sleep(3000);
            }else{
                Thread.sleep(1500);
            }
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        JSONArray result=new JSONArray();
        int size=new Random().nextInt(10)+5;
        for(int i=0;i<size;i++){
            result.add(key+"_"+i);
        }
        response.reset();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write(result.toString());
        writer.flush();
    }
}
