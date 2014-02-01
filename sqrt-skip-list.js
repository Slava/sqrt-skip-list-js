// There is no point at small block sizes. They only bring more overhead.
var MINIMAL_BLOCK_SIZE = 5;

// Data structure - doubly linked list with O(sqrt(n))
// insert/delete/random access/search in sorted list
// @constructor
SqrtSkipList = function () {
  this.length = 0;
  this.blockRefs = [];
  this.blockSize = MINIMAL_BLOCK_SIZE;
};

SqrtSkipList.prototype.toArray = function () {
  var result = [];

  this.forEach(function (item) { result.push(item) });

  return result;
};

SqrtSkipList.prototype.forEach = function (iter) {
  for (var node = this.blockRefs[0], i = 0;
       i < this.length; node = node.next, i++) {
    var r = iter(node.data, i, this);
    if (r === false)
      break;
  }
};

// TODO: for Array compitablitiy to implement:
// TODO: reverse, shift, unshift, sort, splice
// TODO: concat, join, slice, toString, toLocaleString, indexOf, lastIndexOf

SqrtSkipList.prototype.push = function (item) {
  return this.insert(item, this.length);
};

SqrtSkipList.prototype.pop = function () {
  var last = this.get(this.length - 1);
  this.remove(this.length - 1);
  return last;
};

// Insert a new item to the position, shifts the rest
// @param {any} item
// @param {number} position
SqrtSkipList.prototype.insert = function (item, position) {
  if (position > this.length || position < 0) {
    throw new Error("Can't insert at position " + position
                    + ": can only prepend, append or insert in the middle");
  }

  var node;
  if (position === this.length) {
    // first item vs append
    if (this.length === 0) {
      this.blockRefs = [new SSLNode(item, null, null)];
      this.length++;
    } else {
      node = this.getNode(this.length - 1);
      node.next = new SSLNode(item, node, null);
      this.length++;
      this._updateRefs(position, 'prev', node.next);
    }
    this._rebalance();
    return this.length;
  } else {
    node = this.getNode(position);
  }

  var itemNode = new SSLNode(item, node.prev, node);
  if (node.prev) {
    node.prev.next = itemNode;
  }
  node.prev = itemNode;
  this.length++;

  this._updateRefs(position, 'prev');
  this._rebalance();
  return this.length;
};

// Remove an item, given the position
// @param {number} position
SqrtSkipList.prototype.remove = function (position) {
  if (position >= this.length || position < 0) {
    throw new Error('There is nothing to remove on position ' + position);
  }

  var node = this.getNode(position);

  if (node.next) {
    node.next.prev = node.prev;
  }
  if (node.prev) {
    node.prev.next = node.next;
  }

  this.length--;
  this._updateRefs(position, 'next');
  this._rebalance();
};

// Returns item on the given position
// @param {number} position
SqrtSkipList.prototype.get = function (position) {
  return this.getNode(position).data;
};

// Returns the reference of node (internal representation) on the given position
// @param {number} position
SqrtSkipList.prototype.getNode = function (position) {
  if (position >= this.length) {
    throw new Error('There is nothing on position ' + position);
  }

  var blockHead = this.blockRefs[position / this.blockSize |0];
  var blockPosition = position % this.blockSize;

  for (var node = blockHead; blockPosition !== 0; blockPosition--) {
    node = node.next
  }

  return node;
};

// Decides whether to change the blockSize and recalculates the block refs in
// case of change
SqrtSkipList.prototype._rebalance = function () {
  // TODO
};

// Iterates over block refs starting from position and moves them in direction
// Contract: is called *every* time one remove/insert happens
// @param {number} position - first changed position
// @param {string} direction - 'prev' or 'next' direction of refs' change
// @param {string} [justInserted] - for O(1) optimization on append
SqrtSkipList.prototype._updateRefs = function (position, direction, justInserted) {
  var blockIndex = position / this.blockSize |0;
  var blockPosition = position % this.blockSize;

  if (blockPosition > 0)
    blockIndex++;

  for (; blockIndex < this.blockRefs.length; blockIndex++) {
    this.blockRefs[blockIndex] = this.blockRefs[blockIndex][direction];
  }

  // Create a new block ref or remove an empty block ref if needed
  var optimalBlocksNumber = Math.ceil(this.length / this.blockSize);
  if (optimalBlocksNumber < this.blockRefs.length) this.blockRefs.pop();
  if (optimalBlocksNumber > this.blockRefs.length)
    this.blockRefs.push(justInserted || this.getNode(this.length - 1));
};

// Internal implementation: a single node
// @constructor
// @param {any} data - attached data
// @param {SSLNode} prev - reference to the previous node or null
// @param {SSLNode} next - reference to the next node or null
var SSLNode = function (data, prev, next) {
  this.data = data;
  this.prev = prev;
  this.next = next;
};

