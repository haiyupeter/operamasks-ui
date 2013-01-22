package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.operamasks.data.Column;
import org.operamasks.data.ColumnService;
import org.operamasks.data.Ip;
import org.operamasks.data.IpService;
import org.operamasks.model.GridDataModel;

public class OmGridServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html");
		
		String method = request.getParameter("method");
		if("fast".equals(method)) {
		    fast(request, response);
		} else if("lazy".equals(method)) {
		    lazy(request, response);
		} else if("lazyTotal".equals(method)) {
		    lazyTotal(request, response);
		} else if("block".equals(method)){
			block(request, response);
		} else if("empty".equals(method)){
			empty(request, response);
		} else if("filter".equals(method)){
			filterByCity(request, response);
		}else if("coldata".equals(method)){
			try {
				getGridData(request, response);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
	
	private void getGridData(HttpServletRequest request,
			HttpServletResponse response) throws IOException, JSONException {
		// TODO Auto-generated method stub
		
	    String language = request.getParameter("language");
	    
		PrintWriter writer = response.getWriter();
		List<Column> cols = new ArrayList();
		//这里通过浏览器语言来判断显示的表头内容，也可以通过其他参数（如用户权限）来决定
        if(language!=null&&language.contains("en")){
        	cols = ColumnService.cols_en;
        }else {
        	cols = ColumnService.cols_zn;
        }
        
        writer.write(JSONArray.fromObject(cols).toString());
        
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		this.doPost(req, resp);
	}
	
	protected void block(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	    
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			//吃掉异常
		}
		fast(request,response);
	}

	protected void fast(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	    
	    String startStr = request.getParameter("start");
	    String limitStr = request.getParameter("limit");
	    
	    int start = Integer.parseInt(StringUtils.isBlank(startStr)?"0":startStr);
	    int limit = Integer.parseInt(StringUtils.isBlank(limitStr)?"20":limitStr);
	    if (limit == 0) {
	    	limit = Integer.MAX_VALUE;
	    }
		PrintWriter writer = response.getWriter();
		
		GridDataModel<Ip> model = new GridDataModel<Ip>();
        int end = start + limit;
        int total = IpService.ipInfos.size();
        end = end > total ? total : end;
        if(start <= end) {
        	model.setRows(IpService.ipInfos.subList(start, end));
        }
        model.setTotal(total);
        writer.write(JSONObject.fromObject(model).toString());
		
	}
	
	protected void empty(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		String startStr = request.getParameter("start");
	    String limitStr = request.getParameter("limit");
	    
	    int start = Integer.parseInt(startStr);
	    int limit = Integer.parseInt(limitStr);
	    if (limit == 0) {
	    	limit = Integer.MAX_VALUE;
	    }
		PrintWriter writer = response.getWriter();
		
		GridDataModel<Ip> model = new GridDataModel<Ip>();
        int end = start + limit;
        int total = IpService.ipInfos.size();
        end = end > total ? total : end;
        if(start <= end) {
        	model.setRows(IpService.ipInfos.subList(start, end));
        }
        model.setTotal(0);
        writer.write(JSONObject.fromObject(model).toString());
	}
	
	protected void lazy(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    
	    String startStr = request.getParameter("start");
        String limitStr = request.getParameter("limit");
        
        int start = Integer.parseInt(startStr);
        int limit = Integer.parseInt(limitStr);
        
        PrintWriter writer = response.getWriter();
        
        GridDataModel<Ip> model = new GridDataModel<Ip>();
        int end = start + limit;
        // 由用户提供当前页显示的数据，并设置当前页码
        // 用户此时无法预知总数目，应该根据start和limit查找相应的数据
        // begin
        int total = IpService.ipInfos.size();
        end = end > total ? total : end;
        // 若start已经大于end，则用户可以进行显示完整的total信息
        if(start > end) {
        	model.setTotal(total);
        }
        for(;start > end;) {
        	start -= limit;
        }
        model.setRows(IpService.ipInfos.subList(start, end));
        writer.write(JSONObject.fromObject(model).toString());
	}
	
	protected void lazyTotal(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    PrintWriter writer = response.getWriter();
	    try {
            Thread.sleep(5000);//模拟求大概总数要很长时间
        } catch (Exception e) {
            // do nothing
        }
	    int total = IpService.ipInfos.size();
	    
	    String json = String.format("{\"total\": %d}", total);
	    
	    writer.write(json);
        
	}
	
	public void filterByCity(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		
		String city = request.getParameter("city");
		String startStr = request.getParameter("start");
	    String limitStr = request.getParameter("limit");
	    
	    IpService service = new IpService();
	    int start = Integer.parseInt(startStr);
	    int limit = Integer.parseInt(limitStr);
	    if (limit == 0) {
	    	limit = Integer.MAX_VALUE;
	    }
		PrintWriter writer = response.getWriter();
		
		GridDataModel<Ip> model = new GridDataModel<Ip>();
		List<Ip> ips = service.getIpsByCity(city);
        int end = start + limit;
        int total = ips.size();
        end = end > total ? total : end;
        if(start <= end) {
        	model.setRows(ips.subList(start, end));
        }
        model.setTotal(total);
        writer.write(JSONObject.fromObject(model).toString());
		
	}

}
