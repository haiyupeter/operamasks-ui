package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class OmButtonServlet extends HttpServlet {
    
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
    		String userName=request.getParameter("userName");
	        writer.write(Boolean.toString(!"admin".equalsIgnoreCase(userName)));
	        writer.flush();
    	}else if("remotetest".equals(method)){
    		String userName1=request.getParameter("userName1");
	        if(StringUtils.isBlank(userName1)){
	        	writer.write("0");
	        }else{
		        if("admin".equalsIgnoreCase(userName1)){
		        	writer.write("showError(\""+userName1+"\")");
		        }else{
		        	writer.write("1");
		        }
	        }
	        writer.flush();
    	}else if("taobao".equals(method)){
    		String code=request.getParameter("code");
	        if(StringUtils.isBlank(code)){
	        	writer.write("0");
	        }else{
		        if(!"uebd".equalsIgnoreCase(code)){
		        	writer.write("showCodeError()");
		        }else{
		        	writer.write("1");
		        }
	        }
	        writer.flush();
    	}/*else if("formValidate".equals(method)){
    		String fileNo=request.getParameter("fileNo");
    		if(StringUtils.isBlank(fileNo)){
 	        	writer.write(Boolean.toString(false));
 	        }else{
 		        if("001".equalsIgnoreCase(fileNo)){
 		        	writer.write(Boolean.toString(false));
 		        }else{
 		        	writer.write(Boolean.toString(true));
 		        }
 	        }
 	        writer.flush();
    	}*/else if("formValidateSubmit".equals(method)){
    		String userNo=request.getParameter("userNo");
	        if(StringUtils.isBlank(userNo)){
	        	writer.write("0");
	        }else{
		        if(!userNo.startsWith("ZGBH")){
		        	writer.write("showCodeError()");
		        }else{
		        	writer.write("1");
		        }
	        }
	        writer.flush();
    	}else if("getFileNo".equals(method)){
    	    String fileNo = "DABH-";
    	    Random ra = new Random();
    	    fileNo += ra.nextInt(100000);
    	    writer.write(fileNo);
    	    writer.flush();
    }
    }
}
