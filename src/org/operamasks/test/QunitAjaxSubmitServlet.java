package org.operamasks.test;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class QunitAjaxSubmitServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	private static final String TYPE = "type";
	private static final String JSON = "json";
	private static final String SCRIPT = "script";
	private static final String XML = "xml";
	private static final String DOC_WITH_SCRIPTS = "doc-with-scripts";
	private static final String SCRIPT_TEXT = "script-text";

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("utf-8");
		
		String typeParam = request.getParameter(TYPE);
		if (typeParam != null && !"".equals(typeParam)) {
			if (JSON.equals(typeParam)) {
				response.setContentType("text/json");
				PrintWriter writer = response.getWriter();
				writer.write("{\"name\":\"jquery-test\"}");
			} else if (SCRIPT.equals(typeParam)) {
				response.setContentType("text/javascript");
				PrintWriter writer = response.getWriter();
				writer.write("formScriptTest = function(){}");
			} else if (XML.equals(typeParam)) {
				response.setContentType("text/xml");
				PrintWriter writer = response.getWriter();
				writer.write("<content><test /><test /><test /></content>");
			} else if (DOC_WITH_SCRIPTS.equals(typeParam)) {
				response.setContentType("text/html");
				PrintWriter writer = response.getWriter();
				writer.write("<div>content from server<script>var unitTestVariable1 = true;</script><script>var unitTestVariable2 = true;</script><script>if(typeof scriptCount == 'undefined') {var scriptCount = 1;} else {scriptCount ++};</script></div>");
			} else if (SCRIPT_TEXT.equals(typeParam)) {
				response.setContentType("text/json");
				PrintWriter writer = response.getWriter();
				writer.write("\"{\"name\":\"jquery-test\"}\"");
			}
		} else {
			response.setContentType("text/html");
			PrintWriter writer = response.getWriter();
			writer.write("Some text from server.");
		}
		
	}
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}
}
