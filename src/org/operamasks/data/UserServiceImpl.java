package org.operamasks.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class UserServiceImpl {
    private static final User[] USERS = new User[]{
        new User("xz",101,"赵半山","男"),
        new User("xz",102,"钱塘江","男"),
        new User("xz",103,"孙小蝶","女"),
        new User("xzcw",111,"李逵","男"),
        new User("xzcw",112,"周伯通","男"),
        new User("xzcw",113,"吴用","男"),
        new User("xzcw",114,"郑克爽","男"),
        new User("xzcw",115,"王熙凤","女"),
        new User("xzrl",1201,"冯梦龙","男"),
        new User("xzrl",1202,"陈近南","男"),
        new User("xzrlzp",1211,"褚遂良","男"),
        new User("xzrlzp",1212,"卫子夫","男"),
        new User("xzrlpx",1301,"蒋干","男"),
        new User("xzrlpx",1302,"沈括","男"),
        new User("xzrlpx",1303,"韩信","男"),
        new User("xzrlxc",1401,"杨贵妃","女"),
        new User("sc",201,"朱元璋","男"),
        new User("sc",202,"秦桧","男"),
        new User("sc",203,"尤斯塔斯·基德","男"),
        new User("scch",2101,"许仕林","男"),
        new User("scch",2102,"何仙姑","女"),
        new User("scch",2103,"吕洞宾","男"),
        new User("scch",2104,"施耐庵","男"),
        new User("scdy",2201,"张考公","男"),
        new User("scdy",2202,"孔仲尼","男"),
        new User("scdy",2203,"曹操","男"),
        new User("scgc",2301,"严夫子","男"),
        new User("scgc",2301,"华佗","男"),
        new User("kf",301,"金圣叹","男"),
        new User("kf",302,"魏征","男"),
        new User("kfqd",311,"陶渊明","男"),
        new User("kfqd",312,"姜自牙","男"),
        new User("kfgr",321,"戚继光","男"),
        new User("kfgr",322,"谢逊","男"),
        new User("yx",401,"邹忌","男"),
        new User("yx",402,"喻樗","男"),
        new User("yx",403,"柏常","男"),
        new User("yxdb",411,"水丘氏","女"),
        new User("yxdb",412,"窦娥","女"),
        new User("yxxb",421,"章衡","男"),
        new User("yxxb",422,"云中鹤","男"),
        new User("yxxn",431,"苏东坡","男")
    };

    public List<User> findUsersByOrg(String orgId) {
        List<User> users = new ArrayList<User>();
        if(orgId==null){
            return Arrays.asList(USERS);
        }else{
            for(User u:USERS){
                if(u.getOrgId().startsWith(orgId)){
                    users.add(u);
                }
            }
            return users;
        }
    }
    
    public List<User> query(String orgId,String key){
        if(key==null || key.equals("")){
            return findUsersByOrg(orgId);
        }
        List<User> users = new ArrayList<User>();
        for(User u:findUsersByOrg(orgId)){
            if(u.getUsername().contains(key) || (u.getUserid()+"").contains(key)){
                users.add(u);
            }
        }
        return users;
    }
}
