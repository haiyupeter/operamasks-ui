package org.operamasks.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class ViewJavaSourceServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public ViewJavaSourceServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//从Socket读取一组数据
		String javaSrc = request.getParameter("src").toString();
		String filePath = request.getSession().getServletContext().getRealPath("/") + "/WEB-INF/classes/org/operamasks/" + javaSrc;
		InputStreamReader in;
		try {
			in = new InputStreamReader(new FileInputStream(new File(filePath)),"UTF-8");
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
			response.setCharacterEncoding("UTF-8");
			response.setContentType("text/plain; charset=UTF-8");
			response.getWriter().print("(⊙o⊙)，文件没有找到！");
			return;
		}
		StringBuffer requestStr = new StringBuffer(2048);
		int i;
		char[] buffer = new char[20480];
		try {
			i = in.read(buffer);
		} catch (IOException e) {
			e.printStackTrace();
			i = -1;
		} finally {
			if (in != null) {
				in.close();
			}
		}
		for (int j=0; j<i; j++) {
			requestStr.append(buffer[j]);
		}
		
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/plain; charset=UTF-8");
		response.getWriter().print(requestStr.toString());
	}

}
