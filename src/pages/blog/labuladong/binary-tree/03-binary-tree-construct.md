---
title: 二叉树算法——构造篇
description: 二叉树算法——构造篇
date: 2022-11-28 10:00:00
image: /img/algorithm.webp
---

[[toc]]

## 构造最大二叉树

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-654. 最大二叉树](https://leetcode.cn/problems/maximum-binary-tree/)

给定一个不重复的整数数组 `nums`。 **最大二叉树** 可以用下面的算法从 `nums` 递归地构建:

1. 创建一个根节点，其值为 `nums` 中的最大值。
2. 递归地在最大值 **左边** 的 **子数组前缀上** 构建左子树。
3. 递归地在最大值 **右边** 的 **子数组后缀上** 构建右子树。
4. 返回 `nums` 构建的 **最大二叉树** 

**提示：**

- 树中节点数目范围在 `[0, 1000]` 内
- `0 <= Node.val <= 1000`
- 数组中所有的整数互不相同

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="inline-flex">
      <div class="i-vscode-icons-file-type-testts mr-1"></div>
      <div>测试代码</div>
    </div>
  </summary>
  
```ts
describe('1', () => {
  const arr = [3, 2, 1, 6, 0, 5];
  const result = [6, 3, 5, null, 2, 0, null, null, 1];

  it('print result', () => {
    expect(constructMaximumBinaryTree(arr)).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": null,
          "right": TreeNode {
            "left": null,
            "right": TreeNode {
              "left": null,
              "right": null,
              "val": 1,
            },
            "val": 2,
          },
          "val": 3,
        },
        "right": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": 0,
          },
          "right": null,
          "val": 5,
        },
        "val": 6,
      }
    `)
  });

  it('print exp result', () => {
    expect(createTree(result)).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": null,
          "right": TreeNode {
            "left": TreeNode {
              "left": null,
              "right": TreeNode {
                "left": null,
                "right": null,
                "val": 1,
              },
              "val": 0,
            },
            "right": null,
            "val": 2,
          },
          "val": 3,
        },
        "right": TreeNode {
          "left": null,
          "right": null,
          "val": 5,
        },
        "val": 6,
      }
    `)
  });
});
```
  
</details>

### 具体实现

```ts
function constructMaximumBinaryTree(nums: number[]): TreeNode | null {
  const len = nums.length;
  if (len === 0) {
    return null;
  }

  let maxIndex = 0;

  for (let index = 0; index < len; index++) {
    maxIndex = nums[maxIndex] >= nums[index] ? maxIndex : index
  }

  return new TreeNode(
    nums[maxIndex],
    constructMaximumBinaryTree(maxIndex === 0 ? [] : nums.slice(0, maxIndex)),
    constructMaximumBinaryTree(nums.slice(maxIndex + 1))
  );

};
```

## 通过前序遍历和中序遍历的结果构造二叉树

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

给定两个整数数组 `preorder` 及 `inorder`，其中 `preorder` 是二叉树的 **前序遍历**，`inorder` 是同一棵树的 **中序遍历**

构造二叉树并返回其根节点

**提示：**

- 树中节点数目范围在 `[1, 3000]` 内
- `-3000 <= Node.val <= 3000`
- 数组中所有的整数互不相同
- `preorder` 与 `inorder` 仅元素顺序不同

![思路](https://labuladong.gitee.io/algo/images/%e4%ba%8c%e5%8f%89%e6%a0%91%e7%b3%bb%e5%88%972/3.jpeg)

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="inline-flex">
      <div class="i-vscode-icons-file-type-testts mr-1"></div>
      <div>测试代码</div>
    </div>
  </summary>
  
```ts
describe('rebuild tree', () => {
  it('1', () => {
    const pre = [3, 9, 20, 15, 7];
    const mid = [9, 3, 15, 20, 7];

    const trr = [3, 9, 20, null, null, 15, 7];

    expect(buildTree(pre, mid)).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": null,
          "right": null,
          "val": 9,
        },
        "right": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": 15,
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": 7,
          },
          "val": 20,
        },
        "val": 3,
      }
    `);

    expect(createTree(trr)).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": null,
          "right": null,
          "val": 9,
        },
        "right": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": 15,
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": 7,
          },
          "val": 20,
        },
        "val": 3,
      }
    `);
  });

  it('2', () => {
    const pre = [-1];
    const mid = [-1];

    expect(buildTree(pre, mid)).toEqual(new TreeNode(-1));
  });
});
```
  
</details>

### 具体实现

```ts
const nodeMap = new Map<number, number>();

function build(
  preorder: number[],
  preStart: number,
  preEnd: number,
  inorder: number[],
  inStart: number,
  inEnd: number
) {
  if (preStart > preEnd) {
    return null;
  }

  // 前序遍历的第一个值，即为 根节点
  const rootVal = preorder[preStart];
  const rootIndex = nodeMap.get(rootVal) as number;

  // 由中序遍历的位置，得到左子树的节点数
  const leftSize = rootIndex - inStart;
  
  const root = new TreeNode(rootVal);
  // 构造左子树
  root.left = build(preorder, preStart + 1, preStart + leftSize, inorder, inStart, rootIndex - 1);
  // 构造右子树
  root.right = build(preorder, preStart + leftSize + 1, preEnd, inorder, rootIndex + 1, inEnd);
  
  return root;
}

function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  inorder.forEach((v, i) => {
    nodeMap.set(v, i);
  });

  return build(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1);
};
```

## 通过中序遍历和后序遍历的结果构造二叉树

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-106. 从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

给定两个整数数组 `inorder` 及 `postorder`，其中 `inorder` 是二叉树的 **中序遍历**，`postorder` 是同一棵树的 **后序遍历**

构造二叉树并返回其根节点

**提示：**

- 树中节点数目范围在 `[1, 3000]` 内
- `-3000 <= Node.val <= 3000`
- 数组中所有的整数互不相同
- `preorder` 与 `inorder` 仅元素顺序不同

![思路](https://labuladong.gitee.io/algo/images/%e4%ba%8c%e5%8f%89%e6%a0%91%e7%b3%bb%e5%88%972/6.jpeg)

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="inline-flex">
      <div class="i-vscode-icons-file-type-testts mr-1"></div>
      <div>测试代码</div>
    </div>
  </summary>
  
```ts
describe('rebuild tree', () => {
  it('1', () => {
    const post = [9, 15, 7, 20, 3];
    const mid = [9, 3, 15, 20, 7];

    const trr = [3, 9, 20, null, null, 15, 7];

    expect(buildTree(mid, post)).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": null,
          "right": null,
          "val": 9,
        },
        "right": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": 15,
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": 7,
          },
          "val": 20,
        },
        "val": 3,
      }
    `);

    expect(createTree(trr)).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": null,
          "right": null,
          "val": 9,
        },
        "right": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": 15,
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": 7,
          },
          "val": 20,
        },
        "val": 3,
      }
    `);
  });

  it('2', () => {
    const post = [-1];
    const mid = [-1];

    expect(buildTree(post, mid)).toEqual(new TreeNode(-1));
  });
});
```
  
</details>

### 具体实现

```ts
function build(
  postorder: number[],
  postStart: number,
  postEnd: number,
  inorder: number[],
  inStart: number,
  inEnd: number
) {
  if (inStart > inEnd) {
    return null;
  }

  // 后序遍历的最后一个值，即为 根节点
  const rootVal = postorder[postEnd];
  const rootIndex = nodeMap.get(rootVal) as number;

  // 由中序遍历的位置，得到左子树的节点数
  const leftSize = rootIndex - inStart;
  
  const root = new TreeNode(rootVal);
  // 构造左子树
  root.left = build(postorder, postStart, postStart + leftSize - 1, inorder, inStart, rootIndex - 1);
  // 构造右子树
  root.right = build(postorder, postStart + leftSize, postEnd - 1, inorder, rootIndex + 1, inEnd);
  
  return root;
}

function buildTree(inorder: number[], postorder: number[]): TreeNode | null {

  inorder.forEach((v, i) => {
    nodeMap.set(v, i);
  });


  return build(postorder, 0, postorder.length - 1, inorder, 0, inorder.length - 1);
};
```

## 通过前序遍历和后序遍历的结果构造二叉树

> **通过前序中序，或者后序中序遍历结果可以确定唯一一棵原始二叉树，但是通过前序后序遍历结果无法确定唯一的原始二叉树**

### 题目描述

[<div class="i-cib-leetcode"></div> 力扣原题-889. 根据前序和后序遍历构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)

给定两个整数数组 `preorder` 及 `postorder`，其中 `preorder` 是二叉树的 **前序遍历**，`postorder` 是同一棵树的 **后序遍历**

构造二叉树并返回其根节点，**如果存在多个，返回其中任意一个即可**

**提示：**

- 树中节点数目范围在 `[1, 30]` 内
- `1 <= Node.val <= preorder.length`
- 数组中所有的整数互不相同
- `preorder` 与 `postorder` 仅元素顺序不同

![思路](https://labuladong.gitee.io/algo/images/%e4%ba%8c%e5%8f%89%e6%a0%91%e7%b3%bb%e5%88%972/8.jpeg)

### TDD

<details>
  <summary class="cursor-pointer">
    <div class="inline-flex">
      <div class="i-vscode-icons-file-type-testts mr-1"></div>
      <div>测试代码</div>
    </div>
  </summary>
  
```ts
describe('rebuild tree', () => {
  it('1', () => {
    const pre = [1, 2, 4, 5, 3, 6, 7];
    const post = [4, 5, 2, 6, 7, 3, 1];

    const trr = [1, 2, 3, 4, 5, 6, 7];

    expect(buildTree(mid, post)).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": 4,
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": 5,
          },
          "val": 2,
        },
        "right": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": 6,
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": 7,
          },
          "val": 3,
        },
        "val": 1,
      }
    `);

    expect(createTree(trr)).toMatchInlineSnapshot(`
      TreeNode {
        "left": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": 4,
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": 5,
          },
          "val": 2,
        },
        "right": TreeNode {
          "left": TreeNode {
            "left": null,
            "right": null,
            "val": 6,
          },
          "right": TreeNode {
            "left": null,
            "right": null,
            "val": 7,
          },
          "val": 3,
        },
        "val": 1,
      }
    `);
  });

  it('2', () => {
    const post = [-1];
    const mid = [-1];

    expect(buildTree(post, mid)).toEqual(new TreeNode(-1));
  });
});
```
  
</details>


### 具体实现

```ts
const nodeMap = new Map<number, number>();

function build (
  preorder: number[],
  preStart: number,
  preEnd: number,
  postorder: number[],
  postStart: number,
  postEnd: number
) {
  if (preStart > preEnd) {
    return null;
  }

  if (preStart === preEnd) {
    return new TreeNode(preorder[preStart]);
  }

  // 根节点
  const rootVal = preorder[preStart];
  // 左子树的根节点
  const leftRootVal = preorder[preStart + 1];

  const leftRootIndex = nodeMap.get(leftRootVal);
  // 左子树的节点个数
  const leftSize = leftRootIndex - postStart + 1;

  const root = new TreeNode(rootVal);

  root.left = build(preorder, preStart + 1, preStart + leftSize, postorder, postStart, leftRootIndex);
  root.right = build(preorder, preStart + leftSize + 1, preEnd, postorder, leftRootIndex + 1, postEnd - 1);

  return root;

}

function constructFromPrePost(preorder: number[], postorder: number[]): TreeNode | null {
  postorder.forEach((v, i) => {
    nodeMap.set(v, i);  
  });

  return build(preorder, 0, preorder.length - 1, postorder, 0, postorder.length - 1);
}
```