import Square from "./square";

export default class TreeNode {

    parent: TreeNode = null;
    square: Square;
    childrens: TreeNode[][] = [];

    constructor(_parent: TreeNode, _square: Square) {
        this.parent = _parent;
        this.square = _square;
        this.childrens = [];
    }
}