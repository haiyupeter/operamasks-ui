package org.operamasks.servlet;

import java.io.IOException;
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

public class OmSortGridServlet extends HttpServlet {
	@Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        this.doPost(req, resp);
    }
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html");
		
		String startStr = request.getParameter("start");
        String limitStr = request.getParameter("limit");
        int start = Integer.parseInt(startStr);
        int limit = Integer.parseInt(limitStr);
        int end = start + limit;
        int total = IpService.ipInfos.size();
        end = end > total ? total : end;
        String sortBy = request.getParameter("sortBy");
        String sortDir = request.getParameter("sortDir");
        List<Ip> ips;
        if(sortBy==null){ //没有排序
            ips=IpService.ipInfos.subList(start, end);
        }else{ 
            //服务器端排序
            //这里对模拟数据进行了先排序后取子集合的方法,实际应用中可能是执行带order by的SQL语句的TOP-N查询
            Comparator<Ip> comparator=null;
            final int k="asc".equals(sortDir)?1:-1;
            if("city".equals(sortBy)){
                //这里使用了简单的字符串比较，实际应用中可能要用比较复杂的算法
                comparator=new Comparator<Ip>(){
                    public int compare(Ip o1, Ip o2) {
                        return k*(o1.getCity().compareTo(o2.getCity())); //如果升序乘以1，降序乘以-1
                    }
                };
            }//else if("address".equals(sortBy)){  //如果还可以对其它列进行服务器端排序,这里可以写else
//              comparator=new Comparator<Ip>(){
//                  public int compare(Ip o1, Ip o2) {
//                      ...
//                  }
//              };
//          }
            List<Ip> list=new ArrayList<Ip>(IpService.ipInfos);
            Collections.sort(list, comparator);
            ips=list.subList(start, end);
        }
        GridDataModel<Ip> model = new GridDataModel<Ip>();
        model.setRows(ips);
        model.setTotal(total);
        response.getWriter().write(JSONObject.fromObject(model).toString());
	}
}
