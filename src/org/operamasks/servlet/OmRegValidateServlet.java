package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class OmRegValidateServlet extends HttpServlet {
    
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
    	String method = request.getParameter("method");
    	response.reset();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
    	if(StringUtils.isBlank(method)){
    		String usernameObj = request.getParameter("username");
    		String txtEmailObj = request.getParameter("txtEmail");
    		if(usernameObj != null){
    			writer.write(Boolean.toString(!"admin".equalsIgnoreCase(usernameObj)));
    		}
    		if(txtEmailObj != null){
    			writer.write(Boolean.toString(!"admin@apusic.com".equalsIgnoreCase(txtEmailObj)));
    		}
	        writer.flush();
    	}
    }
}
