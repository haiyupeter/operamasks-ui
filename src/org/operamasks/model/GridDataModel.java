package org.operamasks.model;

import java.util.ArrayList;
import java.util.List;

import org.operamasks.data.Column;

public class GridDataModel<T> {
	// 显示的总数
	private int total;
	// 行数据
	private List<T> rows = new ArrayList<T>();
	
	private List<Column> colmodel = new ArrayList<Column>();

	public List<Column> getColmodel() {
		return colmodel;
	}

	public void setColmodel(List<Column> colmodel) {
		this.colmodel = colmodel;
	}

	public List<T> getRows() {
		return rows;
	}

	public void setRows(List<T> rows) {
		this.rows = rows;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

}
