class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const cleanArray = this.cleanArray(array);
    this.root = this.buildTree(cleanArray);
  }

  cleanArray(array) {
    // Sort array
    const sorted = array.slice().sort((a, b) => a - b);
    // Remove duplicates
    return sorted.filter((item, index) => item !== sorted[index - 1]);
  }

  // Build binary search tree
  buildTree(array) {
    function sortedArrayToBSTRecur(array, start, end) {
      if (start > end) return null;

      let mid = start + Math.floor((end - start) / 2);

      let root = new Node(array[mid]);

      root.left = sortedArrayToBSTRecur(array, start, mid - 1);
      root.right = sortedArrayToBSTRecur(array, mid + 1, end);

      return root;
    }

    function sortedArrayToBST() {
      return sortedArrayToBSTRecur(array, 0, array.length - 1);
    }

    return sortedArrayToBST();
  }

  // Insert value
  insert(value) {
    function insertRec(currNode, value) {
      if (currNode === null) {
        return new Node(value);
      }

      // Ignore duplicates
      if (value === currNode.data) {
        return currNode;
      }

      if (value < currNode.data) {
        currNode.left = insertRec(currNode.left, value);
      } else if (value > currNode.data) {
        currNode.right = insertRec(currNode.right, value);
      }

      return currNode;
    }

    this.root = insertRec(this.root, value);
  }

  // Delete value
  deleteItem(value) {
    function deleteItemRec(currNode, value) {
      if (currNode === null) return null;

      if (value < currNode) {
        currNode.left = deleteItemRec(currNode.left, value);
      } else if (value > currNode) {
        currNode.right = deleteItemRec(currNode.right, value);
      } else {
        // No child
        if (currNode.left === null && currNode.right === null) {
          return null;
        }

        // One child
        if (currNode.left === null) {
          return currNode.right;
        }
        if (currNode.right === null) {
          return currNode.left;
        }

        // Two children
        // Find inorder successor
        let successor = currNode.right;
        while (successor.left !== null) {
          successor = successor.left;
        }

        // Copy successor's value to current node
        currNode.data = successor.data;

        // Delete successor
        currNode.right = deleteItemRec(currNode.right, successor.data);
      }

      return currNode;
    }

    this.root = deleteItemRec(this.root, value);
  }

  // Find value
  find(value) {
    function findRec(currNode, value) {
      if (currNode === null) return null;

      if (value < currNode.data) {
        return findRec(currNode.left, value);
      } else if (value > currNode.data) {
        return findRec(currNode.right, value);
      } else {
        return currNode;
      }
    }

    return findRec(this.root, value);
  }

  // BFS
  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    const queue = [];
    if (this.root) queue.push(this.root);

    while (queue.length > 0) {
      const currNode = queue.shift();
      callback(currNode);

      if (currNode.left) queue.push(currNode.left);
      if (currNode.right) queue.push(currNode.right);
    }
  }

  // DFS inorder
  inOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    function traverse(node) {
      if (node === null) return;
      traverse(node.left);
      callback(node);
      traverse(node.right);
    }

    traverse(this.root);
  }

  // DFS preOrder
  preOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    function traverse(node) {
      if (node === null) return;
      callback(node);
      traverse(node.left);
      traverse(node.right);
    }

    traverse(this.root);
  }

  // DFS postOrder
  postOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    function traverse(node) {
      if (node === null) return;
      traverse(node.left);
      traverse(node.right);
      callback(node);
    }

    traverse(this.root);
  }

  // Find height of a node
  height(value) {
    function findNode(node, value) {
      if (node === null) return null;
      if (value === node.data) return node;
      if (value < node.data) {
        return findNode(node.left, value);
      } else {
        return findNode(node.right, value);
      }
    }

    function nodeHeight(node) {
      if (node === null) return -1;
      let leftHeight = nodeHeight(node.left);
      let rightHeight = nodeHeight(node.right);
      return Math.max(leftHeight, rightHeight) + 1;
    }

    const targetNode = findNode(this.root, value);
    if (targetNode === null) return null;

    return nodeHeight(targetNode);
  }

  // Find depth of a node
  depth(value) {
    function findNode(node, value, depth) {
      if (node === null) return null;
      if (value === node.data) {
        return depth;
      }
      if (value < node.data) {
        return findNode(node.left, value, depth + 1);
      } else {
        return findNode(node.right, value, depth + 1);
      }
    }

    return findNode(this.root, value, 0);
  }

  // Check if tree is balanced
  isBalanced() {
    function checkBalance(node) {
      if (node === null) return 0;

      const leftHeight = checkBalance(node.left);
      if (leftHeight === -1) return -1;

      const rightHeight = checkBalance(node.right);
      if (rightHeight === -1) return -1;

      if (Math.abs(leftHeight - rightHeight) > 1) return -1;

      return Math.max(leftHeight, rightHeight) + 1;
    }

    return checkBalance(this.root) !== -1;
  }

  // Rebalancing the existing tree
  rebalance() {
    const values = [];

    function inorder(node) {
      if (node === null) return;
      inorder(node.left);
      values.push(node.data);
      inorder(node.right);
    }

    inorder(this.root);

    this.root = this.buildTree(values);
  }
}

// prettyPrint() to visualise binary tree - NOT used in code yet
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// DRIVER SCRIPT

function generateRandomArray(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  return arr;
}

// Print array nicely
function printTraversal(traversalName, bst, traversalMethod) {
  const result = [];
  bst[traversalMethod](node => result.push(node.data));
  console.log(`${traversalName}:`, result.join(', '));
}

function driver() {
  // Step 1: create BST from random array
  const randomArray = generateRandomArray(15);
  console.log('Initial random array:', randomArray);

  const bst = new Tree(randomArray);  // assumes constructor calls buildTree inside

  // Step 2: check if balanced
  console.log('Is balanced?', bst.isBalanced());

  // Step 3: print traversals
  printTraversal('Level order', bst, 'levelOrderForEach');
  printTraversal('Pre order', bst, 'preOrderForEach');
  printTraversal('Post order', bst, 'postOrderForEach');
  printTraversal('In order', bst, 'inOrderForEach');

  // Step 4: unbalance by inserting values > 100
  [150, 160, 170, 180, 190].forEach(val => bst.insert(val));
  console.log('Inserted values to unbalance:', [150, 160, 170, 180, 190]);

  // Step 5: check if unbalanced
  console.log('Is balanced after insertions?', bst.isBalanced());

  // Step 6: rebalance the tree
  bst.rebalance();
  console.log('Rebalanced the tree.');

  // Step 7: check balance again
  console.log('Is balanced after rebalance?', bst.isBalanced());

  // Step 8: print traversals again
  printTraversal('Level order', bst, 'levelOrderForEach');
  printTraversal('Pre order', bst, 'preOrderForEach');
  printTraversal('Post order', bst, 'postOrderForEach');
  printTraversal('In order', bst, 'inOrderForEach');
}

driver();