<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page import="java.util.Map,java.util.HashMap" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>oa子查询页面</title>
</head>
<body>
	<%
		Map<String ,String> typeMap = new HashMap<String ,String>();
	    typeMap.put("member", "用户查询");
	    typeMap.put("mail", "邮件查询");
	    typeMap.put("message", "短信息查询");
	    typeMap.put("notice", "公告查询");
	    typeMap.put("docs", "文档查询");
	    request.setCharacterEncoding("utf-8");
		String type = request.getParameter("type");
		type = typeMap.get(type);
		String query = request.getParameter("q");
	%>
	<img src="../images/back.gif" onclick="location.href='search.html'"/><br />
	搜索类型:   <span style="color:red"><%=type%></span><br />
	搜索内容:   <span style="color:red"><%=query%></span>
</body>
</html>