/* 
	This is a simple Virtual DOM library

	compatibility:
		Edge 120.0.2210.121

	include the following functions
		|______ capture(root)
		   	|
			|___ captureAll()
		
		_______ createVnode(tag,*child,*parent,*data)
		|
		|______ createElm(vnode)
		|
		|______ attach(vnode)

*/

function capture(root){
	/* 
		This function captures the whole DOM structure
		under the specified root.
	*/

		let res = [];
		for (let i = 0; i < root.length; i++) {
			if (root[i].nodeType === Node.ELEMENT_NODE) {
				const nodeInfo = {
					'Tag': root[i].nodeName,
					'Children': null,
					'Parent': null,
					'Elm': root[i]
				};
				if (root[i].childNodes && root[i].childNodes.length > 0) {
					nodeInfo.Children = capture(root[i].childNodes);
				}
				if (root[i].parentNode) {
					nodeInfo.Parent = {
						'Tag': root[i].parentNode.nodeName,
						'Children': capture(root[i].parentNode),
					};
				}
				res.push(nodeInfo);
			}
		}
		return res;
	
}

function captureAll(){
	/* 
		Yet another dumb function to extract whole page's
	 	DOM structure.
	*/

	return capture(document.childNodes);
}

function createVnode(tag,child,parent,data){
	/**
 	* Create a virtual DOM node.
 	* @param {string} tag - The tag name of the virtual DOM node.
 	* @param {Array} [child] - Child nodes of the current node (optional).
 	* @param {Any} [parent] - Node to which the current node should be attached (optional, default is document.body).
 	* @param {*} [data] - Data associated with the virtual DOM node (optional).
 	* @returns {Object} - The created virtual DOM node.
 	*/

	let vnode = {}
	if (tag==undefined){
		// what kind of dumbass will do this?
		return;
	}
	
	vnode['Tag'] = tag;

	if (child!=undefined && isArray(child)){
		vnode['Children']=child;
		for (let i=0;i<vnode.Children.length;i++){
			vnode.Children[i].Parent=vnode;
		}
	}
	if (parent!=undefined){
		vnode['Parent']=parent;
	}
	if (data!=undefined){
		vnode['Data']=data;
	}

	return vnode;
}

function attach(vnode){
	/**
	 * Attach the VDOM object to it's mount point
	 */
	if (vnode.Parent!=undefined){
		vnode.Parent.Elm.appendChild(vnode['Elm']);
	}
	else{
		// orphan node attach to body
		document.body.appendChild(vnode['Elm']);
	}
	if (vnode.Children != undefined){
		//Do it for all children
		for (let i=0;i<vnode.Children.length;i++){
			attach(vnode.Children[i]);
		}
	}

}

function createElm(vnode){
	/**
	 * Add real DOM object to vnode['Elm']
	 * and bind text if exist
	 */
	vnode.Elm = document.createElement(vnode.Tag);
	// judge whether the data is a object
	if (typeof(vnode.Data) == 'object'){
		if (vnode.Data.text != undefined){
			vnode.Elm.textContent = vnode.Data.text;
		}
		if (vnode.Data.method != undefined){
			if (typeof(vnode.Data.method)=='function'){
				vnode.Elm.addEventListener("click",vnode.Data.method)
			}
			else{
				vnode.Elm.addEventListener(vnode.Data.method['type'],vnode.Data.method['handler'])
			}
		}
		else{
			for (item in vnode.Data){
				if (item != 'text'){
					vnode.Elm.setAttribute(item,vnode.Data[item])
				}
			}
		}
	}
	// convert all the child as well
	if (vnode.Children!=undefined){
		for (let i=0;i<vnode.Children.length;i++){
			createElm(vnode.Children[i]);
		}
	}
}

function addNode(a){
	/**
	 * send an array
	 * convert to dom
	 */
	
	res = [];
	for (let i=0;i<a.length;i++){
		let Elm = createVnode(
			a[i].Tag,
			a[i].Children,
			a[i].Parent,
			a[i].Data
		);
		res.push(Elm)
		createElm(Elm)
		attach(Elm)
	}
	return res;
}

function update(oldNode,newNode){
	/**
	 * diff
	 * give old vnode and add new vnode
	 */
	
	//small text change first
	if(newNode.Tag !== oldNode.Tag){
		createElm(newNode);
		// remove old one
		oldNode.Elm.parentNode.replaceChild(newNode.Elm,oldNode.Elm);
		for (item in oldNode){
			oldNode[item] = newNode[item];
		}
		// return newNode
		return newNode;
	}
	if(newNode.Parent !== oldNode.Parent){
		//mount point is changed
		update(oldNode.Parent,newNode.Parent);
	}
	if (newNode.Children && oldNode.Children) {
        const length = whichMin(newNode.Children.length, oldNode.Children.length);
        for (let i = 0; i < length; i++) {
            update(oldNode.Children[i], newNode.Children[i]);
        }
    }
	return oldNode;
}

/* 
	some basic function
*/
function isArray(a){
	return Array.isArray(a); //Array or not
}

function getTimeStamp(){
	return Date.now()
}

function Timer(){
	return getTimeStamp();
}

function whichMin(a,b){
	if (a<b){
		return a;
	}
	else{
		return b;
	}
}