package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.operamasks.data.Catalog;
import org.operamasks.data.CatalogService;
import org.operamasks.model.GridDataModel;

public class OmGridAuthorityServlet extends HttpServlet {
	
	//添加、修改、删除时会执行doPost
	//查询和取数时会执行doGet，本代码中从doGet中转到此doPost方法处理
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html");
		request.setCharacterEncoding("UTF-8");
		
		String startStr = request.getParameter("start");
	    String limitStr = request.getParameter("limit");
	    
	    int start = Integer.parseInt(StringUtils.isBlank(startStr)?"0":startStr);
	    int limit = Integer.parseInt(StringUtils.isBlank(limitStr)?"20":limitStr);
	    if (limit == 0) {
	    	limit = Integer.MAX_VALUE;
	    }
		PrintWriter writer = response.getWriter();
		
		
		GridDataModel<Catalog> model = new GridDataModel<Catalog>();
        int end = start + limit;
        int total = CatalogService.catalogInfos.size();
        end = end > total ? total : end;
        if(start <= end) {
        	model.setRows(CatalogService.catalogInfos.subList(start, end));
        }
        model.setTotal(total);
        writer.write(JSONObject.fromObject(model).toString());
	}
	
	//查询和取数时会执行doGet，本代码中从doGet中转给doPost方法处理
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		this.doPost(req, resp);
	}
}
