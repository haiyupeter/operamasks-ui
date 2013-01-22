package org.operamasks.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CatalogService {
	
	public static List<Catalog> catalogInfos = new ArrayList<Catalog>(
		Arrays.asList(new Catalog[]{
				new Catalog("001002001", "系统菜单管理","{add,mod}"),
				new Catalog("001003001", "人事管理",""),
				new Catalog("002001001", "设备管理","{add,del}"),
				new Catalog("002001002", "库存管理",""),
				new Catalog("003002001", "流程管理",""),
				new Catalog("004009008", "请销假管理","{del,mod}")
		})
	);
}
