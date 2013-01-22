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
import net.sf.json.JSONObject;

/**
 * Servlet implementation class TaobaoSearchServlet
 */
public class TaobaoSearchServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request , response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject result = new JSONObject();
		JSONArray  data = new JSONArray();
		request.setCharacterEncoding("utf-8");
		String key = request.getParameter("searchKey");
        String areas=request.getParameter("areas");
        if(null != key && null != areas && !"".equals(key) && !"".equals(areas)){
        	result.put("valueField", "text");
        	
        	int index = -1;
        	if( (index=Data.key.indexOf(key)) != -1){
        		//寻找子分类,如"衣服"下边会有"男装"和"女装"两种子类别
        		for(String v : Data.values.get(index)){
        			JSONObject jsonObj = new JSONObject();
        			jsonObj.put("text", key);
        			jsonObj.put("subType", v);
        			jsonObj.put("subarea",true);//子类别标记
        			data.add(jsonObj);
        		}
        	}
        	for(Record r : Data.data){
        		if(areas.equals(r.areas)){
        			if(r.name.startsWith(key)){
        				JSONObject jsonObj = new JSONObject();
            			jsonObj.put("text", r.name);
            			jsonObj.put("count", r.count);
            			data.add(jsonObj);
        			}
        		}
        	}
        	result.put("data", data);
        }
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        //result是类似这样的  {textField:'text',data:[{text:'男装',count:7},{text:'女装',count:10}]}
        writer.write(result.toString());
        writer.flush();
	}
	
	private static class Data{
		static List<String> key = new ArrayList<String>();
		static List<List<String>> values = new ArrayList<List<String>>();
		static final String AREAS_BB = "bb";
//		static final String AREAS_B2C = "b2c";
//		static final String AREAS_DP = "dp";
//		static final String AREAS_TB = "tb";
//		static final String AREAS_FX = "fx";
//		static final String AREAS_HB = "hb";
		static List<Record> data = new ArrayList<Record>();
		static{
			key.add("衣服");
			
			List<String> clothes = new ArrayList<String>();
			clothes.add("女装/女士精品");
			clothes.add("男装");
			
			values.add(clothes);
			
			data.add(new Record(AREAS_BB,"衣服 女装 韩版 冬" , 89542));
			data.add(new Record(AREAS_BB,"衣服 男 韩版 冬装" , 35653));
			data.add(new Record(AREAS_BB,"衣服 男 冬装 外套" , 43133));
			data.add(new Record(AREAS_BB,"衣服 男 冬装" , 71258));
			data.add(new Record(AREAS_BB,"衣服 男" , 245720));
			data.add(new Record(AREAS_BB,"衣服 女装 外套" , 75999));
			data.add(new Record(AREAS_BB,"衣服 女装" , 235415));
			data.add(new Record(AREAS_BB,"衣服架" , 6120));
			data.add(new Record(AREAS_BB,"衣服防尘罩" , 8478));
		}
	}

	private static class Record{
		String areas;
		String name;
		int count;
		Record(String areas , String name , int count){
			this.areas = areas;
			this.name = name;
			this.count = count;
		}
	}
}