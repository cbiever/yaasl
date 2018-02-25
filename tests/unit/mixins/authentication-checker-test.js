import EmberObject from '@ember/object';
import AuthenticationCheckerMixin from 'yaasl/mixins/authentication-checker';
import { module, test } from 'qunit';

module('Unit | Mixin | AuthenticationChecker', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let AuthenticationCheckerObject = EmberObject.extend(AuthenticationCheckerMixin);
    let subject = AuthenticationCheckerObject.create();
    assert.ok(subject);
  });
});
