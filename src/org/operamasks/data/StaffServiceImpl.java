package org.operamasks.data;

import java.util.Arrays;
import java.util.List;

public class StaffServiceImpl {
    private static final Staff[] staff = new Staff[]{
    	new Staff(1 , "小李" , "xiaoli@163.com" , "13754158965" , (byte)1 , "广东省" , "梅林关"),
    	new Staff(2 , "虹虹" , "xiaohong@qq.com" , "13754038965" , (byte)0 , "广东省" , "汕头市"),
    	new Staff(3 , "李莫" , "limo@163.com" , "13759876910" , (byte)0 , "广东省" , "梅州市"),
    	new Staff(4 , "江小小" , "jxx@gmail.com" , "13754159632" , (byte)0 , "广东省" , "揭阳市"),
    	new Staff(5 , "王强" , "wq@apusic.com" , "13941258966" , (byte)1 , "广东省" , "普宁市"),
    	new Staff(6 , "陈彬" , "cb@163.com" , "13754159999" , (byte)1 , "广东省" , "深圳市"),
    	new Staff(7 , "王丽" , "lili@163.com" , "13754178110" , (byte)0 , "广东省" , "广州市"),
    	new Staff(8 , "张旭" , "zx@kingdee.com" , "13754159968" , (byte)1 , "" , "北京市"),
    	new Staff(9 , "赵冰" , "zb@sina.com" , "13511158586" , (byte)1 , "" , "天津市"),
    	new Staff(10 , "孙小小" , "sxx@163.com" , "13754157452" , (byte)0 , "" , "香港"),
    	new Staff(11, "诸明" , "zm@163.com" , "13754151025" , (byte)1 , "" , "澳门"),
    	new Staff(12 , "陈康永" , "cky@qq.com" , "13754116465" , (byte)1 , "湖南省" , "长沙"),
    	new Staff(13 , "王晓冰" , "wxb@sohu.com" , "13754151230" , (byte)0 , "四川" , "成都"),
    	new Staff(14 , "陈大卫" , "dw@apusic.com" , "13756358973" , (byte)1 , "云南" , "昆明"),
    	new Staff(15 , "蔡小翠" , "cxc@163.com" , "13754154563" , (byte)0 , "福建" , "福州"),
    	new Staff(16 , "林凡" , "linfan@163.com" , "13754151203" , (byte)1 , "吉林" , "长春"),
    	new Staff(17 , "慕容" , "murong@163.com" , "13754158987" , (byte)0 , "山西" , "太原")
    };

    public static List<Staff> query(int start , int limit){
        return Arrays.asList(staff).subList(start, start+limit>staff.length?staff.length : start+limit);
    }
    
    public static int getTotal(){
    	return staff.length;
    }
}
