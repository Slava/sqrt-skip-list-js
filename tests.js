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
});
