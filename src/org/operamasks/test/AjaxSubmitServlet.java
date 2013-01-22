package org.operamasks.test;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AjaxSubmitServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html");
		PrintWriter writer = response.getWriter();
		
		String method = request.getParameter("method");
		if("target".equals(method)) {
		    writer.write("目标区域已更新");
		}else if("sayHello".equals(method)) {
            writer.write("来自服务器端的消息");
        }else if("testMethod".equals(method)) {
            writer.write("method为 " + request.getMethod());
        }else if("giveMeScript".equals(method)) {
            writer.write("alert('script from server');");
        }else if("upload".equals(method)) {
            System.out.println(11);
        }else if("testType".equals(method)) {
            writer.write("type为POST;");
        }
		
	}
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	    String method = request.getParameter("method");
	    if("testType".equals(method)) {
	        request.setCharacterEncoding("UTF-8");
	        response.setCharacterEncoding("utf-8");
	        response.setContentType("text/html");
	        PrintWriter writer = response.getWriter();
            writer.write("type为GET");
        }else{
            this.doPost(request, response);
        }
	}
}
