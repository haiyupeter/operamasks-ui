package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.operamasks.data.Staff;
import org.operamasks.data.StaffServiceImpl;
import org.operamasks.model.GridDataModel;

public class OmComplexGridServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html");
		
		PrintWriter writer = response.getWriter();

		List<Staff> staff = StaffServiceImpl.query(Integer.valueOf(request.getParameter("start")) , 
								Integer.valueOf(request.getParameter("limit")));
		
		GridDataModel<Staff> model = new GridDataModel<Staff>();
		model.setTotal(StaffServiceImpl.getTotal());
		model.setRows(staff);
		
		writer.write(JSONObject.fromObject(model).toString());
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req , resp);
	}
	
}
