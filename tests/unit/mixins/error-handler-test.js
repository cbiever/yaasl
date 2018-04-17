import EmberObject from '@ember/object';
import ErrorHandlerMixin from 'yaasl/mixins/error-handler';
import { module, test } from 'qunit';

module('Unit | Mixin | error-handler', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ErrorHandlerObject = EmberObject.extend(ErrorHandlerMixin);
    let subject = ErrorHandlerObject.create();
    assert.ok(subject);
  });
});
