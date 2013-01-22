package org.operamasks.data;

import java.util.Arrays;
import java.util.List;

public class TreeNodeService {

	public List<TreeNode> getNodes(){
		TreeNode[] nodes = new TreeNode[]{
			new TreeNode("n1","node1",true,false),new TreeNode("n11","n1","node11"),new TreeNode("n12","n1","node12"),
			new TreeNode("n2","node2",false,true),new TreeNode("n3","node3"),new TreeNode("n4","node4")
		};
		return Arrays.asList(nodes);
	}
}
