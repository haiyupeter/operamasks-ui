package org.operamasks.servlet;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginValidateServlet extends HttpServlet {
    private static final String LOGIN_VALIDATE_STRING="LOGIN_VALIDATE_STRING";
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse response)
            throws ServletException, IOException {
        String url=req.getRequestURI();
        if(url.endsWith("validateCode.image")){
            //生成100px*22px的包含6个字符的验证码
        	HttpSession session = req.getSession();
            RandomImage validateImage = new RandomImage(6, 100, 22);
            OutputStream bos = response.getOutputStream();
            response.setHeader("cache-control", "no-store");
            ImageOutputStream ios = ImageIO.createImageOutputStream(bos);
            ImageIO.write(validateImage.getValidateImage(), "JPEG", ios);
            session.setAttribute(LOGIN_VALIDATE_STRING,validateImage.getValidateString());
            ios.close();
            bos.close();
        }else{
            this.doPost(req, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            Thread.sleep(2000);
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
        req.setCharacterEncoding("utf-8");
        response.reset();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();

        String username = req.getParameter("username");
        String password = req.getParameter("password");
        String validatecode = req.getParameter("validatecode");
        // 用户名和密码都不能为空。
        // 虽然页面有不能为空校验，但是高级可能用户会修改js来绕过客户端校验，为保险起见后台再校验一次
        if (isNullString(username) || isNullString(password) || isNullString(validatecode)) {
            // 返回登录结果到页面，页面将根据这个结果来判断是否登录成功
            writer.write("用户名、密码、验证码都不能为空！");
            writer.flush();
            return;
        }
        //将用户输入的验证码与session中保存的验证码进行比较
        if(!validatecode.equalsIgnoreCase(req.getSession().getAttribute(LOGIN_VALIDATE_STRING).toString())){
            writer.write("验证码有误！");
            writer.flush();
            return;
        }
        // 用户名密码验证码都不为空，且验证码是对的，开始登录
        if (login(username, password)) {
            // 登录成功后一般会把用户名或其它信息存到session里供过滤器用，或者供其它页面使用
            req.getSession().setAttribute("LOGIN_USERNAME", username);
            // 返回登录结果到页面，页面将根据这个结果来判断是否登录成功
            writer.write("true");
            writer.flush();
        } else {
            // 返回登录结果到页面，页面将根据这个结果来判断是否登录成功
            writer.write("用户名或密码有误！");
            writer.flush();
        }
    }

    private boolean isNullString(String str) {
        return str == null || str.trim().length() == 0;
    }

    // 这里简单模拟登录，只要用户名和密码一样就可以登录
    // 实际业务场景中这里要根据数据库来判断
    private boolean login(String username, String password) {
        return username.equals(password);
    }

    class RandomImage {
        private static final String randomString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 图片上的字符串
        private String validateString; // 生成的验证字符串
        private BufferedImage validateImage; // 生成的验证图片
        private int length; // 图片上字符的个数
        private int width; // 图片的宽度
        private int height; // 图片的高度

        public RandomImage(int length, int width, int height) {
            this.length = length;
            this.width = width;
            this.height = height;
        }

        // 获取生成的验证字符串
        public String getValidateString() {
            if (validateString == null) {
                getValidateImage();
            }
            return validateString;
        }

        // 获取生成的验证图片
        public BufferedImage getValidateImage() {
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);// 在内存中创建图象
            Graphics2D raphics = (Graphics2D) image.getGraphics();// 获取图形上下文
            raphics.setColor(new Color(200,200,0));// 设定为白色背景色
            raphics.fillRect(0, 0, width, height);
            raphics.setFont(new Font("Times New Roman", Font.ITALIC, 18));// 设定字体
            // style:HANGING_BASELINE
            Random random = new Random(); // 生成随机类
            // 随机产生155条干扰线，使图象中的认证码不易被其它程序探测到
            for (int i = 0; i < 305; i++) {
                raphics.setColor(getRandColor(160, 200));// 给定范围获得随机颜色
                int x = random.nextInt(width);
                int y = random.nextInt(height);
                int xl = random.nextInt(12);
                int yl = random.nextInt(12);
                raphics.drawLine(x, y, x+xl, y+yl);
            }
            // 取随机产生的认证码(length位数字)
            String rand = "";
            StringBuffer vString = new StringBuffer();
            for (int i = 0; i < length; i++) {
                rand = String.valueOf(randomString.charAt(random.nextInt(randomString.length())));
                vString.append(rand);
                raphics.setColor(Color.BLACK);// 设置为黑色字体
                // raphics.rotate(0.01,20,20);
                raphics.drawString(rand, 15 * i + 10, 15);
            }
            validateString = vString.toString(); // 将认证码存入 validateString
            raphics.dispose(); // 图象生效
            return image;
        }

        private Color getRandColor(int fc, int bc) { // 给定范围获得随机颜色
            Random random = new Random();
            if (fc > 255)
                fc = 255;
            if (bc > 255)
                bc = 255;
            int r = fc + random.nextInt(bc - fc);
            int g = fc + random.nextInt(bc - fc);
            int b = fc + random.nextInt(bc - fc);
            return new Color(r, g, b);
        }
    }
}
