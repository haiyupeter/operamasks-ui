package org.operamasks.test;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class OmTestServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html");
		
		String method = request.getParameter("method");
		if("combo4".equals(method)) {
			combo4(request, response);
		}
		
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		this.doPost(req, resp);
	}
	

	protected void combo4(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			System.out.println("***************延迟被打搅*******************");
		}
	    
		PrintWriter writer = response.getWriter();
        String records = "[{\"text\":\"Google\",\"name\":\"apusic\",\"value\":\"1\"},{\"text\":\"baidu\",\"name\":\"kingdee\",\"value\":\"2\"}]";
        writer.write(records);
		
	}
	

}
