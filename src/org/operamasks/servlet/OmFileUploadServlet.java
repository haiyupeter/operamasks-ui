package org.operamasks.servlet;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.Enumeration;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang.math.RandomUtils;

public class OmFileUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	// 上传文件的保存路径，相对于应用的根目录
	private static final String UPLOAD_PIC_PATH = "/demos/form/fileupload/files/";

	byte[] imgBufTemp = new byte[102401];

	private ServletContext servletContext;

	public void init(ServletConfig config) throws ServletException {
		this.servletContext = config.getServletContext();
	}

	@Override
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// 获取客户端回调函数名
		response.setContentType("text/html;charset=UTF-8");
		defaultProcessFileUpload(request, response);
		if("onerror".equals(request.getParameter("testcase")))
		throw new IOException();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * 生成保存上传文件的磁盘路径
	 * 
	 * @param fileName
	 * @return
	 */
	public String getSavePath(String fileName) {
		String realPath = servletContext.getRealPath("/");
		return realPath + UPLOAD_PIC_PATH + fileName;
	}

	/**
	 * 生成访问上传成功后的文件的URL地址
	 * 
	 * @param fileName
	 * @return
	 */
	public String getFileUrl(String fileName) {
		return "files/" + fileName;
	}

	private void defaultProcessFileUpload(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		ServletFileUpload upload = new ServletFileUpload();
		upload.setHeaderEncoding("UTF-8");
		InputStream stream = null;
		BufferedOutputStream bos = null;
		String fileUrl = "";
		try {
			if (ServletFileUpload.isMultipartContent(request)) {
				FileItemIterator iter = upload.getItemIterator(request);
				int i = 0;
				while (iter.hasNext()) {
					FileItemStream item = iter.next();
					stream = item.openStream();
					if (!item.isFormField()) {
						String prefix = new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + "-" +RandomUtils.nextInt();
						// 得到文件的扩展名(无扩展名时将得到全名)
						String ext = item.getName().substring(item.getName().lastIndexOf(".") + 1);
						String fileName = prefix + "." + ext;
						String savePath = getSavePath(fileName);
						if (i > 0) {
							fileUrl += ",";
						}
						fileUrl += getFileUrl(fileName);
						bos = new BufferedOutputStream(new FileOutputStream(
								new File(savePath)));
						int length;
						while ((length = stream.read(imgBufTemp)) != -1) {
							bos.write(imgBufTemp, 0, length);
						}
						i++;
					}
				}
				StringBuilder json = new StringBuilder();
				json.append("{");
				json.append("'");
				json.append("fileUrl");
				json.append("':'");
				json.append(fileUrl.toString());
				json.append("'");
				Enumeration<String> pNames = request.getParameterNames();
				String pName;
				while (pNames.hasMoreElements()) {
					json.append(",");
					pName = (String) pNames.nextElement();
					json.append("'");
					json.append(pName);
					json.append("':'");
					json.append(request.getParameter(pName));
					json.append("'");
				}
				json.append("}");
				
				response.getWriter().write(json.toString());
			}
		} catch (FileUploadException e) {
			e.printStackTrace();
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
