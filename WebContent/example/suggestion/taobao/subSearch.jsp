<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page import="java.util.Map,java.util.HashMap" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>淘宝商城子查询页面</title>
</head>
<body>
	<%
		Map<String ,String> typeMap = new HashMap<String ,String>();
	    typeMap.put("bb", "宝贝");
	    typeMap.put("b2c", "淘宝商城");
	    typeMap.put("dp", "店铺");
	    typeMap.put("pm", "拍卖");
	    typeMap.put("tb", "淘吧");
	    typeMap.put("fx", "哇哦");
	    typeMap.put("hb", "画报");
	    //一级类别
		String type = request.getParameter("type");
		type = typeMap.get(type);
		//子类别
		String subType = request.getParameter("subtype");
		//查询内容
		String query = request.getParameter("q");
	%>
	<img src="../images/back.gif" onclick="location.href='search.html'"/><br />
	一级类别:   <span style="color:red"><%=type%></span><br />
	<%if(!"".equals(subType)){%>二级类别:   <span style="color:red"><%=subType%></span><br /><%}%>
	搜索内容:   <span style="color:red"><%=query%></span>
</body>
</html>