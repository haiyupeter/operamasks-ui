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

public class OmItemSelectorServlet  extends HttpServlet {
    public class SelectItem {
        private String text;
        private Object value;
        public SelectItem(String text, Object value) {
            super();
            this.text = text;
            this.value = value;
        }
        public String getText() {
            return text;
        }
        public void setText(String text) {
            this.text = text;
        }
        public Object getValue() {
            return value;
        }
        public void setValue(Object value) {
            this.value = value;
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        List<SelectItem> items=new ArrayList<SelectItem>();
        items.add(new SelectItem("OperaMasks SDK","aom"));
        items.add(new SelectItem("OperaMasks UI","omui"));
        items.add(new SelectItem("OperaMasks Studio","studio"));
        items.add(new SelectItem("Apusic OperaMasks Development Suite","aomds"));
        items.add(new SelectItem("Apusic Server","aas"));
        items.add(new SelectItem("Apusic Portal Server","aps"));
        items.add(new SelectItem("Apusic Enterprise Service Bus","aesb"));
        items.add(new SelectItem("Apusic Business Process Management","abpm"));
        items.add(new SelectItem("Apusic Message Queue","amq"));
        items.add(new SelectItem("Apusic Cloud Computing","acp"));
        
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter writer = response.getWriter();
        writer.write(JSONArray.fromObject(items).toString());
    }
}
