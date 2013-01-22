package org.operamasks.servlet;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadBase.SizeLimitExceededException;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class OmEditorImageUploadServlet extends HttpServlet {
		// 上传文件的保存路径，相对于应用的根目录
	  	private static final String UPLOAD_PIC_PATH = "/demos/form/editor/userfiles/images/";
	  	
	  	private static final long MAX_SIZE = 100000;// 设置上传文件最大为 100KB
	  	
	    byte[] imgBufTemp = new byte[102401];

	    private ServletContext servletContext;
	    
	    private String OMEditorFuncNum;

	    public void init(ServletConfig config) throws ServletException {
	        this.servletContext = config.getServletContext();
	    }
	    
	    @Override
	    protected void doPost(HttpServletRequest request, HttpServletResponse response)
	            throws ServletException, IOException {
	    	// 获取客户端回调函数名
	    	OMEditorFuncNum = request.getParameter("OMEditorFuncNum");
	        response.setContentType("text/html;charset=UTF-8");
	        defaultProcessFileUpload(request, response);
	    }

	    public void doGet(HttpServletRequest request, HttpServletResponse response)
	            throws ServletException, IOException {
	    	doPost(request, response);
	    }

	    /**
	     * 生成保存上传文件的磁盘路径
	     * @param fileName
	     * @return
	     */
	    public String getSavePath(String fileName) {
	        String realPath = servletContext.getRealPath("/");
	        return realPath + UPLOAD_PIC_PATH + fileName;
	    }
	    /**
	     * 生成访问上传成功后的文件的URL地址
	     * @param fileName
	     * @return
	     */
	    public String getFileUrl(String fileName){
	    	return "userfiles/images/" + fileName;
	    }

	    private void defaultProcessFileUpload(HttpServletRequest request, HttpServletResponse response)
	            throws IOException {
	        ServletFileUpload upload = new ServletFileUpload();
	        upload.setHeaderEncoding("UTF-8");
	        InputStream stream = null;
	        BufferedOutputStream bos = null;
	        String fileUrl = "";
	        try {
	            if (ServletFileUpload.isMultipartContent(request)) {
	            	// 设置上传文件大小的最大限制为100KB
	                upload.setSizeMax(MAX_SIZE);
	                FileItemIterator iter = upload.getItemIterator(request);
	                while (iter.hasNext()) {
	                    FileItemStream item = iter.next();
	                    stream = item.openStream();
	                    if (!item.isFormField()) {
	                        String prefix = new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
	                        // 得到文件的扩展名(无扩展名时将得到全名)  
	                        String ext = item.getName().substring(item.getName().lastIndexOf(".") + 1);
	                        String fileName = prefix + "." + ext;
	                    	String savePath = getSavePath(fileName);
	                    	fileUrl = getFileUrl(fileName);
	                        bos = new BufferedOutputStream(new FileOutputStream(new File(savePath)));
	                        int length;
	                        while ((length = stream.read(imgBufTemp)) != -1) {
	                            bos.write(imgBufTemp, 0, length);
	                        }
	                    }
	                }
	                StringBuilder script = new StringBuilder();
	                // 执行客户端回调函数
	                script.append("<script type=\"text/javascript\">");
	                script.append("window.parent.OMEDITOR.tools.callFunction(");
	                script.append(OMEditorFuncNum);
	                script.append(", '");
	                script.append(fileUrl);
	                script.append("', '')");
	                script.append("</script>");
	                
	                response.getWriter().write(script.toString());
	            }
	        } catch (FileUploadException e) {
	            e.printStackTrace();
	            StringBuilder script = new StringBuilder();
	            script.append("<script type=\"text/javascript\">");
	            script.append("alert('");
	            if(e instanceof SizeLimitExceededException){
	            	script.append("图片大小不能超过100KB");
	            }else{
	            	script.append(e.getMessage());
	            }
	            script.append("');");
	            script.append("history.go(-1);");
	            script.append("</script>");
	            response.getWriter().write(script.toString());
	        } finally {
	            if (stream != null) {
	                try {
	                    stream.close();
	                } catch (Exception e) {
	                }
	            }
	            if (bos != null) {
	                try {
	                    bos.close();
	                } catch (Exception e) {
	                }
	            }
	        }
	    }

}
