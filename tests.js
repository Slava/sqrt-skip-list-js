Tinytest.add("sqrt-skip-list - push", function (test) {
  function eq(list, array, desc) {
    test.isTrue(EJSON.equals(list.toArray(), array), desc);
  }
  var list = new SqrtSkipList();
  eq(list, []);
  test.equal(list.length, 0);
  test.equal(list.blockRefs.length, 0);

  list.push(2);
  test.equal(list.length, 1);
  test.equal(list.blockRefs.length, 1);
  eq(list, [2]);

  list.push(2);
  test.equal(list.length, 2);
  test.equal(list.blockRefs.length, 1);
  eq(list, [2, 2]);

  list.push(5);
  test.equal(list.length, 3);
  eq(list, [2, 2, 5]);

  list.push("string");
  test.equal(list.length, 4);
  eq(list, [2, 2, 5, "string"]);

  list.push({ placeholder: 33 });
  test.equal(list.length, 5);
  eq(list, [2, 2, 5, "string", { placeholder: 33 }]);

  list.push(null);
  test.equal(list.length, 6);
  test.equal(list.blockRefs.length, 2);
  eq(list, [2, 2, 5, "string", { placeholder: 33 }, null]);
});

Tinytest.add("sqrt-skip-list - pop", function (test) {
  function eq(list, array, desc) {
    test.isTrue(EJSON.equals(list.toArray(), array), desc);
  }

  var list = new SqrtSkipList();
  var things = [1, 2, 3, 4, 5, 6, 7];
  things.forEach(list.push.bind(list));

  eq(list, things);

  while (things.length > 0) {
    test.equal(list.pop(), things.pop());
    eq(list, things);
    test.equal(list.length, things.length);
  }

  test.equal(list.length, 0);

  list.push({ haha: "can you handle it?" });
  test.equal(list.length, 1);
  eq(list, [{ haha: "can you handle it?" }]);
});

Tinytest.add("sqrt-skip-list - insert somewhere", function (test) {
  function eq(list, array, desc) {
    test.isTrue(EJSON.equals(list.toArray(), array), desc);
  }

  var list = new SqrtSkipList();
  var things = [1, 2, 3, 4, 5, 6, 7];
  things.forEach(list.push.bind(list));

  var actions = [[3, 55], [1, 44], [0, 111], [10, 1000], [5, -1], [6, 13]];

  eq(list, things);

  actions.forEach(function (action) {
    list.insert(action[1], action[0]);
    things.splice(action[0], 0, action[1]);
    eq(list, things);
  });

  test.equal(list.blockRefs.length, 3);
});

Tinytest.add("sqrt-skip-list - remove somewhere", function (test) {
  function eq(list, array, desc) {
    test.isTrue(EJSON.equals(list.toArray(), array), desc);
  }

  var list = new SqrtSkipList();
  var things = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  things.forEach(list.push.bind(list));
  test.equal(list.blockRefs.length, 4);

  var actions = [15, 14, 0, 0, 4, 3, 7, 8, 2, 2];

  eq(list, things);

  actions.forEach(function (action) {
    var removedA = list.remove(action);
    var removedB = things.splice(action, 1)[0];
    eq(list, things);
    test.equal(removedA, removedB);
    test.equal(list.blockRefs.length, Math.ceil(things.length / 5));
  });

});

Tinytest.add("sqrt-skip-list - rebalancing triggers", function (test) {
  var list = new SqrtSkipList();
  for (var i = 0; i < 50; i++)
    list.push(i);

  test.length(list.blockRefs, 10);
  test.equal(list.blockSize, 5);

  list.push(50);

  // block size grows
  test.length(list.blockRefs, 8);
  test.equal(list.blockSize, 7);

  while (list.length > 22)
    list.pop();

  test.length(list.blockRefs, 4);
  test.equal(list.blockSize, 7);

  list.pop();

  // block size drops but not below 5
  test.length(list.blockRefs, 5);
  test.equal(list.blockSize, 5);
});

Tinytest.add("sqrt-skip-list - lowerBound", function (test) {
  var list = new SqrtSkipList();
  for (var i = 0; i < 50; i++)
    list.push(i);

  var numbersComp = function (a, b) { return a-b; }

  test.equal(list.lowerBoundPosition(4, numbersComp), 4);
  test.equal(list.lowerBoundPosition(5, numbersComp), 5);
  test.equal(list.lowerBoundPosition(10, numbersComp), 10);
  test.equal(list.lowerBoundPosition(22, numbersComp), 22);
});

