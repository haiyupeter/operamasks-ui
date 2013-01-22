package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.operamasks.data.Ip;
import org.operamasks.data.IpService;
import org.operamasks.model.GridDataModel;

public class OmGridCrudServlet extends HttpServlet {
	
	private static final String MYSTOREDATA="MYSTOREDATA";
	
	//添加、修改、删除时会执行doPost
	//查询和取数时会执行doGet，本代码中从doGet中转到此doPost方法处理
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html");
		request.setCharacterEncoding("UTF-8");
		
		Object stored=request.getSession().getAttribute(MYSTOREDATA);
        if(stored==null){
            List<Ip> list=new ArrayList<Ip>(IpService.ipInfos);
            Collections.sort(list, new Comparator<Ip>(){
                public int compare(Ip o1, Ip o2) {
                    return o2.getId()-o1.getId();
                }
            });
            stored=list;
            request.getSession().setAttribute(MYSTOREDATA,stored);
        }
        List<Ip> ips=(List<Ip>) stored;
        String operation = request.getParameter("operation");
        if("add".equals(operation)){ //新增
            int newID =ips.get(0).getId()+1;
            String start = request.getParameter("start");
            String end= request.getParameter("end");
            String city=request.getParameter("city");
            String address =request.getParameter("address");
            Ip newIP=new Ip(newID,start,end,city,address);
            ips.add(0,newIP);
        }else if("modify".equals(operation)){ //修改
            int id=Integer.parseInt(request.getParameter("id"));
            String start = request.getParameter("start");
            String end= request.getParameter("end");
            String city=request.getParameter("city");
            String address =request.getParameter("address");
            int index=ips.indexOf(new Ip(id,null,null,null,null));
            Ip old=ips.get(index);
            old.setStart(start);
            old.setEnd(end);
            old.setCity(city);
            old.setAddress(address);
        }else if("delete".equals(operation)){ //删除
            int id=Integer.parseInt(request.getParameter("id"));
            int index=ips.indexOf(new Ip(id,null,null,null,null));
            ips.remove(index);
        }else{ //取数或查询
            GridDataModel<Ip> model = new GridDataModel<Ip>();
            String startStr = request.getParameter("start");
            String limitStr = request.getParameter("limit");
            int start = Integer.parseInt(startStr);
            int limit = Integer.parseInt(limitStr);
            int end = start + limit;
            
            String city=request.getParameter("qCity");
            if(city==null){ //不是查询，返回所有
                int total = ips.size();
                end = end > total ? total : end;
                model.setTotal(total);
                if(start <= end) {
                    model.setRows(ips.subList(start, end));
                }
            }else{ //是查询，返回查询结果
                List<Ip> queryed=new ArrayList<Ip>();
                for(Ip ip:ips){
                    if(ip.getCity().contains(city)){
                        queryed.add(ip);
                    }
                }
                int total = queryed.size();
                end = end > total ? total : end;
                model.setTotal(total);
                if(start <= end) {
                    model.setRows(queryed.subList(start, end));
                }
            }
            PrintWriter writer = response.getWriter();
            writer.write(JSONObject.fromObject(model).toString());
        }
		
	}
	
	//查询和取数时会执行doGet，本代码中从doGet中转给doPost方法处理
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		this.doPost(req, resp);
	}
}
