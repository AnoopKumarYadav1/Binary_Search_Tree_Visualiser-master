const txt=document.getElementById('node-value');
txt.addEventListener('input',()=>{
  document.querySelector('.error').style.display="none";
})
class BinarySearchTreeUI {
  highlightTimer = null;
  actionsContainerSelector;
  treeContainerSelector;
  config;
  constructor(
    tree,
    render,
    treeContainerSelector = ".tree",
    actionsContainerSelector = ".bst-actions-container",
    config = {
      HIGHLIGHT_CLASS: "node__element--highlight",
      HIGHLIGHT_TIME: 300,
    }
  ) {
    this.treeContainerSelector = treeContainerSelector;
    this.actionsContainerSelector = actionsContainerSelector;
    this.config = config;
    this.tree = tree;
    this.render = this.renderTree;
    const root = document.documentElement;
    root.style.setProperty(
      "--animation-timing",
      `${this.config.HIGHLIGHT_TIME / 1000}s`
    );
  }

  template() {
    return `
      <div class="btn-group">
        <button id="insertBtn" class="btn btn-warning">
          Insert Node
        </button>
        <button id="removeElementBtn" class="btn btn-dark">
          Remove Node
        </button>
      </div>
      <div class="btn-group">
        <button id="searchBtn" class="btn btn-primary">Search</button>
        <button id="minValueBtn" class="btn btn-warning">
          Min Value
        </button>
        <button id="maxValueBtn" class="btn btn-dark">Max Value</button>
      </div>
      <div class="btn-group">
        <button id="inOrderTravBtn" class="btn btn-primary">
          In Order Traversal
        </button>
        <button id="postOrderTravBtn" class="btn btn-warning">
          Post Order Traversal
        </button>
        <button id="preOrderTravBtn" class="btn btn-dark">
          Pre Order Traversal
        </button>
      </div>
      <div class="btn-group">
        <button id="resetBtn" class="btn btn-danger">
          Delete Tree
        </button>
      </div>
      `;
  }

  traverseUINodes(nodes) {
    nodes.reduce((pr, node) => {
      return pr.then(() => this.highlightNode(node));
    },Promise.resolve());
  }

  getTreeUI(node) {
    const { left, right, value } = node;
    if (!node) {
      return "";
    }
    return `
        <div class="node__element" data-node-id="${value}">${value}</div>
        ${
          left || right
            ? `
              <div class="node_bottom_line"></div>
              <div class="node__children">
              <div class="node node--left">
                ${left ? this.getTreeUI(left) : ""}
              </div>
              <div class="node node--right">
                ${right ? this.getTreeUI(right) : ""}
              </div>
              </div>
            `
            : ""
        }
      `;
  }

  renderTree(
    node = this.tree.root,
    containerSelector = this.treeContainerSelector
  ) {
    const treeContainer = document.querySelector(containerSelector);
    if (!node) {
      return (treeContainer.innerHTML = "");
    }
    const template = this.getTreeUI(node);
    treeContainer.innerHTML = template;
  }

  highlightNode({ value }) {
    const nodeElement = document.querySelector(`[data-node-id="${value}"]`);
    nodeElement.classList.add(this.config.HIGHLIGHT_CLASS);
    document.querySelectorAll("button").forEach((btn) => {
      btn.setAttribute("disabled", true);
    });
    return new Promise((resolve) => {
      this.highlightTimer = setTimeout(() => {
        nodeElement.classList.remove(this.config.HIGHLIGHT_CLASS);
        document.querySelectorAll("button").forEach((btn) => {
          btn.removeAttribute("disabled");
        });
        this.highlightTimer = null;
        resolve();
      }, this.config.HIGHLIGHT_TIME);
    });
  }

  onRemoveElementBtnClick() {
    document.querySelector('.error').style.display="none";
    const element = document.getElementById('node-value').value;
      const removedEl = this.tree.remove(element);
      if (removedEl) {
        this.highlightNode(removedEl).then(() => {
          
          this.render(this.tree.root);
        });
      } 
      else {
        document.querySelector('.error h1').innerHTML="Node not found";
        document.querySelector('.error').style.display="block";
      }
  }

  setTemplate() {
    const actionsContainer = document.querySelector(
      this.actionsContainerSelector
    );
    actionsContainer.innerHTML = this.template();
  }

  onInsertBtnClick() {
    const element = document.getElementById('node-value').value;
    if (!element) {
      return;
    }
    const node = this.tree.insert(element);
    this.render(this.tree.root);
    this.highlightNode(node);
  }

  onMinValueBtnClick() {
    document.querySelector('.error').style.display="none";
    const node = this.tree.min();
    if (node) {
      this.highlightNode(node);
    } else {
      document.querySelector('.error h1').innerHTML="Node not found";
        document.querySelector('.error').style.display="block";
    }
  }

  onSearchBtnClick() {
    document.querySelector('.error').style.display="none";
    const searchVal = document.getElementById('node-value').value;
    const searchedNode = this.tree.search(searchVal);
    if (searchedNode) {
      this.highlightNode(searchedNode);
    } else {
      document.querySelector('.error h1').innerHTML="Node not found";
        document.querySelector('.error').style.display="block";
    }
  }

  onMaxValueBtnClick() {
    document.querySelector('.error').style.display="none";
    const node = this.tree.max();
    if (node) {
      this.highlightNode(node);
    } else {
      document.querySelector('.error h1').innerHTML="Node not found";
        document.querySelector('.error').style.display="block";
    }
  }

  onPreOrderTravBtnClick() {
    const array = this.tree.preOrderTraverse();
    this.traverseUINodes(array);
    console.log(array);
  }

  onInOrderTravBtnClick() {
    const array = this.tree.inOrderTraverse();
    this.traverseUINodes(array);
    console.log(array);
  }

  onPostOrderTravBtnClick() {
    const array = this.tree.postOrderTraverse();
    this.traverseUINodes(array);
    console.log(array);
  }

  onResetBtnClick() {
    this.highlightNode(this.tree.root).then(() => {
      this.tree.root = null;
      this.render(this.tree.root);
    });
  }

  init() {
    this.setTemplate();
    const insert = document.querySelector("#insertBtn");
    const removeElementBtn = document.querySelector("#removeElementBtn");
    const minValueBtn = document.querySelector("#minValueBtn");
    const maxValueBtn = document.querySelector("#maxValueBtn");
    const searchBtn = document.querySelector("#searchBtn");
    const preOrderTravBtn = document.querySelector("#preOrderTravBtn");
    const inOrderTravBtn = document.querySelector("#inOrderTravBtn");
    const postOrderTravBtn = document.querySelector("#postOrderTravBtn");
    const resetBtn = document.querySelector("#resetBtn");
    removeElementBtn.addEventListener(
      "click",
      this.onRemoveElementBtnClick.bind(this)
    );
    insert.addEventListener("click", this.onInsertBtnClick.bind(this));
    minValueBtn.addEventListener("click", this.onMinValueBtnClick.bind(this));
    searchBtn.addEventListener("click", this.onSearchBtnClick.bind(this));
    maxValueBtn.addEventListener("click", this.onMaxValueBtnClick.bind(this));
    preOrderTravBtn.addEventListener(
      "click",
      this.onPreOrderTravBtnClick.bind(this)
    );
    inOrderTravBtn.addEventListener(
      "click",
      this.onInOrderTravBtnClick.bind(this)
    );
    postOrderTravBtn.addEventListener(
      "click",
      this.onPostOrderTravBtnClick.bind(this)
    );
    resetBtn.addEventListener("click", this.onResetBtnClick.bind(this));
  }
}
 
const COMPARISON = {
  EQUAL: 0,
  SMALLER: -1,
  GREATER: 1,
};

const defaultCompareNumberFn = (a, b) => {
  if (Number(a) == Number(b)) {
    return COMPARISON.EQUAL;
  }

  return Number(a) < Number(b) ? COMPARISON.SMALLER : COMPARISON.GREATER;
};

class TreeNode {
  constructor(value, parent) {
    this.value = value.toString();
    this.parent = parent || null;
    this.left = null;
    this.right = null;
  }

  get isLeaf() {
    return this.left === null && this.right === null;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
}
class BinarySearchTree {
  root;
  compareFn;
  constructor(compareFn = defaultCompareNumberFn) {
    this.root = null;
    this.compareFn = compareFn;
  }

  insert(value) {
    let node = this.root;
    let insertedNode;
    if (node === null) {
      this.root = new TreeNode(value);
      return this.root;
    }
    const nodeInserted = (() => {
      while (true) {
        const comparison = this.compareFn(value, node.value);
        if (comparison === COMPARISON.EQUAL) {
          insertedNode = node;
          return node;
        }
        if (comparison === COMPARISON.SMALLER) {
          if (node.left === null) {
            insertedNode = new TreeNode(value, node);
            node.left = insertedNode;
            return true;
          }
          node = node.left;
        } else if (comparison === COMPARISON.GREATER) {
          if (node.right === null) {
            insertedNode = new TreeNode(value, node);
            node.right = insertedNode;
            return true;
          }
          node = node.right;
        }
      }
    })();
    if (nodeInserted) {
      return insertedNode;
    }
  }

  remove(value, node) {
    node = node ? node : this.search(value);
    if (!node) return null;

    const nodeIsRoot = node.parent === null;
    const hasBothChildren = node.left !== null && node.right !== null;
    const isLeftChild = !nodeIsRoot ? node.parent.left === node : false;

    if (node.isLeaf) {
      if (nodeIsRoot) {
        this.root = null;
      } else if (isLeftChild) {
        node.parent.left = null;
      } else {
        node.parent.right = null;
      }
      return node;
    }
    if (!hasBothChildren) {
      const child = node.left !== null ? node.left : node.right;
      if (nodeIsRoot) {
        this.root = child;
      } else if (isLeftChild) {
        node.parent.left = child;
      } else {
        node.parent.right = child;
      }
      child.parent = node.parent;
      return node;
    }

    const minRightLeaf = this.min(node.right);
    if (minRightLeaf.parent.left === minRightLeaf) {
      minRightLeaf.parent.left = null;
    } else {
      minRightLeaf.parent.right = null;
    }
    const clone = { ...node };
    node.value = minRightLeaf.value;
    return clone;
  }
  search(value) {
    return this.preOrderTraverse().find((node) => node.value === value);
  }
  min(node = this.root) {
    let current = node;
    while (current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }
  max(node = this.root) {
    let current = node;
    while (current !== null && current.right !== null) {
      current = current.right;
    }
    return current;
  }
  inOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    if (node.left) {
      traversed.push(...this.inOrderTraverse(node.left));
    }
    traversed.push(node);
    if (node.right) {
      traversed.push(...this.inOrderTraverse(node.right));
    }
    return traversed;
  }
  preOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    traversed.push(node);
    if (node.left) {
      traversed.push(...this.preOrderTraverse(node.left));
    }
    if (node.right) {
      traversed.push(...this.preOrderTraverse(node.right));
    }
    return traversed;
  }
  postOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    if (node.left) {
      traversed.push(...this.postOrderTraverse(node.left));
    }
    if (node.right) {
      traversed.push(...this.postOrderTraverse(node.right));
    }
    traversed.push(node);
    return traversed;
  }
}
const main = () => {
  const myTree = new BinarySearchTree();
  // console.log("treeData", myTree);
  const bstUI = new BinarySearchTreeUI(myTree, null, ".tree");
  bstUI.init();
  bstUI.render();
};

main();
