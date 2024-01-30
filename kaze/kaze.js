//unimplmented function:updateChildren()


/**
 * function: createVnode()
 * 
 * create a vnode
 * 
 * @param {string} tag
 * @param {object} props 
 * @param {array} children 
 * @param {object} data
 * @param {string} text
 * @param {object} elm
 */

function createVnode(tag,props,children,data,text,elm){
	return {
		tag:tag,
		props:props,
		children:children,
		data:data,
		text:text,
		elm:elm
	};
}

/**
 * 
 * @param {string} selector 
 * @param {(object|array)} arg1 
 * @param {(object|array)} arg2 
 */
function hyperScript(selector,arg1,arg2){
	let props={},children,tag
	if(arguments.length==2){
		if(isArray(arg1))children = arg1;
		else if(isPrimitive)children = [arg1];
		else props = arg1;
	}
	if(arguments.length==3){
		props = arg1;
    	if (isArray(arg2))children = arg2;
    	else if (isPrimitive(arg2))text = arg2;
	}
	//parse tag
	hashIdx = selector.indexOf('#');
	dotIdx  = selector.indexOf('.');
	hash = hashIdx>0 ? hashIdx:selector.length;
	dot = dotIdx>0 ? dotIdx:selector.length;
	tag = selector.slice(0,Min(dot,hash));
	if(dotIdx>0 && hashIdx>0){
		props.id = hashIdx>dotIdx?selector.slice(hashIdx+1,selector.length):selector.slice(hashIdx+1,dotIdx);
		props.className = dotIdx>hashIdx?selector.slice(dotIdx+1,selector.length):selector.slice(dotIdx+1,hashIdx);
	}
	else if(dotIdx>0){
		props.className = dotIdx>hashIdx?selector.slice(dotIdx+1,selector.length):selector.slice(dotIdx+1,hashIdx);
	}
	else if(hashIdx>0){
		props.id = hashIdx>dotIdx?selector.slice(hashIdx+1,selector.length):selector.slice(hashIdx+1,dotIdx);
	}
	return createVnode(tag,props,children,undefined,undefined,undefined);
}

/**
 * function createElement()
 * 
 * create DOM through virtual node
 * 
 * @param {object} vnode 
 */
function createElement(vnode){
	let elm=vnode.elm;
	if (isUndef(vnode.elm)){
		elm = document.createElement(vnode.tag);
	}
	if (vnode.props.hasOwnProperty('style')){
		style = vnode.props.style;
		for (const val in style){
			elm.style[val]=style[val];
		}
	}
	if (vnode.props.hasOwnProperty('className')){
		elm.className = vnode.props.className;
	}
	if (!isUndef(vnode.text)){
		elm.textContent = vnode.text
	}
	return elm;	
}

/**
 * function: diffing()
 * 
 * compare two virtual node
 * 
 * @param {object} oldVnode 
 * @param {object} newVnode 
 */
function diffing(oldVnode,newVnode){
	const elm = oldVnode.elm = newVnode.elm;
	if(isUndef(newVnode.text)||isUndef(oldVnode.text)){
		if (isUndef(oldVnode.props)&&(isUndef(newVnode.props))){
			newVnode.props = updateProps(oldVnode.props,newVnode.props);
		}
		newVnode.Children = updateChildren(oldVnode);
	}
	else{
		if(oldVnode.text!==newVnode.text){
			elm.textContent = newVnode.text;
		}
	}
	return newVnode;
}

/**
 * function updateProps
 * 
 * update vnode's props attribute
 * 
 * @param {object} oldProps 
 * @param {object} newProps 
 * @returns 
 */
function updateProps(oldProps,newProps){
	if (Object.keys(oldProps).length<Object.keys(newProps).length){
		for (let key in oldProps){
			if(newProps.hasOwnProperty(key)){
				newProps[key]= oldProps[key]!==newProps[key]?newProps[key]:oldProps[key];					
			}
		}
	}
	else{
		for (let key in newProps){
			if(oldProps.hasOwnProperty(key)){
				newProps[key]= oldProps[key]!==newProps[key]?newProps[key]:oldProps[key];
			}
		}
	}
	return newProps;
}

/**
 * 
 * @param {Array} oldCh 
 * @param {Array} newCh 
 */
function updateChildren(oldCh,newCh){
	if (isUndef(oldCh) && isUndef(newCh)) {
		return;
	}
	oldChLength = oldCh.length;
	newChLength = newCh.length;
	oldChIdx = 0;
	newChIdx = 0;
	if(oldChLength === newChLength){
		for(let i=0;i<oldChIdx;i++){
			res.pop(diffing(oldCh[i],newCh[i]));
		}
		newCh=res;
	}
	return newCh;
}



function isArray(o){
	return Array.isArray(o);
}
function isPrimitive(o){
	return typeof o=="string"||typeof o=="number";
}
function isString(o){
	return typeof o=="string";
}
function isUndef(o){
	return o===undefined;
}
function Min(a,b){
	return a<b?a:b;
}