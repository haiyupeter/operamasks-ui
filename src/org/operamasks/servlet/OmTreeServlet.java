package org.operamasks.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.operamasks.data.TreeNode;
import org.operamasks.data.TreeNodeService;

public class OmTreeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        doPost(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	
    	request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html");
		String method = request.getParameter("method");
		String content = request.getParameter("content");
		if("position".equals(method)){
			getPositon(request, response);
		}else if("children".equals(content)){
			getChildren(request, response);
		}else if("simpleModel".equals(method)){
			getSimpleModel(request, response);
		}
		else{
			PrintWriter writer =  response.getWriter();
	        String result = 
	        "["+
	         "{\"text\": \"Folder 1\"," +
	             "\"expanded\": true," +
	             "\"children\":" +
	             "[" +
	                 "{"+
	                     "\"text\": \"file 1.1\"" +
	                 "}," +
	                 "{" +
	                     "\"text\": \"file 1.2\"" +
	                 "}" +
	             "]" +
	         "}," +
	         "{" +
	             "\"text\": \"Folder 2\"," +
	             "\"hasChildren\": true" +
	         "}," +
	         "{" +
	             "\"text\": \"file 3\"" +
	         "}" +
	     "]";
	        writer.write(result.toString());
	        writer.flush();
		}
    }

	private void getSimpleModel(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		// TODO Auto-generated method stub
		PrintWriter writer = response.getWriter();
		TreeNodeService service =new TreeNodeService();
		List<TreeNode> nodes = service.getNodes();
		writer.write(JSONArray.fromObject(nodes).toString());
		
	}

	private void getChildren(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		PrintWriter writer =  response.getWriter();
        String result = 
        "["+
         "{\"text\": \"file 2.1\"" +
         "}," +
         "{\"text\": \"file 2.2\"" +
         "}" +"]";
        writer.write(result.toString());
        writer.flush();
	}

	private void getPositon(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		PrintWriter writer =  response.getWriter();
        String result = 
        "["+
         "{\"text\": \"研发\"," +
             "\"expanded\": true," +
             "\"children\":" +
             "[" +
                 "{"+
                     "\"text\": \"开发平台部\"," +
                     "\"children\":" +
                     "[" +
                         "{"+
                             "\"text\": \"部门经理\"" +
                         "}," +
                         "{" +
                             "\"text\": \"产品经理\"" +
                         "}," +
                         "{"+
                         "\"text\": \"开发工程师\"" +
                         "}" +
                     "]" +
                 "}," +
                 "{" +
                     "\"text\": \"基础平台部\"," +
                     "\"children\":" +
                     "[" +
                         "{"+
                             "\"text\": \"部门经理\"" +
                         "}," +
                         "{" +
                             "\"text\": \"产品经理\"" +
                         "}," +
                         "{"+
                         "\"text\": \"开发工程师\"" +
                         "}" +
                     "]" +
                 "}," +
                 "{"+
                    "\"text\": \"工具平台部\"," +
                    "\"children\":" +
                    "[" +
                        "{"+
                            "\"text\": \"部门经理\"" +
                        "}," +
                        "{" +
                            "\"text\": \"产品经理\"" +
                        "}," +
                        "{"+
                        "\"text\": \"开发工程师\"" +
                        "}" +
                    "]" +
                 "}," +
                 "{" +
                     "\"text\": \"测试部\"," +
                     "\"children\":" +
                     "[" +
                         "{"+
                             "\"text\": \"部门经理\"" +
                         "}," +
                         "{" +
                             "\"text\": \"测试人员\"" +
                         "}" +
                     "]" +
                 "}" +
             "]" +
         "}," +
         "{" +
             "\"text\": \"销售\"," +
             "\"expanded\": true," +
             "\"children\":" +
             "[" +
                 "{"+
                     "\"text\": \"销售总监\"" +
                 "}," +
                 "{" +
                     "\"text\": \"市场分析员\"" +
                 "}," +
                 "{"+
                 "\"text\": \"销售人员\"" +
                 "}" +
             "]" +
         "}," +
         "{" +
             "\"text\": \"人事\"," +
             "\"expanded\": true," +
             "\"children\":" +
             "[" +
                 "{"+
                     "\"text\": \"人力资源总监\"" +
                 "}," +
                 "{" +
                     "\"text\": \"薪酬管理员\"" +
                 "}," +
                 "{"+
                 "\"text\": \"招聘人员\"" +
                 "}" +
             "]" +
         "}" +
     "]";
        writer.write(result.toString());
        writer.flush();
		
	}
    
}
