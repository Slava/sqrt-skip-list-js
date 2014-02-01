

<!-- Start sqrt-skip-list.js -->

Data structure - doubly linked list with O(sqrt(n))
insert/delete/random access/search in sorted list

## toArray()

List converted to plain array

## push(item)

Appends an item to the end of the list in O(1)

### Params: 

* **any** *item* 

## pop()

Removes the last item

## insert(item, position)

Insert a new item to the position, shifts the rest

### Params: 

* **any** *item* 

* **Number** *position* 

## remove(position)

Remove an item, given the position

### Params: 

* **Number** *position* 

## get(position)

Returns item on the given position

### Params: 

* **Number** *position* 

## lowerBound(value, comp)

Finds the node an dposition of the first item for which does not compare
less than the passed value. Will work only if the list is already sorted
using the same predicate.
Returns position: -1 and node: null when such item wasn&#39;t found.

### Params: 

* **any** *value* to compare to

* **Function** *comp* predicate on which the list is sorted

## getNode(position)

Returns the reference of node (internal representation) on the given position

### Params: 

* **Number** *position* 

## _rebalance()

Decides whether to change the blockSize and recalculates the block refs in
case of change

## _updateRefs(position, direction, [justInserted])

Iterates over block refs starting from position and moves them in direction
Contract: is called *every* time one remove/insert happens

### Params: 

* **Number** *position* - first changed position

* **String** *direction* - &#39;prev&#39; or &#39;next&#39; direction of refs&#39; change

* **String** *[justInserted]* - for O(1) optimization on append

## _recalculateRefs()

Rewrites all block refs based on block size.
Called internally every time blockSize is changed

## SSLNode(data, prev, next)

Internal implementation: a single node

### Params: 

* **any** *data* - attached data

* **SSLNode** *prev* - reference to the previous node or null

* **SSLNode** *next* - reference to the next node or null

<!-- End sqrt-skip-list.js -->

