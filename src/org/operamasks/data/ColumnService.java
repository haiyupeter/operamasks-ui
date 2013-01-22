package org.operamasks.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ColumnService {

	public static List<Column> cols_zn = new ArrayList<Column>(Arrays.asList(new Column[]{
			new Column("序号",50,"id","left",null),
			new Column("地址",120,"address","left",null),
			new Column("地区",120,"city","left",null),
			new Column("起始IP",120,"start","left",null),
			new Column("结束IP",120,"end","left",null)
	}));
	
	public static List<Column> cols_en = new ArrayList<Column>(Arrays.asList(new Column[]{
			new Column("ID",50,"id","left",null),
			new Column("Adress",120,"address","left",null),
			new Column("CITY",120,"city","left",null),
			new Column("StartIP",120,"start","left",null),
			new Column("EndIP",120,"end","left",null)
	}));
}
