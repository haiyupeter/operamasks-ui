package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * Servlet implementation class OASearchServlet
 */
public class OASearchServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		doPost(request , response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject result = new JSONObject();
		JSONArray dataArray = new JSONArray();
		JSONArray data = getData();
		request.setCharacterEncoding("utf-8");
		String key=request.getParameter("searchKey");
        if(null != key && !"".equals(key)){
        	for(Iterator it=data.iterator();it.hasNext();){
        		JSONObject record = (JSONObject)it.next();
        		if(record.containsKey("begin")){
        			//因为omSuggestion用上下键操作时会进行回填，选中的是每部分的头部时，回填搜索的内容
        			record.put("name", key);
        			dataArray.add(record);
        		}else{
        			String name = (String)record.get("name");
        			if(name.indexOf(key) != -1){
        				dataArray.add(record);
        			}
        		}
        	}
        }
        //下面的valueField和data是固定的
        result.put("valueField", "name");
        result.put("data", dataArray);
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.write(result.toString());
        writer.flush();
	}
	private JSONArray getData(){
		JSONArray data = new JSONArray();
		JSONObject memberBegin = new JSONObject();
		memberBegin.put("type", "member");
		memberBegin.put("begin", "true");
    	JSONObject member1 = new JSONObject();
		member1.put("type", "member");
		member1.put("name", "陈晓冰");
		member1.put("img", "../images/cxb.png");
		member1.put("position", "普通员工");
		member1.put("star", 2);
		JSONObject member2 = new JSONObject();
		member2.put("type", "member");
		member2.put("name", "李冰");
		member2.put("img", "../images/lb.png");
		member2.put("position", "项目经理");
		member2.put("star", 4);
		
		JSONObject mailBegin = new JSONObject();
		mailBegin.put("type", "mail");
		mailBegin.put("begin", "true");
		JSONObject mail1 = new JSONObject();
		mail1.put("type", "mail");
		mail1.put("name", "需求探讨-赵晓冰");
		mail1.put("from", "赵晓冰");
		mail1.put("img", "../images/email_inner.png");
		JSONObject mail2 = new JSONObject();
		mail2.put("type", "mail");
		mail2.put("name", "陈冰:组织研究");
		mail2.put("from", "陈冰");
		mail2.put("img", "../images/email_outer.png");
		
		JSONObject messageBegin = new JSONObject();
		messageBegin.put("type", "message");
		messageBegin.put("begin", "true");
		
		JSONObject noticeBegin = new JSONObject();
		noticeBegin.put("type", "notice");
		noticeBegin.put("begin", "true");
		JSONObject notice = new JSONObject();
		notice.put("type", "notice");
		notice.put("name", "王冰成职位调整");
		notice.put("from", "徐董丽");
		notice.put("img", "../images/notice.png");
		
		JSONObject docsBegin = new JSONObject();
		docsBegin.put("type", "docs");
		docsBegin.put("begin", "true");
		JSONObject docs = new JSONObject();
		docs.put("type", "docs");
		docs.put("name", "李冰简历.doc");
		docs.put("img" , "../images/doc.png");
		docs.put("author", "小彬");
		
		data.add(memberBegin);
		data.add(member1);
		data.add(member2);
		data.add(mailBegin);
		data.add(mail1);
		data.add(mail2);
		data.add(messageBegin);
		data.add(noticeBegin);
		data.add(notice);
		data.add(docsBegin);
		data.add(docs);
		return data;
	}
}